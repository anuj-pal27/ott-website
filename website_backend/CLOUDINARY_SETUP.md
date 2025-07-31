# Cloudinary Setup Guide

## Prerequisites
1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your Cloudinary credentials from the dashboard

## Environment Variables
Add the following variables to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## How to Get Cloudinary Credentials

1. **Sign up/Login** to [Cloudinary Dashboard](https://cloudinary.com/console)
2. **Go to Dashboard** and find your account details
3. **Copy the credentials**:
   - Cloud Name: Found in the dashboard header
   - API Key: Found in the "API Keys" section
   - API Secret: Found in the "API Keys" section

## Features Implemented

### Image Upload
- ✅ Automatic image optimization
- ✅ Format conversion (WebP, AVIF when supported)
- ✅ Progressive JPEG loading
- ✅ Size optimization (800x600 max dimensions)
- ✅ Quality auto-adjustment

### Image Management
- ✅ Automatic cleanup of old images when updating
- ✅ Image deletion when subscription plans are deleted
- ✅ Public ID tracking for efficient management

### Security
- ✅ File type validation (images only)
- ✅ File size limits (5MB max)
- ✅ Admin-only access
- ✅ Secure URL generation

## Usage

### Frontend
The image upload functionality is available in:
- Add Subscription Plan page
- Edit Subscription Plan page

### Backend API
- `POST /api/admin/upload-image` - Upload image to Cloudinary
- Images are automatically optimized and stored in the `subscription-images` folder

## Benefits of Cloudinary

1. **Performance**: Automatic image optimization and CDN delivery
2. **Scalability**: No server storage limitations
3. **Cost-effective**: Free tier with generous limits
4. **Automatic optimization**: WebP, AVIF, and progressive loading
5. **Global CDN**: Fast image delivery worldwide
6. **Transformations**: On-the-fly image resizing and cropping

## Troubleshooting

### Common Issues

1. **"Cloudinary configuration error"**
   - Check your environment variables
   - Ensure all three Cloudinary variables are set

2. **"Upload failed"**
   - Check file size (max 5MB)
   - Ensure file is an image format
   - Verify Cloudinary credentials

3. **"Image not displaying"**
   - Check if the URL is accessible
   - Verify the image was uploaded successfully

### Support
For Cloudinary-specific issues, refer to the [Cloudinary Documentation](https://cloudinary.com/documentation) 