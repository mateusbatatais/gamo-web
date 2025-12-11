/* eslint-disable @typescript-eslint/no-explicit-any */
// scripts/upload-to-imagekit.ts
/**
 * Script to upload all images from /public to ImageKit
 *
 * This script will:
 * 1. Scan all images in /public/images
 * 2. Upload them to ImageKit maintaining the same folder structure
 * 3. Skip files that already exist
 *
 * Usage:
 *   pnpm tsx scripts/upload-to-imagekit.ts
 */

import ImageKit from "imagekit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

// Directory to upload
const PUBLIC_DIR = path.join(__dirname, "..", "public", "images");

// Supported image extensions
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"];

/**
 * Get all image files recursively
 */
function getImageFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getImageFiles(fullPath, baseDir));
    } else {
      const ext = path.extname(item).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Upload a single file to ImageKit
 */
async function uploadFile(filePath: string, baseDir: string): Promise<void> {
  const relativePath = path.relative(baseDir, filePath);
  const folder = path.dirname(relativePath).replace(/\\/g, "/");
  const fileName = path.basename(filePath);

  // ImageKit folder path (without leading slash)
  const imagekitFolder = folder === "." ? "" : folder;

  try {
    console.log(`Uploading: ${relativePath}...`);

    const fileBuffer = fs.readFileSync(filePath);

    const result = await imagekit.upload({
      file: fileBuffer,
      fileName: fileName,
      folder: imagekitFolder,
      useUniqueFileName: false, // Keep original filename
      tags: ["public-images", "auto-upload"],
    });

    console.log(`✅ Uploaded: ${result.filePath}`);
  } catch (error: any) {
    if (error.message?.includes("already exists")) {
      console.log(`⏭️  Skipped (already exists): ${relativePath}`);
    } else {
      console.error(`❌ Error uploading ${relativePath}:`, error.message);
    }
  }
}

/**
 * Main function
 */
async function main() {
  console.log("🚀 Starting ImageKit upload...\n");

  // Check environment variables
  if (
    !process.env.IMAGEKIT_PUBLIC_KEY ||
    !process.env.IMAGEKIT_PRIVATE_KEY ||
    !process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
  ) {
    console.error("❌ Error: ImageKit credentials not found in .env.local");
    console.error("Please make sure you have:");
    console.error("  - IMAGEKIT_PUBLIC_KEY");
    console.error("  - IMAGEKIT_PRIVATE_KEY");
    console.error("  - NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT");
    process.exit(1);
  }

  // Check if public/images exists
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error(`❌ Error: Directory not found: ${PUBLIC_DIR}`);
    process.exit(1);
  }

  // Get all image files
  const imageFiles = getImageFiles(PUBLIC_DIR);

  console.log(`Found ${imageFiles.length} images to upload\n`);

  if (imageFiles.length === 0) {
    console.log("No images found to upload.");
    return;
  }

  // Upload files one by one (to avoid rate limits)
  let uploaded = 0;
  const skipped = 0;
  let failed = 0;

  for (const file of imageFiles) {
    try {
      await uploadFile(file, PUBLIC_DIR);
      uploaded++;

      // Small delay to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      failed++;
    }
  }

  console.log("\n📊 Upload Summary:");
  console.log(`  ✅ Uploaded: ${uploaded}`);
  console.log(`  ⏭️  Skipped: ${skipped}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  📁 Total: ${imageFiles.length}`);

  console.log("\n✨ Done!");
}

// Run the script
main().catch(console.error);
