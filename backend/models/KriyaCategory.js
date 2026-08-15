import mongoose from 'mongoose';
import slugify from 'slugify';

// A category groups draggable elements in the Kriya customizer sidebar
// (e.g. "Flower", "Paper"). Admins can add as many of these as they like
// from the admin panel — nothing about the tabs is hardcoded.
const kriyaCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '' }, // optional emoji shown next to the tab label
    coverImage: { type: String, default: '' }, // optional Cloudinary thumbnail for the tab
    isActive: { type: Boolean, default: true }, // inactive categories are hidden from the customizer
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

kriyaCategorySchema.pre('validate', function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model('KriyaCategory', kriyaCategorySchema);
