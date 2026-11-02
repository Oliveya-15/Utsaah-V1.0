// An order is created the moment the customer chooses how to pay, so an order
// that is still "Order Received" with an unpaid payment really means
// "waiting for payment". Show it that way instead of looking like it's confirmed.
export const getDisplayStatus = (order) =>
  order.orderStatus === 'Order Received' && order.paymentStatus === 'pending'
    ? 'Awaiting Payment'
    : order.orderStatus;

// Short helper text shown under the status badge in the orders list.
export const STATUS_HINTS = {
  'Awaiting Payment': 'Payment not made yet. Tap to complete it.',
  'Payment Reported': "We're verifying your payment.",
  'Payment Declined': "We couldn't confirm your payment. Tap to try again.",
};
