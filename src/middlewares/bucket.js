// const { Storage } = require('@google-cloud/storage');
// const path = require('path');

// // Initialize Google Cloud Storage
// const keyFilename = path.join(__dirname, 'survey-management-qc-cef1f28f1dc7.json');
// const storage = new Storage({
//   keyFilename,
//   projectId: 'survey-management-qc',
// });
// const bucketName = 'surveymng';
// const bucket = storage.bucket(bucketName);

// // Middleware function for file upload
// const uploadFileMiddleware = (req, res, next) => {
//   if (!req.file) {
//     console.log('No file uploaded');
//   }
//   const { file } = req;
//   const blob = bucket.file(file.originalname);
//   const blobStream = blob.createWriteStream({
//     resumable: false,
//     metadata: {
//       contentType: file.mimetype,
//     },
//   });
//   blobStream.on('error', (err) => {
//     console.error('Error uploading file:', err);
//     // return res.status(500).json({ error: 'Failed to upload file' });
//   });

//   blobStream.on('finish', () => {
//     // File upload successful
//     const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
//     req.fileUrl = publicUrl; // Attach file URL to request object
//     next();
//   });
//   // Pipe the file data to the bucket
//   blobStream.end(file.buffer);
// };

// module.exports = { uploadFileMiddleware };

const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Initialize Google Cloud Storage
const keyFilename = path.join(__dirname, 'survey-management-qc-cef1f28f1dc7.json');
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
  console.log('Default object ACL set to public-read.');
}

// Middleware function for file upload
const uploadFileMiddleware = async (req, res, next) => {
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

  blobStream.on('finish', async () => {
    // File upload successful
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    req.fileUrl = publicUrl; // Attach file URL to request object
     console.log(req.fileUrl)

    await setDefaultObjectAcl(); // Set default object ACL
    next();
  });
 
  // Pipe the file data to the bucket
  blobStream.end(file.buffer);
};

module.exports = { uploadFileMiddleware };
