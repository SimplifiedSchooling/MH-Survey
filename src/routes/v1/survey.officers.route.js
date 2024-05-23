const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require('multer');
const path = require('path');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { coordinatorAssignmentController } = require('../../controllers');
const { coordinatorsValidation } = require('../../validations');

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
  .route('/:masterProjectId/users')
  .get(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(coordinatorsValidation.getUsersBySurveyIdValidation),
    coordinatorAssignmentController.getUsersBySurveyId
  );

router
  .route('/')
  .post(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(coordinatorsValidation.assignCoordinatorsValidation),
    coordinatorAssignmentController.assignCoordinators
  );

router
  .route('/')
  .get(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(coordinatorsValidation.getAllCoordinators),
    coordinatorAssignmentController.getAllCoordinatorAssignments
  );
router
  .route('/:assignmentId')
  .get(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(coordinatorsValidation.getAssignment),
    coordinatorAssignmentController.getAssigment
  )
  .delete(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(coordinatorsValidation.deleteAssignment),
    coordinatorAssignmentController.deleteAssigment
  );
router
  .route('/filter/:masterProjectId')
  .get(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(coordinatorsValidation.getAssignmentBySurveyId),
    coordinatorAssignmentController.getAssigmentBySurveyId
  );
router
  .route('/assign/bulk-upload')
  .post(
    uploads.single('file'),
    validate(
      auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
      coordinatorsValidation.bulkUploadValidationSchema
    ),
    coordinatorAssignmentController.bulkUploadFile
  );

router
  .route('/getprojects')
  .post(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(coordinatorsValidation.getProjectsList),
    coordinatorAssignmentController.getAssignedProjectsForuser
  );

module.exports = router;

/**
 * @swagger
 * /assign-coordinators:
 *   get:
 *     summary: Get all CoordinatorAssignment
 *     description: Only admins can retrieve all CoordinatorAssignment.
 *     tags: [CoordinatorAssignment]
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

/**
 * @swagger
 * /assign-coordinators/{assignmentId}:
 *   get:
 *     summary: Get a CoordinatorAssignment
 *     tags: [CoordinatorAssignment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: assignmentId
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Division'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a CoordinatorAssignment
 *     tags: [CoordinatorAssignment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: assignmentId
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /assign-coordinators/filter/{masterProjectId}:
 *   get:
 *     summary: Update coordinator assignment by surveyId
 *     tags: [CoordinatorAssignment]
 *     parameters:
 *       - in: path
 *         name: masterProjectId
 *         required: true
 *         description: masterProjectId of the coordinator assignment
 *     responses:
 *       200:
 *         description: Successfully updated coordinator assignment
 *         content:
 *           application/json:
 *             example:
 *               message: Coordinator assignment updated successfully
 *               data: {}
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             example:
 *               message: Validation Error
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             example:
 *               message: Coordinator assignment not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal Server Error
 */

// /**
//  * @swagger
//  * /assign-coordinators/assign/bulk-upload:
//  *   post:
//  *     summary: Upload a CSV file for bulk coordinator assignment
//  *     tags: [CoordinatorAssignment]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               file:
//  *                 type: string
//  *                 format: binary
//  *               masterProjectId:
//  *                 type: string
//  *               surveyAdmin:
//  *                 type: string
//  *               emailType:
//  *                 type: string
//  *                 enum: ['blockCoordinatorEmails', 'districtCoordinatorEmails', 'divisionCoordinatorEmails', 'smeEmails']
//  *             required:
//  *               - file
//  *               - masterProjectId
//  *               - surveyAdmin
//  *               - emailType
//  *             example:
//  *               file: (binary data)
//  *               masterProjectId: VEAN8796
//  *               surveyAdmin: 65aa570cfe881bb4c26edbb7
//  *               emailType: blockCoordinatorEmails
//  *     responses:
//  *       201:
//  *         description: Successfully added CSV file
//  *         content:
//  *           application/json:
//  *             example:
//  *               message: Successfully added Coordinator Assignment
//  *               result: { updated/created assignment object }
//  *       400:
//  *         description: Uploaded file must be in CSV format.
//  *         content:
//  *           application/json:
//  *             example:
//  *               message: Uploaded file must be in CSV format.
//  *       404:
//  *         description: Missing file
//  *         content:
//  *           application/json:
//  *             example:
//  *               message: Missing file
//  */

/**
 * @swagger
 * /assign-coordinators/{masterProjectId}/users:
 *   get:
 *     summary: Get users based on email IDs in CoordinatorAssignment arrays
 *     tags: [CoordinatorAssignment]
 *     parameters:
 *       - in: path
 *         name: masterProjectId
 *         required: true
 *         description: masterProject ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with user data
 *         content:
 *           application/json:
 *             example:
 *               users: [{ blockCoordinatorEmails: [...], districtCoordinatorEmails: [...], divisionCoordinatorEmails: [...], smeEmails: [...] }]
 *       404:
 *         description: CoordinatorAssignment not found for the given surveyId
 */

/**
 * @swagger
 * /assign-coordinators/getprojects:
 *   post:
 *     summary: Get users based on email IDs in CoordinatorAssignment arrays
 *     tags: [CoordinatorAssignment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user
 *               role:
 *                 type: string
 *                 description: Role of the user
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MasterProject'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
