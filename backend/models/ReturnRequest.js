import mongoose from 'mongoose';

const returnRequestSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // 'return' = customer returned a delivered order; 'cancellation' = customer cancelled an order that was already paid
    type: { type: String, enum: ['return', 'cancellation'], default: 'return' },
    reason: { type: String, required: true },
    description: { type: String, default: '' },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ['Requested', 'Approved', 'Rejected', 'Refund Initiated', 'Refund Completed'],
      default: 'Requested',
    },
    requestedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    completedAt: { type: Date },

    // Refund details (embedded — one refund per return in this simplified flow)
    refundAmount: { type: Number, default: 0 },
    refundMethod: { type: String, enum: ['wallet', 'original_payment', ''], default: '' },
    refundStatus: {
      type: String,
      enum: ['not_started', 'pending', 'processed'],
      default: 'not_started',
    },
    refundProcessedAt: { type: Date },
    // How much of this refund was put into the customer's wallet, and when (drives the wallet history)
    walletCredited: { type: Number, default: 0 },
    walletCreditedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('ReturnRequest', returnRequestSchema);
