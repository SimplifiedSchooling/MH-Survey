// const { Storage } = require('@google-cloud/storage');
// const path = require('path');
// const retry = require('async-retry');
// const logger = require('../config/logger');

// // Initialize Google Cloud Storage
// const keyFilename = path.join(__dirname, './uploads/survey-management-qc-c4d95fc7a086.json');
// const storage = new Storage({
//   keyFilename,
//   projectId: 'survey-management-qc',
// });
// const bucketName = 'surveymng';
// const bucket = storage.bucket(bucketName);

// async function setDefaultObjectAcl() {
//   await bucket.setMetadata({
//     defaultObjectAcl: [
//       {
//         entity: 'allUsers',
//         role: storage.acl.READER_ROLE,
//       },
//     ],
//   });
// };

// const uploadFileMiddleware = async (req, res, next) => {
//   if (!req.file) {
//     logger.error('No file uploaded');
//     return res.status(400).send('No file uploaded');
//   }

//   const { file } = req;

//   try {
//     await retry(
//       async () => {
//         const blob = bucket.file(file.originalname);
//         await new Promise((resolve, reject) => {
//           const blobStream = blob.createWriteStream({
//             resumable: false,
//             metadata: {
//               contentType: file.mimetype,
//             },
//           });
//           blobStream.on('error', reject);
//           blobStream.on('finish', resolve);
//           blobStream.end(file.buffer);
//         });
//       },
//       {
//         retries: 5,
//         minTimeout: 1000,
//         maxTimeout: 5000,
//       }
//     );

//     await setDefaultObjectAcl();
//     const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.originalname}`;
//     req.fileUrl = publicUrl;

//     next();
//   } catch (error) {
//     logger.error('Error uploading file:', error);
//     res.status(500).send('Error uploading file');
//   }
// };

// module.exports = { uploadFileMiddleware };


const { Storage } = require('@google-cloud/storage');
const path = require('path');
const retry = require('async-retry');
const logger = require('../config/logger');

// Initialize Google Cloud Storage
const keyFilename = path.join(__dirname, './uploads/survey-management-qc-c4d95fc7a086.json');
const storage = new Storage({
  keyFilename,
  projectId: 'survey-management-qc',
});
const bucketName = 'surveymng';
const bucket = storage.bucket(bucketName);

async function setDefaultObjectAcl() {
  try {
    await bucket.setMetadata({
      defaultObjectAcl: [
        {
          entity: 'allUsers',
          role: storage.acl.READER_ROLE,
        },
      ],
    });
    logger.info('Default object ACL set successfully.');
  } catch (error) {
    logger.error('Error setting default object ACL:', error);
  }
}

setDefaultObjectAcl().catch((error) => {
  logger.error('Failed to set default object ACL during initialization:', error);
});

const uploadFileMiddleware = async (req, res, next) => {
  if (!req.file) {
    logger.error('No file uploaded');
    return res.status(400).send('No file uploaded');
  }

  const { file } = req;

  try {
    await retry(
      async () => {
        const blob = bucket.file(file.originalname);
        await new Promise((resolve, reject) => {
          const blobStream = blob.createWriteStream({
            resumable: false,
            metadata: {
              contentType: file.mimetype,
            },
          });
          blobStream.on('error', reject);
          blobStream.on('finish', resolve);
          blobStream.end(file.buffer);
        });
      },
      {
        retries: 5,
        minTimeout: 1000,
        maxTimeout: 5000,
      }
    );

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.originalname}`;
    req.fileUrl = publicUrl;

    next();
  } catch (error) {
    logger.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
};

module.exports = { uploadFileMiddleware };
