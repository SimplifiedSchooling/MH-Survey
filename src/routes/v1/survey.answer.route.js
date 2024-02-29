const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const { surveyAnswersValidation } = require('../../validations');
const { surveyAnswerController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(surveyAnswersValidation.createSurveyAnswers),
    surveyAnswerController.createSurveyAnswers
  )
  .get(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(surveyAnswersValidation.getSurveyAnswers),
    surveyAnswerController.getSurveyAnswers
  );

router
  .route('/:answerId')
  .get(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(surveyAnswersValidation.getSurveyAnswerById),
    surveyAnswerController.getSurveyAnswer
  )
  .patch(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(surveyAnswersValidation.updateSurveyAnswer),
    surveyAnswerController.updateSurveyAnswers
  )
  .delete(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(surveyAnswersValidation.deleteSurveyAnswer),
    surveyAnswerController.deleteSurveyAnswers
  );
router
  .route('/filters/:surveyId/:masterProjectId/:surveyFormId/:udise_sch_code')
  .get(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(surveyAnswersValidation.filterSurveyAnswer),
    surveyAnswerController.filterSurveyAnswersController
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Survey Answers
 *   description: Survey Answers management and retrieval
 */

/**
 * @swagger
 * /survey-answers:
 *   post:
 *     summary: Create a Survey Answers
 *     description: Only admins can create other Survey Questions.
 *     tags: [Survey Answers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - surveyQuetions
 *               - surveyId
 *               - masterProjectId
 *               - surveyFormId
 *               - surveyConductEmail
 *               - udise_sch_code
 *               - Latitude
 *               - Longitude
 *             properties:
 *               surveyQuetions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     quetion:
 *                       type: string
 *                     answer:
 *                       type: array
 *                     isVisible:
 *                       type: boolean
 *               surveyId:
 *                 type: string
 *               masterProjectId:
 *                 type: string
 *               surveyFormId:
 *                 type: string
 *               surveyConductEmail:
 *                 type: string
 *               udise_sch_code:
 *                 type: number
 *               Longitude:
 *                 type: string
 *               Latitude:
 *                 type: string
 *               remark:
 *                 type: string
 *             example:
 *               surveyQuetions:
 *                 - quetion: "What is your name?"
 *                   answer: ["John"]
 *                   isVisible: "true, false"
 *               surveyId: "password1"
 *               masterProjectId: "projectId1"
 *               surveyFormId: "65b8e8428bc57009fe403698"
 *               surveyConductEmail: "john@example.com"
 *               udise_sch_code : 27040108712
 *               Longitude : "73.8567"
 *               Latitude : "73.8567"
 *               remark : "73.8567"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SurveyQutions'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all Survey Answers
 *     description: Only admins can retrieve all Survey Answers.
 *     tags: [Survey Answers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Maximum number of Survey Questions
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
 *                     $ref: '#/components/schemas/SurveyAnswers'
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
//  * /survey-answers/filters:
//  *   get:
//  *     summary: get a Survey Answers by surveyId, masterProjectId, surveyFormId, surveyConductEmail, udise_sch_code
//  *     description: Get Survey Answers by surveyId, masterProjectId, surveyFormId, surveyConduct
//  *     tags: [Survey Answers]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - surveyId
//  *               - masterProjectId
//  *               - surveyFormId
//  *               - surveyConductEmail
//  *               - udise_sch_code
//  *             properties:
//  *               surveyId:
//  *                 type: string
//  *               masterProjectId:
//  *                 type: string
//  *               surveyFormId:
//  *                 type: string
//  *               surveyConductEmail:
//  *                 type: string
//  *               udise_sch_code:
//  *                 type: number
//  *             example:
//  *               surveyId: "password1"
//  *               masterProjectId: "projectId1"
//  *               surveyFormId: "65b8e8428bc57009fe403698"
//  *               surveyConductEmail: "john@example.com"
//  *               udise_sch_code : 27040108712
//  *     responses:
//  *       "201":
//  *         description: Get
//  *         content:
//  *           application/json:
//  *             schema:
//  *                $ref: '#/components/schemas/SurveyAnswers'
//  *       "401":
//  *         $ref: '#/components/responses/Unauthorized'
//  *       "403":
//  *         $ref: '#/components/responses/Forbidden'
//  *
//  */

/**
 * @swagger
 * /survey-answers/{answerId}:
 *   get:
 *     summary: Get a Survey Answers
 *     description: Logged-in Survey Answers can fetch only their own user information. Only admins can fetch other Survey Questions.
 *     tags: [Survey Answers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: string
 *         description: answerId
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SurveyAnswers'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a Survey Answers
 *     description: Logged-in Survey Answers can only update their information. Only admins can update other Survey Questions.
 *     tags: [Survey Answers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: string
 *         description: answerId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               surveyQuetions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     quetion:
 *                       type: string
 *                     answer:
 *                       type: string
 *               surveyId:
 *                 type: string
 *               masterProjectId:
 *                 type: string
 *               surveyFormId:
 *                 type: string
 *               surveyConductEmail:
 *                 type: string
 *             example:
 *               surveyQuetions:
 *                 - quetion: "What is your name?"
 *                   answer: "John"
 *               surveyId: "password1"
 *               masterProjectId: "projectId1"
 *               surveyFormId: "formId1"
 *               surveyConductEmail: "john@example.com"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SurveyAnswers'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a Survey Answers
 *     description: Logged-in Survey Answers can delete only themselves. Only admins can delete other Survey Questions.
 *     tags: [Survey Answers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: string
 *         description: answerId
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
 * /survey-answers/filters/{surveyId}/{masterProjectId}/{surveyFormId}/{udise_sch_code}:
 *   get:
 *     summary: Get Survey Answers by surveyId, masterProjectId, surveyFormId, udise_sch_code
 *     description: Get Survey Answers by surveyId, masterProjectId, surveyFormId, surveyConduct
 *     tags: [Survey Answers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: surveyId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: masterProjectId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: surveyFormId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: udise_sch_code
 *         schema:
 *           type: number
 *         required: true
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SurveyAnswers'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "201":
 *         description: Data not found
 *         content:
 *           application/json:
 *             example:
 *               message: Data not found
 */
