const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('node-uuid');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const { uploadFileMiddleware } = require('../../middlewares/bucket');
const { surveyQuetionsValidation } = require('../../validations');
const { surveyQuetionsController } = require('../../controllers');

const router = express.Router();

const storageMulter = multer.diskStorage({
  destination: '/home/ubuntu/MH-Survey/src/uploads',
  filename: (req, file, callback) => {
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    callback(null, uniqueFileName);
  },
});

const upload = multer({ storageMulter });

router
  .route('/')
  .post(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin', 'user'), 
    upload.single('file'), uploadFileMiddleware,
    validate(surveyQuetionsValidation.createSurveyQuetions),
    surveyQuetionsController.createSurveyQuetions
  )
  .get(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(surveyQuetionsValidation.getSurveyQuetions),
    surveyQuetionsController.getSurveyQuetions
  );

// router
//   .route('/')
//   .post(
//     // auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin', 'user'), 
//     upload.single('file'), uploadFileMiddleware,
//     // validate(surveyQuetionsValidation.createSurveyQuetions),
//     surveyQuetionsController.createSurveyQuetions
//   );
  // .get(
  //   auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
  //   validate(surveyQuetionsValidation.getSurveyQuetions),
  //   surveyQuetionsController.getSurveyQuetions
  // );

// router
//   .route('/')
//   .post(
//     upload.single('file'), // Use multer middleware to handle file upload
//     uploadFileMiddleware, // Upload file to GCS middleware
//     surveyQuetionsValidation.createSurveyQuetions,
//     surveyQuetionsController.createSurveyQuetions
//   );


// router
//   .route('/:surveyId')
//   .get(
//     auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
//     validate(surveyQuetionsValidation.getSurveyQuetionById),
//     surveyQuetionsController.getSurveyQuetion
//   )
//   .patch(
//     auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
//     validate(surveyQuetionsValidation.updateSurveyQuetion),
//     surveyQuetionsController.updateSurveyQuetions
//   )
//   .delete(
//     auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
//     validate(surveyQuetionsValidation.deleteSurveyQuetion),
//     surveyQuetionsController.deleteSurveyQuetions
//   );

// router
//   .route('/get-created-by/:createdById')
//   .get(
//     // auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
//     // validate(surveyQuetionsValidation.getSurveyQuetionByCreatedById),
//     surveyQuetionsController.getSurveyQuetionsBycreatedById
//   );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Survey Quetions
 *   description: Survey Quetions management and retrieval
 */

/**
 * @swagger
 * /survey-questions:
 *   post:
 *     summary: Create a Survey Questions
 *     description: Only admins can create survey questions.
 *     tags: [Survey Quetions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                     name:
 *                       type: string
 *                     title:
 *                       type: string
 *               createdById:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *             example:
 *               title: "fake name"
 *               description: "fake description"
 *               questions:
 *                 - type: "text"
 *                   name: "name"
 *                   title: "What is your name?"
 *               createdById: "password1"
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SurveyQuestions'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all Survey Quetions
 *     description: Only admins can retrieve all Surevy Quetions.
 *     tags: [Survey Quetions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Survey title
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
 *         description: Maximum number of Surevy Quetions
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
 *                     $ref: '#/components/schemas/SurveyQuetions'
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
 * /survey-questions/{surveyId}:
 *   get:
 *     summary: Get a suervey quetions
 *     description: Logged in Surevy Quetions can fetch only their own user information. Only admins can fetch other Surevy Quetions.
 *     tags: [Survey Quetions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: surveyId
 *         required: true
 *         schema:
 *           type: string
 *         description: surveyId
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SurveyQuetions'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a survey quetions
 *     description: Logged in Surevy Quetions can only update their own information. Only admins can update other Surevy Quetions.
 *     tags: [Survey Quetions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: surveyId
 *         required: true
 *         schema:
 *           type: string
 *         description: surveyId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                     name:
 *                       type: string
 *                     title:
 *                       type: string
 *               createdById:
 *                 type: string
 *             example:
 *               title: "fake name"
 *               questions:
 *                 - type: "text"
 *                   name: "name"
 *                   title: "What is your name?"
 *               createdById: "password1"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SurveyQuetions'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a survey quetions
 *     description: Logged in Surevy Quetions can delete only themselves. Only admins can delete other Surevy Quetions.
 *     tags: [Survey Quetions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: surveyId
 *         required: true
 *         schema:
 *           type: string
 *         description: surveyId
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
 * /survey-questions/get-created-by/{createdById}:
 *   get:
 *     summary: Get a suervey quetions
 *     description: Logged in Surevy Quetions can fetch only their own user information. Only admins can fetch other Surevy Quetions.
 *     tags: [Survey Quetions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: createdById
 *         required: true
 *         schema:
 *           type: string
 *         description: surveyId
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/SurveyQuetions'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
