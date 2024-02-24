// const express = require('express');
// const app = express();
const { Storage } = require('@google-cloud/storage');
// const multer = require('multer');
const path = require('path');
// const { v4: uuidv4 } = require('node-uuid');

// const keypath = require('./survey-management-qc-cef1f28f1dc7.json');

// const storageMulter = multer.diskStorage({
//   destination: 'uploads/',
//   filename: (req, file, callback) => {
//     const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
//     callback(null, uniqueFileName);
//   },
// });

// const upload = multer({ storageMulter });
// Initialize Google Cloud Storage
const keyFilename = path.join(__dirname, 'survey-management-qc-cef1f28f1dc7.json');
const storage = new Storage({
  keyFilename,
  // '../survey-management-qc-cef1f28f1dc7.json', // Path to your GCP service account key file
  projectId: 'survey-management-qc', // Your Google Cloud project ID
});
const bucketName = 'surveymng'; // Your Google Cloud Storage bucket name
const bucket = storage.bucket(bucketName);

// Middleware function for file upload
const uploadFileMiddleware = (req, res, next) => {
  if (!req.file) {
    console.log('No file uploaded');
  }
  const { file } = req;
  const blob = bucket.file(file.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.mimetype,
    },
  });
  blobStream.on('error', (err) => {
    console.error('Error uploading file:', err);
    // return res.status(500).json({ error: 'Failed to upload file' });
  });

  blobStream.on('finish', () => {
    // File upload successful
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    req.fileUrl = publicUrl; // Attach file URL to request object
    next();
  });
  // Pipe the file data to the bucket
  blobStream.end(file.buffer);
};

module.exports = { uploadFileMiddleware };
