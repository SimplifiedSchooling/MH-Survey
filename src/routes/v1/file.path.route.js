const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('node-uuid');
const { filePathController } = require('../../controllers');
const { uploadFileMiddleware } = require('../../middlewares/bucket');

const storageMulter = multer.diskStorage({
  destination: '/home/ubuntu/MH-Survey/src/uploads',
  filename: (req, file, callback) => {
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    callback(null, uniqueFileName);
  },
});


const upload = multer({
  storage: storageMulter,
  limits: { fileSize: 15 * 1024 * 1024 },
});


const router = express.Router();

router.use(express.json({ limit: '800mb' }));
router.use(express.urlencoded({ limit: '800mb', extended: true }));

router
  .route('/')
  .post(
   upload.single('file'),
    uploadFileMiddleware,
    filePathController.createFilePath
  )
// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const { v4: uuidv4 } = require('uuid'); // Correct package name
// const { filePathController } = require('../../controllers');
// const { uploadFileMiddleware } = require('../../middlewares/bucket');

// const storageMulter = multer.diskStorage({
//   destination: '/home/ubuntu/MH-Survey/src/uploads',
//   filename: (req, file, callback) => {
//     const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
//     callback(null, uniqueFileName);
//   },
// });

// const upload = multer({
//   storage: storageMulter,
//   limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB limit
// });

// const router = express.Router();

// router.use(express.json({ limit: '800mb' }));
// router.use(express.urlencoded({ limit: '800mb', extended: true }));

// router
//   .route('/')
//   .post(
//     upload.array('files', 50), // Allow multiple files, max 10 files at a time
//     uploadFileMiddleware,
//     filePathController.createFilePath
//   )
.get(
    filePathController.queryFilePath
  );
router.route('/:questionId').get(
  filePathController.getFilepath
);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: File Path
 *   description: File Path management
 */

/**
 * @swagger
 * /file-path:
 *   post:
 *     summary: Upload a File Path
 *     tags: [File Path]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               questionId:
 *                 type: string
 *                 description: The ID of the survey question
 *               questionName:
 *                 type: string
 *                 description: The name of the question
 *               surveyId:
 *                 type: string
 *                 description: The id of the survey
 *               masterProjectId:
 *                 type: string
 *                 description: The id of the masterProject
 *               Longitude:
 *                 type: string
 *                 description: The Longitude
 *               Latitude:
 *                 type: string
 *                 description: The Latitude
 *               udise_sch_code:
 *                 type: number
 *                 description: The  udise_sch_code
 *               file:
 *                 type: string
 *                 format: binary
 *             required:
 *               - questionId
 *               - questionName
 *               - file
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/FilePath'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get query Division
 *     tags: [File Path]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: questionName
 *         schema:
 *           type: string
 *         description: questionName
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of division
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Division'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /file-path/{questionId}:
 *   get:
 *     summary: Get a question
 *     tags: [File Path]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: questionId
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/filePath'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
//  *   patch:
//  *     summary: Update a question
//  *     tags: [File Path]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: questionId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: questionId
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               file:
//  *                 type: string
//  *                 format: binary
//  *               questionName:
//  *                 type: string
//  *             example:
//  *               file: gfhjhj/dfghjk/dfghjk
//  *               questionName: gsafhcc
//  *     responses:
//  *       "200":
//  *         description: OK
//  *         content:
//  *           application/json:
//  *             schema:
//  *                $ref: '#/components/schemas/FilePath'
//  *       "401":
//  *         $ref: '#/components/responses/Unauthorized'
//  *       "403":
//  *         $ref: '#/components/responses/Forbidden'
//  *       "404":
//  *         $ref: '#/components/responses/NotFound'
//  *
//  *   delete:
//  *     summary: Delete a filepath
//  *     tags: [File Path]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: questionId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: questionId
//  *     responses:
//  *       "200":
//  *         description: No content
//  *       "401":
//  *         $ref: '#/components/responses/Unauthorized'
//  *       "403":
//  *         $ref: '#/components/responses/Forbidden'
//  *       "404":
//  *         $ref: '#/components/responses/NotFound'
//  */
