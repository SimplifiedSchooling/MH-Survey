const { Storage } = require('@google-cloud/storage');
const path = require('path');
const logger = require('../config/logger');

// Initialize Google Cloud Storage
const keyFilename = path.join(__dirname, './uploads/survey-management-qc-c4d95fc7a086.json');
const storage = new Storage({
  keyFilename,
  projectId: 'survey-management-qc',
});
const bucketName = 'surveymng';
const bucket = storage.bucket(bucketName);

// Set default object ACL to public-read
async function setDefaultObjectAcl() {
  await bucket.setMetadata({
    defaultObjectAcl: [
      {
        entity: 'allUsers',
        role: storage.acl.READER_ROLE,
      },
    ],
  });
}

// Middleware function for file upload
const uploadFileMiddleware = async (req, res, next) => {
  if (!req.file) {
    logger.error('No file uploaded');
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
    logger.error('Error uploading file:', err);
  });

  blobStream.on('finish', async () => {
    // File upload successful
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    req.fileUrl = publicUrl;

    await setDefaultObjectAcl();
    next();
  });
  blobStream.end(file.buffer);
};

module.exports = { uploadFileMiddleware };
