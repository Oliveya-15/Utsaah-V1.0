import ReturnRequest from '../models/ReturnRequest.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { notifyUser } from '../utils/notify.js';

const RETURN_WINDOW_DAYS = 7;

// @desc Request a return (within 7 days of delivery)
// @route POST /api/returns/:orderId
export const requestReturn = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    if (order.orderStatus !== 'Delivered' && order.orderStatus !== 'Completed') {
      return res.status(400).json({ message: 'Returns can only be requested after the order has been delivered' });
    }
    if (order.deliveredAt) {
      const daysSince = (Date.now() - new Date(order.deliveredAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince > RETURN_WINDOW_DAYS) {
        return res.status(400).json({ message: `The ${RETURN_WINDOW_DAYS}-day return window for this order has closed` });
      }
    }
    const existing = await ReturnRequest.findOne({ order: order._id });
    if (existing) return res.status(400).json({ message: 'A return request already exists for this order' });

    const images = (req.files || []).map((f) => f.path);

    const returnReq = await ReturnRequest.create({
      order: order._id,
      user: req.user._id,
      reason: req.body.reason,
      description: req.body.description || '',
      images,
    });

    order.orderStatus = 'Return Requested';
    order.statusHistory.push({ status: 'Return Requested', note: req.body.reason });
    await order.save();

    res.status(201).json(returnReq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get my returns
// @route GET /api/returns/my
export const getMyReturns = async (req, res) => {
  const returns = await ReturnRequest.find({ user: req.user._id }).populate('order', 'orderNumber totalAmount walletUsed').sort({ createdAt: -1 });
  res.json(returns);
};

// ---------- Admin ----------

// @route GET /api/returns/admin/all
export const getAllReturnsAdmin = async (req, res) => {
  const returns = await ReturnRequest.find()
    .populate('user', 'name email phone')
    .populate('order', 'orderNumber totalAmount walletUsed items')
    .sort({ createdAt: -1 });
  res.json(returns);
};

// @desc Admin approves/rejects a return
// @route PUT /api/returns/:id/decision
export const decideReturn = async (req, res) => {
  const { decision } = req.body; // 'Approved' | 'Rejected'
  const returnReq = await ReturnRequest.findById(req.params.id);
  if (!returnReq) return res.status(404).json({ message: 'Return request not found' });

  returnReq.status = decision;
  if (decision === 'Approved') returnReq.approvedAt = new Date();
  await returnReq.save();

  const order = await Order.findById(returnReq.order);
  if (order) {
    order.orderStatus = decision === 'Approved' ? 'Return Approved' : 'Delivered';
    order.statusHistory.push({ status: order.orderStatus, note: `Return ${decision.toLowerCase()} by admin` });
    await order.save();
  }

  notifyUser({
    userId: returnReq.user,
    title: `Return request ${decision.toLowerCase()}`,
    message: decision === 'Approved'
      ? 'Your return request has been approved. Our team will process your refund shortly and let you know once it is done.'
      : 'Your return request was not approved. Contact support if you have questions.',
    type: 'return',
  });

  res.json(returnReq);
};

// @desc Admin processes the refund. This is the ONLY place money is put into a
//       customer's wallet for a return / cancellation refund.
//       - wallet            -> everything (UPI amount + any wallet balance used) goes to the wallet now
//       - original_payment  -> the UPI amount is sent back manually by the admin (mark it complete
//                              afterwards); any wallet balance the customer used goes back to the wallet now
// @route PUT /api/returns/:id/refund
export const processRefund = async (req, res) => {
  const { refundMethod } = req.body; // 'wallet' | 'original_payment'
  if (!['wallet', 'original_payment'].includes(refundMethod)) {
    return res.status(400).json({ message: 'Please choose a refund method' });
  }

  const returnReq = await ReturnRequest.findById(req.params.id).populate('order');
  if (!returnReq) return res.status(404).json({ message: 'Return request not found' });
  if (returnReq.status !== 'Approved') {
    return res.status(400).json({ message: 'Only approved requests can be refunded' });
  }

  const order = returnReq.order;
  const cashPaid = order.totalAmount || 0; // what the customer actually paid via UPI
  const walletPortion = order.walletUsed || 0; // what they paid from their wallet
  // If nothing was paid by UPI there is nothing to send back, so it all goes to the wallet.
  const method = cashPaid === 0 ? 'wallet' : refundMethod;

  const walletCredit = method === 'wallet' ? cashPaid + walletPortion : walletPortion;
  const now = new Date();

  if (walletCredit > 0) {
    await User.findByIdAndUpdate(returnReq.user, { $inc: { walletBalance: walletCredit } });
    returnReq.walletCredited = walletCredit;
    returnReq.walletCreditedAt = now;
  }

  returnReq.refundMethod = method;
  returnReq.refundAmount = method === 'wallet' ? walletCredit : cashPaid;
  if (method === 'wallet') {
    returnReq.refundStatus = 'processed';
    returnReq.status = 'Refund Completed';
    returnReq.completedAt = now;
    returnReq.refundProcessedAt = now;
  } else {
    returnReq.refundStatus = 'pending';
    returnReq.status = 'Refund Initiated';
  }
  await returnReq.save();

  const orderDoc = await Order.findById(order._id);
  if (orderDoc) {
    // A cancelled order stays "Cancelled"; only a returned order moves on to the refund statuses.
    if (returnReq.type === 'return') orderDoc.orderStatus = returnReq.status;
    if (method === 'wallet') orderDoc.paymentStatus = 'refunded';
    orderDoc.statusHistory.push({
      status: returnReq.status,
      note: method === 'wallet' ? `₹${walletCredit} refunded to the customer's wallet` : `₹${cashPaid} to be sent back via UPI`,
    });
    await orderDoc.save();
  }

  notifyUser({
    userId: returnReq.user,
    title: 'Refund update',
    message: method === 'wallet'
      ? `₹${walletCredit} for order #${order.orderNumber} has been added to your Utsaah Wallet.`
      : `Your refund of ₹${cashPaid} for order #${order.orderNumber} is being sent back to your original payment method. We'll let you know once it's sent.${walletPortion > 0 ? ` ₹${walletPortion} of wallet balance has been returned to your wallet.` : ''}`,
    type: 'refund',
  });

  res.json(returnReq);
};

// @desc Admin marks an "original payment method" refund as completed (after actually sending it back via UPI/bank transfer)
// @route PUT /api/returns/:id/complete
export const markRefundCompleted = async (req, res) => {
  const returnReq = await ReturnRequest.findById(req.params.id);
  if (!returnReq) return res.status(404).json({ message: 'Return request not found' });
  if (returnReq.status !== 'Refund Initiated') {
    return res.status(400).json({ message: 'There is no pending refund to complete' });
  }

  returnReq.refundStatus = 'processed';
  returnReq.status = 'Refund Completed';
  returnReq.completedAt = new Date();
  returnReq.refundProcessedAt = new Date();
  await returnReq.save();

  const order = await Order.findById(returnReq.order);
  if (order) {
    if (returnReq.type === 'return') order.orderStatus = 'Refund Completed';
    order.paymentStatus = 'refunded';
    order.statusHistory.push({ status: 'Refund Completed', note: `₹${returnReq.refundAmount} sent back to the customer` });
    await order.save();
  }

  notifyUser({
    userId: returnReq.user,
    title: 'Refund sent',
    message: `Your refund of ₹${returnReq.refundAmount} has been sent back to your original payment method.`,
    type: 'refund',
  });

  res.json(returnReq);
};
