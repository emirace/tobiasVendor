import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { isAdmin, isAuth, isSellerOrAdmin } from '../utils.js';
import fs from 'fs';
import sharp from 'sharp';

const upload = multer();

const uploadRouter = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

uploadRouter.post('/', isAuth, upload.single('file'), async (req, res) => {
  const streamUpload = () => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };
  const result = await streamUpload(req);
  res.send(result);
});

uploadRouter.post(
  '/video/upload',
  isAuth,
  upload.single('file'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }

    // Check if the file size exceeds the maximum allowed size (e.g., 8MB)
    const maxSize = 8 * 1024 * 1024; // 8MB
    if (req.file.size > maxSize) {
      return res
        .status(400)
        .json({ message: 'Video file exceeds the maximum allowed size' });
    }

    const stream = streamifier.createReadStream(req.file.buffer);
    console.log(req.file);
    console.log(stream);

    // Upload the video stream to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'video', public_id: req.file.originalname },
      (error, result) => {
        if (error) {
          console.log('Upload error:', error);
          return res.status(500).json({ message: 'Video upload failed' });
        }

        // The upload was successful
        console.log('Upload result:', result);

        // You can save the secure URL (result.secure_url) to your database or perform any other necessary actions

        res.json({ secure_url: result.secure_url });
      }
    );

    // Pipe the MultiStream to the Cloudinary upload stream
    stream.pipe(uploadStream);
  }
);

uploadRouter.delete('/', isAuth, async (req, res) => {
  await cloudinary.uploader.destroy(req.body.image, function (result) {});
});

export default uploadRouter;
