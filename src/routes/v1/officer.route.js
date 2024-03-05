const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require('multer');
const path = require('path');
const { officerController } = require('../../controllers');
const auth = require('../../middlewares/auth');

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
  .route('/bulkupload-sme')
  .post(
    //auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    uploads.single('file'),
    officerController.smeOfficerBulkUpload
  );
router
  .route('/bulkupload-block')
  .post(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    uploads.single('file'),
    officerController.blockOfficerBulkUpload
  );
router
  .route('/bulkupload-district')
  .post(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    uploads.single('file'),
    officerController.districtOfficerBulkUpload
  );
router
  .route('/bulkupload-division')
  .post(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    uploads.single('file'),
    officerController.divisinOfficerBulkUpload
  );
router
  .route('/filterby/division/:masterProjectId')
  .get(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    officerController.getDivisionCoordinatorsDetails
  );
router
  .route('/filterby/district/:masterProjectId')
  .get(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    officerController.getDistrictCoordinatorsDetails
  );
router
  .route('/filterby/block/:masterProjectId')
  .get(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    officerController.getBlockCoordinatorsDetails
  );
router
  .route('/filterby/sme/:masterProjectId')
  .get(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    officerController.getSmeCoordinatorsDetails
  );
router.post('/blockCode', officerController.getBlockCodeByEmailAndMasterProjectId);
router.post('/districtCode', officerController.getDistrictCodeByEmailAndMasterProjectId);
router.post('/sme/blockCode', officerController.getSmeBlockCodeByEmailAndMasterProjectId);
router.post('/division/divisionName', officerController.getDivisionNameByEmailAndMasterProjectId);
router
  .route('/getallblockofficer')
  .get(
    //auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    //validate(schoolValidation.getAllSchools),
    officerController.getAllBlockOficer
  );
  router
  .route('/getalldistrictofficer')
  .get(
    //auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    //validate(schoolValidation.getAllSchools),
    officerController.getAllDistrictOficer
  );
  router
  .route('/getalldivisionofficer')
  .get(
    //auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    //validate(schoolValidation.getAllSchools),
    officerController.getAllDivisionOficer
  );
  router
  .route('/getallsmeofficer')
  .get(
    //auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    //validate(schoolValidation.getAllSchools),
    officerController.getAllSmeOficer
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Officer
 *   description: Officer management
 */
/**
 * @swagger
 * /officer/bulkupload-sme:
 *   post:
 *     summary: Upload a CSV file for bulk officer upload
 *     tags: [Officer]
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
 *               surveyAdmin:
 *                 type: string
 *               masterProjectId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully added CSV file
 *       404:
 *         description: Missing file
 */

/**
 * @swagger
 * /officer/bulkupload-block:
 *   post:
 *     summary: Upload a CSV file for bulk officer upload
 *     tags: [Officer]
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
 *               surveyAdmin:
 *                 type: string
 *               masterProjectId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully added CSV file
 *       404:
 *         description: Missing file
 */

/**
 * @swagger
 * /officer/bulkupload-district:
 *   post:
 *     summary: Upload a CSV file for bulk officer upload
 *     tags: [Officer]
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
 *               surveyAdmin:
 *                 type: string
 *               masterProjectId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully added CSV file
 *       404:
 *         description: Missing file
 */

/**
 * @swagger
 * /officer/bulkupload-division:
 *   post:
 *     summary: Upload a CSV file for bulk officer upload
 *     tags: [Officer]
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
 *               surveyAdmin:
 *                 type: string
 *               masterProjectId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully added CSV file
 *       404:
 *         description: Missing file
 */

/**
 * @swagger
 * /officer/filterby/division/{masterProjectId}:
 *   get:
 *     summary: get list of Officers assigned to a project
 *     tags: [Officer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: masterProjectId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "201":
 *         description: Data not found
 *         content:
 *           application/json:
 *             example:
 *               message: Data not found
 */

/**
 * @swagger
 * /officer/filterby/district/{masterProjectId}:
 *   get:
 *     summary: get list of Officers assigned to a project
 *     tags: [Officer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: masterProjectId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "201":
 *         description: Data not found
 *         content:
 *           application/json:
 *             example:
 *               message: Data not found
 */

/**
 * @swagger
 * /officer/filterby/block/{masterProjectId}:
 *   get:
 *     summary: get list of Officers assigned to a project
 *     tags: [Officer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: masterProjectId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "201":
 *         description: Data not found
 *         content:
 *           application/json:
 *             example:
 *               message: Data not found
 */
/**
 * @swagger
 * /officer/filterby/sme/{masterProjectId}:
 *   get:
 *     summary: get list of Officers assigned to a project
 *     tags: [Officer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: masterProjectId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "201":
 *         description: Data not found
 *         content:
 *           application/json:
 *             example:
 *               message: Data not found
 */

/**
 * @swagger
 * /officer/blockCode:
 *   post:
 *     summary: Get block code by email and master project ID
 *     tags: [Officer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Request body containing masterProjectId and email
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               masterProjectId:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - masterProjectId
 *               - email
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blockCode:
 *                   type: string
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         description: Data not found
 *         content:
 *           application/json:
 *             example:
 *               message: Data not found
 */

/**
 * @swagger
 * /officer/districtCode:
 *   post:
 *     summary: Get district code by email and master project ID
 *     tags: [Officer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Request body containing masterProjectId and email
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               masterProjectId:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - masterProjectId
 *               - email
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blockCode:
 *                   type: string
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         description: Data not found
 *         content:
 *           application/json:
 *             example:
 *               message: Data not found
 */

/**
 * @swagger
 * /officer/sme/blockCode:
 *   post:
 *     summary: Get  Sme block code by email and master project ID
 *     tags: [Officer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Request body containing masterProjectId and email
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               masterProjectId:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - masterProjectId
 *               - email
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blockCode:
 *                   type: string
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         description: Data not found
 *         content:
 *           application/json:
 *             example:
 *               message: Data not found
 */

/**
 * @swagger
 * /officer/division/divisionName:
 *   post:
 *     summary: Get  divisionName by email and master project ID
 *     tags: [Officer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Request body containing masterProjectId and email
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               masterProjectId:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - masterProjectId
 *               - email
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blockCode:
 *                   type: string
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         description: Data not found
 *         content:
 *           application/json:
 *             example:
 *               message: Data not found
 */
/**
 * @swagger
 * /officer/getallblockofficer:
 *   get:
 *     summary: Get all blockofficer
 *     description: Only admins can retrieve all blockofficer.
 *     tags: [Officer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: masterProjectId
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

/**
 * @swagger
 * /officer/getalldistrictofficer:
 *   get:
 *     summary: Get all district officer
 *     description: Only admins can retrieve all district officers.
 *     tags: [Officer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: masterProjectId
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


/**
 * @swagger
 * /officer/getalldivisionofficer:
 *   get:
 *     summary: Get all division officer
 *     description: Only admins can retrieve all division officers.
 *     tags: [Officer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: masterProjectId
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


/**
 * @swagger
 * /officer/getallsmeofficer:
 *   get:
 *     summary: Get all sme officer
 *     description: Only admins can retrieve all sme officers.
 *     tags: [Officer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: masterProjectId
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