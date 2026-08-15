import mongoose from 'mongoose';

// A single draggable asset (a flower cutout, a paper texture, etc.) that
// shows up in the sidebar once its category is selected. Uploaded by an
// admin — image always lives on Cloudinary, never on local disk.
const kriyaElementSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'KriyaCategory', required: true },
    image: { type: String, required: true }, // secure Cloudinary URL
    imagePublicId: { type: String, default: '' }, // Cloudinary public_id, kept for future asset cleanup
    defaultSize: { type: Number, default: 140 }, // starting width (px) when dropped on the canvas, height auto-scales
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

kriyaElementSchema.index({ category: 1, displayOrder: 1 });

export default mongoose.model('KriyaElement', kriyaElementSchema);
