const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const { SMESurveyAnswersValidation } = require('../../validations');
const { smeSurveyAnswerController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(SMESurveyAnswersValidation.createSurveyAnswers),
    smeSurveyAnswerController.createSurveyAnswers
  )
  .get(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(SMESurveyAnswersValidation.getSurveyAnswers),
    smeSurveyAnswerController.getSurveyAnswers
  );

router
  .route('/:answerId')
  .get(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(SMESurveyAnswersValidation.getSurveyAnswerById),
    smeSurveyAnswerController.getSurveyAnswer
  )
  .patch(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(SMESurveyAnswersValidation.updateSurveyAnswer),
    smeSurveyAnswerController.updateSurveyAnswers
  )
  .delete(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(SMESurveyAnswersValidation.deleteSurveyAnswer),
    smeSurveyAnswerController.deleteSurveyAnswers
  );
router
  .route('/filters/:surveyId/:masterProjectId/:surveyFormId/:udise_sch_code')
  .get(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(SMESurveyAnswersValidation.filterSurveyAnswer),
    smeSurveyAnswerController.filterSurveyAnswersController
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: SME Answers
 *   description: SME Survey Answers management and retrieval
 */

/**
 * @swagger
 * /sme-answers:
 *   post:
 *     summary: Create a Survey Answers
 *     description: Only admins can create other Survey Questions.
 *     tags: [SME Answers]
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
 *             example:
 *               surveyQuetions:
 *                 - quetion: "What is your name?"
 *                   answer: ["John"]
 *               surveyId: "password1"
 *               masterProjectId: "projectId1"
 *               surveyFormId: "65b8e8428bc57009fe403698"
 *               surveyConductEmail: "john@example.com"
 *               udise_sch_code : 27040108712
 *               Longitude : 0.000000   
 *               Latitude : 0.000000
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
 *     tags: [SME Answers]
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

/**
 * @swagger
 * /sme-answers/{answerId}:
 *   get:
 *     summary: Get a Survey Answers
 *     description: Logged-in Survey Answers can fetch only their own user information. Only admins can fetch other Survey Questions.
 *     tags: [SME Answers]
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
 *     tags: [SME Answers]
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
 *     tags: [SME Answers]
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
 * /sme-answers/filters/{surveyId}/{masterProjectId}/{surveyFormId}/{udise_sch_code}:
 *   get:
 *     summary: Get Survey Answers by surveyId, masterProjectId, surveyFormId, udise_sch_code
 *     description: Get Survey Answers by surveyId, masterProjectId, surveyFormId, surveyConduct
 *     tags: [SME Answers]
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
