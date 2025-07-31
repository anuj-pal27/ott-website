const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

// Convert buffer to stream for Cloudinary
const bufferToStream = (buffer) => {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    }
  });
  return readable;
};

// Upload image to Cloudinary
const uploadToCloudinary = async (file, folder = 'subscription-images') => {
  try {
    // Convert file buffer to stream
    const stream = bufferToStream(file.buffer);
    
    // Upload options
    const uploadOptions = {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { width: 800, height: 600, crop: 'limit' }, // Resize to reasonable dimensions
        { quality: 'auto', fetch_format: 'auto' }, // Optimize quality and format
        { flags: 'progressive' } // Progressive JPEG for better loading
      ],
      public_id: `subscription_${Date.now()}_${Math.random().toString(36).substring(7)}`
    };

    // Upload to Cloudinary
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error('Failed to upload image to Cloudinary'));
          } else {
            resolve({
              url: result.secure_url,
              public_id: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
              size: result.bytes
            });
          }
        }
      );

      stream.pipe(uploadStream);
    });
  } catch (error) {
    console.error('Error in uploadToCloudinary:', error);
    throw new Error('Image upload failed');
  }
};

// Delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
};

// Generate optimized image URL
const getOptimizedImageUrl = (publicId, options = {}) => {
  const defaultOptions = {
    width: 400,
    height: 300,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  };

  const finalOptions = { ...defaultOptions, ...options };
  
  return cloudinary.url(publicId, {
    transformation: [finalOptions]
  });
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  getOptimizedImageUrl
}; 