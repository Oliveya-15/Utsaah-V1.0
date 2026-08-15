// Seeds the Kriya customizer with its two starter categories — "Flower" and
// "Paper" — using the real transparent PNG cutouts shipped in
// backend/seed/kriya-assets/{flower,paper}/. Every image is uploaded to
// Cloudinary (never local disk) and the resulting secure URLs are what get
// saved on the KriyaElement documents.
//
// Run with:  npm run seed:kriya          (populate)
//            npm run seed:kriya -- -d    (wipe Kriya data only)
//
// Requires the same Cloudinary env vars as the rest of the app
// (CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET) to
// already be set in backend/.env.
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import cloudinary from '../config/cloudinary.js';
import KriyaCategory from '../models/KriyaCategory.js';
import KriyaElement from '../models/KriyaElement.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, 'kriya-assets');

const CATEGORY_DEFS = [
  { folder: 'flower', name: 'Flower', icon: '🌸', description: 'Blooms and floral cutouts to build your bouquet', displayOrder: 1 },
  { folder: 'paper', name: 'Paper', icon: '📄', description: 'Wrapping paper textures and paper-craft pieces', displayOrder: 2 },
];

const isImageFile = (filename) => /\.(png|jpe?g|webp)$/i.test(filename);

const uploadOne = (filePath, folder) =>
  cloudinary.uploader.upload(filePath, {
    folder: `utsaah/kriya/elements/${folder}`,
    transformation: [{ width: 2000, height: 2000, crop: 'limit' }],
  });

const seedKriya = async () => {
  await connectDB();
  console.log('\n🌸 Seeding Kriya customizer data...\n');

  for (const def of CATEGORY_DEFS) {
    const dirPath = path.join(ASSETS_DIR, def.folder);
    if (!fs.existsSync(dirPath)) {
      console.warn(`  ⚠️  Skipping "${def.name}" — folder not found at ${dirPath}`);
      continue;
    }

    let category = await KriyaCategory.findOne({ name: def.name });
    if (!category) {
      category = await KriyaCategory.create({
        name: def.name,
        icon: def.icon,
        description: def.description,
        displayOrder: def.displayOrder,
      });
      console.log(`  ✓ Created category "${def.name}"`);
    } else {
      console.log(`  · Category "${def.name}" already exists, reusing it`);
    }

    const files = fs.readdirSync(dirPath).filter(isImageFile).sort();
    let count = 0;
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const elementName = `${def.name} ${++count}`;

      const alreadyExists = await KriyaElement.findOne({ category: category._id, name: elementName });
      if (alreadyExists) {
        console.log(`    · "${elementName}" already exists, skipping upload`);
        continue;
      }

      process.stdout.write(`    ↑ Uploading "${elementName}" (${file})... `);
      const result = await uploadOne(filePath, def.folder);
      await KriyaElement.create({
        name: elementName,
        category: category._id,
        image: result.secure_url,
        imagePublicId: result.public_id,
        displayOrder: count,
      });
      console.log('done');
    }
  }

  console.log('\n✅ Kriya seed complete.\n');
  await mongoose.connection.close();
  process.exit(0);
};

const destroyKriya = async () => {
  await connectDB();
  console.log('\n🗑️  Removing all Kriya categories & elements (Cloudinary assets are left untouched)...\n');
  await KriyaElement.deleteMany();
  await KriyaCategory.deleteMany();
  console.log('✅ Done.\n');
  await mongoose.connection.close();
  process.exit(0);
};

if (process.argv.includes('-d')) {
  destroyKriya().catch((err) => {
    console.error(err);
    process.exit(1);
  });
} else {
  seedKriya().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
