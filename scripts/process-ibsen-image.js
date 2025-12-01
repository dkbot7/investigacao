/**
 * Process Ibsen image - convert to WebP and AVIF
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputImage = process.argv[2] || path.join(__dirname, '..', 'ibsen_new.jpg');
const outputDir = path.join(__dirname, '..', 'investigaree', 'public', 'images');

async function processImage() {
  console.log('Processing image:', inputImage);

  if (!fs.existsSync(inputImage)) {
    console.error('Input image not found:', inputImage);
    process.exit(1);
  }

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Process with sharp
  const image = sharp(inputImage);
  const metadata = await image.metadata();

  console.log('Image metadata:', metadata);

  // Resize to reasonable size for web (max 800px width)
  const resizedImage = image.resize(800, null, { withoutEnlargement: true });

  // Save as JPG
  await resizedImage
    .clone()
    .jpeg({ quality: 85 })
    .toFile(path.join(outputDir, 'ibsen-maciel.jpg'));
  console.log('Saved: ibsen-maciel.jpg');

  // Save as WebP
  await resizedImage
    .clone()
    .webp({ quality: 85 })
    .toFile(path.join(outputDir, 'ibsen-maciel.webp'));
  console.log('Saved: ibsen-maciel.webp');

  // Save as AVIF
  await resizedImage
    .clone()
    .avif({ quality: 80 })
    .toFile(path.join(outputDir, 'ibsen-maciel.avif'));
  console.log('Saved: ibsen-maciel.avif');

  console.log('\nAll images saved to:', outputDir);
}

processImage().catch(console.error);
