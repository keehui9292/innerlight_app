import { Platform } from 'react-native';
import * as ImageResizer from 'react-native-image-resizer';

const MAX_WIDTH = 2500;
const QUALITY = 85; // 85% quality to maintain good visuals with compression

/**
 * Compress image for upload
 * - Mobile: Uses react-native-image-resizer to resize and compress
 * - Web: Uses canvas-based compression
 */
export async function compressImage(fileOrAsset: any): Promise<File | Blob> {
  if (Platform.OS === 'web') {
    return compressImageWeb(fileOrAsset);
  } else {
    return compressImageMobile(fileOrAsset);
  }
}

/**
 * Web: Compress image using canvas
 */
async function compressImageWeb(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let newWidth = img.width;
        let newHeight = img.height;

        if (img.width > MAX_WIDTH) {
          newWidth = MAX_WIDTH;
          newHeight = (img.height * MAX_WIDTH) / img.width;
        }

        // Create canvas and compress
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Convert to blob with quality compression
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create new File from blob
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          QUALITY / 100
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Mobile: Compress image using react-native-image-resizer
 */
async function compressImageMobile(asset: any): Promise<File> {
  try {
    // Get dimensions first
    const dimensions = await getImageDimensions(asset.uri);

    let width = dimensions.width;
    let height = dimensions.height;

    // Calculate new dimensions
    if (width > MAX_WIDTH) {
      height = (height * MAX_WIDTH) / width;
      width = MAX_WIDTH;
    }

    // Resize and compress
    const result = await ImageResizer.createResizedImage(
      asset.uri,
      width,
      height,
      'JPEG',
      QUALITY,
      0,
      undefined,
      false,
      { mode: 'contain' }
    );

    // Fetch the resized image and convert to File
    const response = await fetch(result.uri);
    const blob = await response.blob();

    const filename = asset.filename || `image_${Date.now()}.jpg`;
    const file = new File([blob], filename, {
      type: 'image/jpeg',
    });

    return file;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
}

/**
 * Get image dimensions (for mobile)
 */
function getImageDimensions(uri: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject(new Error('Failed to get image dimensions'));
    };
    img.src = uri;
  });
}
