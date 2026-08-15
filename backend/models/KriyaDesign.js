import mongoose from 'mongoose';

// One element as placed on the canvas at the moment the design was finalized.
// We snapshot `image` (rather than only the ref) so the design still renders
// correctly even if that element is edited/retired from the library later.
const placedElementSchema = new mongoose.Schema(
  {
    element: { type: mongoose.Schema.Types.ObjectId, ref: 'KriyaElement', required: true },
    image: { type: String, required: true },
    x: { type: Number, required: true }, // center x, in canvas px (canvasSize coordinate space)
    y: { type: Number, required: true }, // center y
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    rotation: { type: Number, default: 0 }, // degrees
    zIndex: { type: Number, default: 0 }, // stacking / layer order
    flipX: { type: Boolean, default: false },
  },
  { _id: false }
);

// Mirrors the CustomRequest quote workflow: a finalized Kriya design isn't an
// instant fixed-price order (it's a bespoke arrangement), so it goes through
// the same "request -> admin quotes -> converted to order" pipeline.
export const KRIYA_STATUSES = ['New', 'In Discussion', 'Quotation Sent', 'Accepted', 'Converted To Order', 'Declined'];

const kriyaDesignSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null for guest submissions
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    title: { type: String, default: 'My Kriya Design' },
    canvasSize: {
      width: { type: Number, default: 800 },
      height: { type: Number, default: 800 },
    },
    elements: [placedElementSchema],
    previewImage: { type: String, default: '' }, // Cloudinary snapshot of the finished canvas
    notes: { type: String, default: '' },
    status: { type: String, enum: KRIYA_STATUSES, default: 'New' },
    quotedPrice: { type: Number, default: 0 },
    adminReply: { type: String, default: '' },
    relatedOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
  },
  { timestamps: true }
);

export default mongoose.model('KriyaDesign', kriyaDesignSchema);
