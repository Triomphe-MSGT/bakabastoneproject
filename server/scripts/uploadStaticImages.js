
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const imagesDir = path.join(__dirname, '../../public/images');
const images = fs.readdirSync(imagesDir);

console.log('🚀 Starting static images upload to Cloudinary...');

const uploadImages = async () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'votre_cloud_name') {
    console.error('❌ Error: Please fill your Cloudinary credentials in server/.env first!');
    return;
  }

  const results = {};

  for (const image of images) {
    if (image.match(/\.(png|jpg|jpeg|webp|gif)$/i)) {
      try {
        console.log(`Uploading ${image}...`);
        const result = await cloudinary.uploader.upload(path.join(imagesDir, image), {
          folder: 'bakaba-static',
          public_id: path.parse(image).name
        });
        results[image] = result.secure_url;
        console.log(`✅ ${image} -> ${result.secure_url}`);
      } catch (error) {
        console.error(`❌ Failed to upload ${image}:`, error.message);
      }
    }
  }

  console.log('\n✨ All done! Here are your new URLs to use in your code:\n');
  console.log(JSON.stringify(results, null, 2));
  
  console.log('\n📝 Next steps:');
  console.log('1. Copy these URLs.');
  console.log('2. Replace the local paths in your React components (like Home.jsx).');
};

uploadImages();
