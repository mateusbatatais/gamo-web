// lib/imagekit-loader.ts
import { ImageLoaderProps } from "next/image";

/**
 * Custom image loader for ImageKit CDN
 *
 * This loader transforms image URLs to use ImageKit's CDN with automatic optimization.
 *
 * Features:
 * - Automatic format conversion (WebP/AVIF)
 * - Responsive image sizing
 * - Quality optimization
 * - External URL proxying via ImageKit Web Proxy (RAWG, Cloudinary, etc.)
 * - Local images served from ImageKit after upload
 * - SVG detection and bypass
 *
 * @see https://docs.imagekit.io/integration/url-endpoints
 * @see https://docs.imagekit.io/features/image-transformations
 */
export default function imagekitLoader({ src, width, quality }: ImageLoaderProps): string {
  // Skip SVG files - they don't need optimization
  if (src.endsWith(".svg")) {
    return src;
  }

  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!urlEndpoint) {
    console.warn("NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is not set. Using original image URL.");
    return src;
  }

  // Remove trailing slash from endpoint
  const endpoint = urlEndpoint.replace(/\/$/, "");

  // ImageKit transformation parameters
  // tr = transformation
  // w = width
  // q = quality (1-100)
  // f = format (auto = automatic WebP/AVIF based on browser support)
  const transformations = `tr=w-${width},q-${quality || 75},f-auto`;

  // Handle external URLs (RAWG, Cloudinary, etc.)
  // ImageKit will fetch and optimize these via Web Proxy
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return `${endpoint}/${src}?${transformations}`;
  }

  // Handle local/public images
  // After running upload script, these will be available on ImageKit
  // Remove leading slash if present (ImageKit expects path without leading /)
  const path = src.startsWith("/") ? src.slice(1) : src;

  return `${endpoint}/${path}?${transformations}`;
}
