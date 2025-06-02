# Cloudinary Configuration

To enable vehicle image uploads, you need to configure Cloudinary properly.

## 1. Environment Variables

Add these variables to your `.env` file:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 3. Cloudinary Setup

1. **Create an account** on [Cloudinary](https://cloudinary.com)

2. **Get your Cloud Name**:

   - Go to Dashboard
   - Copy the "Cloud name" value

3. **Get your API Key and Secret**:

   - Go to Dashboard > API Keys
   - Copy the "API Key" and "API Secret" values

4. **Create an Upload Preset**:
   - Navigate to Settings > Upload
   - Scroll to "Upload presets" section
   - Click "Add upload preset"
   - Recommended settings:
     - **Preset name**: `carlink_vehicles`
     - **Signing Mode**: `Unsigned`
     - **Folder**: `carlink/vehicles`

## 4. Folder Structure

Uploaded images will be automatically organized in:

```
carlink/
  └── vehicles/
      ├── image1.jpg
      ├── image2.jpg
      └── ...
```
