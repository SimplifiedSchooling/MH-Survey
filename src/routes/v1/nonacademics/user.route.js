const express = require('express');
const multer = require('multer');
const { join } = require('path');
const authController = require('../../../controllers/nonacademics/auth.controller');
const validate = require('../../../middlewares/validate');
const authValidation = require('../../../validations/auth.validation');
const userController = require('../../../controllers/nonacademics/user.controller');

const router = express.Router();

const uploadPath = join(__dirname, '../../../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // Use the correct variable here
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploads = multer({ storage });

router.post('/roles/bulkupload', uploads.single('file'), userController.bulkUploadUserRoleFile);
router.post('/auth/login', validate(authValidation.login), authController.login);
router.get('/user-role/info', userController.getUserRoleInfo);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: NonAcademicUser
 *   description: Non Academic user management
 */

/**
 * @swagger
 * /nonAcademic/roles/bulkupload:
 *   post:
 *     summary: Upload a CSV file for bulk upload user
 *     tags: [NonAcademicUser]
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
 * /nonAcademic/auth/login:
 *   post:
 *     summary: Login
 *     tags: [NonAcademicUser]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid email or password
 */

/**
 * @swagger
 * /nonAcademic/user-role/info:
 *   get:
 *     summary: get user role details.
 *     tags: [NonAcademicUser]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: uniqRoleCode
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       201:
 *         description: Details Fetched Successfully
 *       404:
 *         description: Details Not Fetched
 */
