const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const { masterProjectController } = require('../../controllers');
const { masterProjectValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .post(
    auth('superadmin', 'surveyadmin', 'district', 'division', 'block', 'SME'),
    masterProjectController.createMasterSurveyProject
  )
  .get(
    auth('superadmin', 'surveyadmin', 'district', 'division', 'block', 'SME'),
    masterProjectController.queryMasterProject
  );

router
  .route('/:projectId')
  .get(auth('superadmin', 'surveyadmin', 'district', 'division', 'block', 'SME'), masterProjectController.getMasterProject)
  .patch(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(masterProjectValidation.updateNewSurvey),
    masterProjectController.updateMasterProject
  )
  .delete(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    masterProjectController.deleteMasterProject
  );

router
  .route('/filterby/:masterProjectOwnerEmailId')
  .get(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    masterProjectController.getProjectsByEmail
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Master Survey Project
 *   description: API endpoints for Master Survey Project
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MasterProject:
 *       type: object
 *       properties:
 *         masterProjectName:
 *           type: string
 *           description: Name of the Master Project
 *         masterProjectPurpose:
 *           type: string
 *           description: Purpose of the Master Project
 *         masterProjectStartDate:
 *           type: string
 *           format: date
 *           description: Start date of the Master Project
 *         masterProjectEndDate:
 *           type: string
 *           format: date
 *           description: End date of the Master Project
 *         masterProjectOwnerName:
 *           type: string
 *           description: Name of the owner of the Master Project
 *         masterProjectOwnerEmailId:
 *           type: string
 *           format: email
 *           description: Email ID of the owner of the Master Project
 *         masterProjectOwnerMoNumber:
 *           type: number
 *           description: Mobile number of the owner of the Master Project
 *         projectStatus:
 *           type: string
 *           enum: ['Not-Started', 'Started', 'In-progress', 'Completed']
 *           description: Status of the Master Project
 *       required:
 *         - masterProjectName
 *         - masterProjectPurpose
 *         - masterProjectStartDate
 *         - masterProjectEndDate
 *         - masterProjectOwnerName
 *         - masterProjectOwnerEmailId
 *         - masterProjectOwnerMoNumber
 *         - projectStatus
 *
 *     NewSurvey:
 *       type: object
 *       properties:
 *         masterProjectOwnerEmailId:
 *           type: string
 *           format: email
 *           description: Email ID of the owner of the Master Project
 *         masterProjectId:
 *           type: string
 *           description: ID of the Master Project
 *         surveyName:
 *           type: string
 *           description: Name of the Survey
 *         surveyPurpose:
 *           type: string
 *           description: Purpose of the Survey
 *         surveyStartDate:
 *           type: string
 *           format: date
 *           description: Start date of the Survey
 *         surveyEndDate:
 *           type: string
 *           format: date
 *           description: End date of the Survey
 *       required:
 *         - masterProjectOwnerEmailId
 *         - masterProjectId
 *         - surveyName
 *         - surveyPurpose
 *         - surveyStartDate
 *         - surveyEndDate
 *
 *   requestBodies:
 *     MasterSurveyRequest:
 *       description: Request body for creating a Master Survey Project with Sub Surveys
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               masterProjectData:
 *                 $ref: '#/components/schemas/MasterProject'
 *               subSurveyData:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/NewSurvey'
 */

/**
 * @swagger
 * paths:
 *   /master-project:
 *     post:
 *       summary: Create a Master Survey Project with Sub Surveys
 *       tags: [Master Survey Project]
 *       security:
 *       - bearerAuth: []
 *       requestBody:
 *         $ref: '#/components/requestBodies/MasterSurveyRequest'
 *       responses:
 *         '201':
 *           description: Successfully created
 *           content:
 *             application/json:
 *               example:
 *                 masterProject: {}
 *                 subSurveys: []
 *         '500':
 *           description: Internal Server Error
 */

/**
 * @swagger
 * /master-project/{projectId}:
 *   get:
 *     summary: Get a MasterProject
 *     tags: [Master Survey Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: projectId
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/NewSurvey'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a MasterProject
 *     tags: [Master Survey Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: projectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               approvelStartDate:
 *                 type: string
 *                 format: date
 *               approvelEndDate:
 *                 type: string
 *                 format: date
 *               auditStartDate:
 *                 type: string
 *                 format: date
 *               auditEndDate:
 *                 type: string
 *                 format: date
 *               finalSubmit:
 *                 type: boolean
 *               projectDetailsSubmit:
 *                 type: boolean
 *               masterProjectConductBy:
 *                 type: string
 *               projectStatus:
 *                 type: string
 *               masterProjectRequireAudit:
 *                 type: boolean
 *               masterProjectRequireApproval:
 *                 type: boolean
 *               masterProjectApprovedBy:
 *                 type: string
 *               masterProjectAuditBy:
 *                 type: string
 *               masterProjectName:
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
 *             example:
 *               masterProjectName : Your Project Name
 *               masterProjectPurpose : Your Project Purpose
 *               masterProjectStartDate : 2024-01-30
 *               masterProjectEndDate : 2024-01-30
 *               masterProjectOwnerName : owner Name
 *               masterProjectOwnerEmailId : owner@example.com
 *               masterProjectOwnerMoNumber : 1234567890
 *               approvelStartDate: 2024-01-30
 *               approvelEndDate: 2024-01-30
 *               auditStartDate: 2024-01-30
 *               auditEndDate: 2024-01-30
 *               finalSubmit: true, false
 *               projectDetailsSubmit: true, false
 *               projectStatus: Not-Started, Started, In-progress, Completed
 *               masterProjectConductBy: Block co-ordinator
 *               masterProjectRequireAudit: true, false
 *               masterProjectAuditBy: SME
 *               masterProjectRequireApproval: true, false
 *               masterProjectApprovedBy: District co-ordinator
 *
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/NewSurvey'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a MasterProject
 *     tags: [Master Survey Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: projectId
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
 * paths:
 *   /master-project:
 *     get:
 *       summary: Get all Master Projects
 *       tags: [Master Survey Project]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: query
 *           name: masterProjectName
 *           schema:
 *             type: string
 *           description: Master project name
 *         - in: query
 *           name: sortBy
 *           schema:
 *             type: string
 *           description: Sorting parameter
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             minimum: 1
 *           default: 10
 *           description: Maximum number of master projects
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             minimum: 1
 *             default: 1
 *           description: Page number
 *       responses:
 *         "200":
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   masterProjects:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/MasterProject'
 *                   page:
 *                     type: integer
 *                     example: 1
 *                   limit:
 *                     type: integer
 *                     example: 10
 *                   totalPages:
 *                     type: integer
 *                     example: 1
 *                   totalResults:
 *                     type: integer
 *                     example: 1
 *         "401":
 *           $ref: '#/components/responses/Unauthorized'
 *         "403":
 *           $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /master-project/filterby/{masterProjectOwnerEmailId}:
 *   get:
 *     summary: Get a All Master Projects Assigned to Survey Admin by Email id
 *     tags: [Master Survey Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: masterProjectOwnerEmailId
 *         required: true
 *         schema:
 *           type: string
 *         description: masterProjectOwnerEmailId
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/MasterProject'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
