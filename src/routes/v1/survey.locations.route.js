const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { surveyLocationsController } = require('../../controllers');
const { surveyLocationValidation } = require('../../validations');

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
  .route('/bulk-upload')
  .post(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    uploads.single('file'),
    validate(surveyLocationValidation.bulkUploadValidationSchema),
    surveyLocationsController.bulkUploadFile
  );

router
  .route('/getschoolslist') // Define this route before routes with dynamic paths
  .post(
    // auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    surveyLocationsController.getSchoolDataByMasterProjectIdAndCodeController
  );

router
  .route('/')
  .get(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(surveyLocationValidation.getAllSurveyLocatins),
    surveyLocationsController.getAllSurveyLocatins
  );

router
  .route('/get-by-id/:masterProjectId')
  .get(
    auth('superadmin', 'surveyadmin', 'district', 'division', 'block', 'SME'),
    validate(surveyLocationValidation.getSchoolDataBySurveyId),
    surveyLocationsController.getSchoolDataBySurveyId
  );

module.exports = router;
// .exports = router;

/**
 * @swagger
 * tags:
 *   name: SurveyLocation
 *   description: SurveyLocation management
 */

/**
 * @swagger
 * /surveylocation/bulk-upload:
 *   post:
 *     summary: Upload a CSV file for bulk survey location upload
 *     tags: [SurveyLocation]
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
 *               masterProjectName:
 *                 type: string
 *               masterProjectId:
 *                 type: string
 *               masterProjectPurpose:
 *                 type: string
 *               masterProjectStartDate:
 *                 type: string
 *                 format: date
 *               masterProjectEndDate:
 *                 type: string
 *                 format: date
 *               masterProjectOwnerName:
 *                 type: string
 *               masterProjectOwnerEmailId:
 *                 type: string
 *               masterProjectOwnerMoNumber:
 *                 type: number
 *               masterProjectConductBy:
 *                 type: string
 *               masterProjectRequireAudit:
 *                 type: boolean
 *               masterProjectAuditBy:
 *                 type: string
 *               masterProjectRequireApproval:
 *                 type: boolean
 *               masterProjectApprovedBy:
 *                 type: string
 *               auditStartDate:
 *                 type: string
 *                 format: date
 *               auditEndDate:
 *                 type: string
 *                 format: date
 *               approvelStartDate:
 *                 type: string
 *                 format: date
 *               approvelEndDate:
 *                 type: string
 *                 format: date
 *             required:
 *               - file
 *               - masterProjectName
 *               - masterProjectId
 *               - masterProjectPurpose
 *               - masterProjectStartDate
 *               - masterProjectEndDate
 *               - masterProjectOwnerName
 *               - masterProjectOwnerEmailId
 *               - masterProjectOwnerMoNumber
 *               - masterProjectConductBy
 *               - masterProjectRequireAudit
 *               - masterProjectAuditBy
 *               - masterProjectRequireApproval
 *               - masterProjectApprovedBy
 *               - auditStartDate
 *               - auditEndDate
 *               - approvelStartDate
 *               - approvelEndDate
 *             example:
 *               file: (binary data)
 *               masterProjectName: Vending Machine Installation
 *               masterProjectId: VEN879
 *               masterProjectPurpose: Multiple installation of vending machines in schools
 *               masterProjectStartDate: 2024-01-01
 *               masterProjectEndDate: 2024-01-31
 *               masterProjectOwnerName: John Doe
 *               masterProjectOwnerEmailId: john@example.com
 *               masterProjectOwnerMoNumber: 1234567890
 *               masterProjectConductBy: Block co-ordinator
 *               masterProjectRequireAudit: true, false
 *               masterProjectAuditBy: SME
 *               masterProjectRequireApproval: true, false
 *               masterProjectApprovedBy: District co-ordinator
 *               auditStartDate: 2024-01-31
 *               auditEndDate: 2024-01-31
 *               approvelStartDate: 2024-01-31
 *               approvelEndDate: 2024-01-31
 *     responses:
 *       201:
 *         description: Successfully added CSV file
 *         content:
 *           application/json:
 *             example:
 *               message: Successfully added CSV file
 *               data:
 *               masterProjectName: Vending Machine Installation
 *               masterProjectId: VEN879
 *               masterProjectPurpose: Multiple installation of vending machines in schools
 *               masterProjectStartDate: 2024-01-01
 *               masterProjectEndDate: 2024-01-31
 *               masterProjectOwnerName: John Doe
 *               masterProjectOwnerEmailId: john@example.com
 *               masterProjectOwnerMoNumber: 1234567890
 *               masterProjectConductBy: Block co-ordinator
 *               masterProjectRequireAudit: true, false
 *               masterProjectAuditBy: SME
 *               masterProjectRequireApproval: true, false
 *               masterProjectApprovedBy: District co-ordinator
 *               auditStartDate: 2024-01-31
 *               auditEndDate: 2024-01-31
 *               approvelStartDate: 2024-01-31
 *               approvelEndDate: 2024-01-31
 *               surveyLocations: [
 *                   {
 *                     udise_sch_code: 2133312,
 *                   },
 *                   {
 *                     udise_sch_code: 2133312,
 *                   }
 *                 ]
 *       400:
 *         description: Uploaded file must be in CSV format.
 *         content:
 *           application/json:
 *             example:
 *               message: Uploaded file must be in CSV format.
 *       404:
 *         description: Missing file
 *         content:
 *           application/json:
 *             example:
 *               message: Missing file
 */

/**
 * @swagger
 * /surveylocation:
 *   get:
 *     summary: Get all surveylocation
 *     description: Only admins can retrieve all surveylocation.
 *     tags: [SurveyLocation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: surveyId
 *         schema:
 *           type: string
 *         description: surveyId
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
 *         description: Maximum number of SurveyLocation
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
 *                     $ref: '#/components/schemas/SurveyLocation'
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

// /**
//  * @swagger
//  * /surveylocation/{masterProjectId}:
//  *   get:
//  *     summary: Get survey location data  by masterProjectId
//  *     tags: [SurveyLocation]
//  *     parameters:
//  *       - in: path
//  *         name: masterProjectId
//  *         required: true
//  *         description: masterProjectId of the survey location
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved survey location
//  *         content:
//  *           application/json:
//  *             example:
//  *               masterProjectName: Sample Survey
//  *               masterProjectId: SAMPLE123
//  *               surveyLocations:
//  *                 - udise_sch_code: 123456
//  *                   school: { /* School Data Object * / }
//  *                 - udise_sch_code: 789012
//  *                   school: { /* School Data Object * / }
//  *       404:
//  *         description: Survey location not found
//  *         content:
//  *           application/json:
//  *             example:
//  *               message: Survey location not found
//  *       500:
//  *         description: Internal Server Error
//  *         content:
//  *           application/json:
//  *             example:
//  *               message: Internal Server Error
//  */

// /**
//  * @swagger
//  * /surveylocation/getschoolslist:
//  *   post:
//  *     summary: Get school data by masterProjectId, role, and code
//  *     tags: [SurveyLocation]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               masterProjectId:
//  *                 type: string
//  *                 description: Master Project Id
//  *               role:
//  *                 type: string
//  *                 description: Role of the user
//  *               code:
//  *                 type: string
//  *                 description: code for block , district and name for division
//  *               surveyId:
//  *                 type: string
//  *                 description: code for block , district and name for division
//  *     responses:
//  *       "200":
//  *         description: OK
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 schools:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/School'
//  *       "401":
//  *         $ref: '#/components/responses/Unauthorized'
//  *       "403":
//  *         $ref: '#/components/responses/Forbidden'
//  *       "404":
//  *         description: Not Found
//  */

/**
 * @swagger
 * /surveylocation/getschoolslist:
 *   post:
 *     summary: Get school data by masterProjectId, role, and code
 *     tags: [SurveyLocation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               masterProjectId:
 *                 type: string
 *                 description: Master Project Id
 *               role:
 *                 type: string
 *                 description: Role of the user
 *               code:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of codes for block, district, or name for division
 *               surveyId:
 *                 type: string
 *                 description: Survey Id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 schools:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/School'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         description: Not Found
 */

/**
 * @swagger
 * /surveylocation/get-by-id/{masterProjectId}:
 *   get:
 *     summary: Get survey location data  by masterProjectId
 *     tags: [SurveyLocation]
 *     parameters:
 *       - in: path
 *         name: masterProjectId
 *         required: true
 *         description: ID of the master Project Id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved masterProject location
 *         content:
 *           application/json:
 *             example:
 *               masterProjectName: Sample Survey
 *               masterProjectId: SAMPLE123
 *               surveyLocations:
 *                 - udise_sch_code: 123456
 *                   school: { /* School Data Object * / }
 *                 - udise_sch_code: 789012
 *                   school: { /* School Data Object * / }
 *       404:
 *         description: Survey location not found
 *         content:
 *           application/json:
 *             example:
 *               message: Survey location not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal Server Error
 */
