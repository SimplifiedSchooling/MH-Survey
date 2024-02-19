const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require('multer');
const path = require('path');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const { SchoolController } = require('../../controllers');
const { schoolValidation } = require('../../validations');

const router = express.Router();
const uploadDir = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploads = multer({ storage });
router
  .route('/bulkupload-school')
  .post(
    uploads.single('file'),
    validate(schoolValidation.schoolValidationSchema),
    SchoolController.bulkUploadFile
  );
router
  .route('/')
  .get(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(schoolValidation.getAllSchools),
    SchoolController.getAllSchools
  );

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: School
 *   description: School management
 */

/**
 * @swagger
 * /school/bulkupload-school:
 *   post:
 *     summary: Upload a CSV file for bulk school upload
 *     tags: [School]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Successfully added CSV file
 *       404:
 *         description: Missing file
 */

/**
 * @swagger
 * /school:
 *   get:
 *     summary: Get all School
 *     description: Only admins can retrieve all School.
 *     tags: [School]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: school_name
 *         schema:
 *           type: string
 *         description: school name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of school
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
 *                     $ref: '#/components/schemas/School'
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
