const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

const router = express.Router();
const { dashboardController } = require('../../controllers');
const { dashboardValidation } = require('../../validations');

router
  .route('/count/:masterProjectId/:surveyId/:surveyFormId')
  .get(validate(dashboardValidation.getCounts), dashboardController.getLocationCounts);
router
  .route('/getdivisionlist/:masterProjectId')
  .get(validate(dashboardValidation.getDivisionList), dashboardController.getDivisionList);

router
  .route('/filter/districtlist')
  .post(validate(dashboardValidation.getDistrictList), dashboardController.getDistrictList);

router.route('/filter/getblockList').post(validate(dashboardValidation.getBlockList), dashboardController.getBlockList);
router.get(
  '/filtercount/division/:masterProjectId/:surveyId/:surveyFormId/:division',
  dashboardController.getLocationCountsByDivisionController
);
router.get(
  '/filtercount/district/:masterProjectId/:surveyId/:surveyFormId/:district',
  dashboardController.getLocationCountsByDistrict
);
router.get(
  '/filtercount/block/:masterProjectId/:surveyId/:surveyFormId/:block',
  dashboardController.getLocationCountsByBlock
);
router.get('/filtercount', dashboardController.getLocationCountsByFiltersController);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard management
 */

/**
 * @swagger
 * /dashboard/count/{masterProjectId}/{surveyId}/{surveyFormId}:
 *   get:
 *     summary: Get counts of locations, surveyed locations, and pending locations based on masterProjectId,surveyFormId,surveyProjectId
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: masterProjectId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: surveyId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: surveyFormId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Counts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalLocations:
 *                   type: number
 *                 totalSurveyed:
 *                   type: number
 *                 totalPending:
 *                   type: number
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /dashboard/getdivisionlist/{masterProjectId}:
 *   get:
 *     summary: Get unique divisions based on masterProjectId
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: masterProjectId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the master project
 *     responses:
 *       200:
 *         description: Unique divisions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /dashboard/filter/districtlist:
 *   post:
 *     summary: Get unique district list based on masterProjectId and division
 *     tags: [Dashboard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               masterProjectId:
 *                 type: string
 *                 description: ID of the master project
 *               division:
 *                 type: string
 *                 description: Name of the division
 *     responses:
 *       200:
 *         description: Unique district list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 districtList:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /dashboard/filter/getblockList:
 *   post:
 *     summary: Get unique district list based on masterProjectId and division
 *     tags: [Dashboard]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               masterProjectId:
 *                 type: string
 *                 description: ID of the master project
 *               district:
 *                 type: string
 *                 description: Name of the district
 *     responses:
 *       200:
 *         description: Unique district list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 districtList:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /dashboard/filtercount/division/{masterProjectId}/{surveyId}/{surveyFormId}/{division}:
 *   get:
 *     summary: Get counts of locations, surveyed locations, and pending locations based on masterProjectId, surveyId, surveyFormId, and division
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: masterProjectId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: surveyId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: surveyFormId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: division
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Counts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalLocations:
 *                   type: number
 *                 totalSurveyed:
 *                   type: number
 *                 totalPending:
 *                   type: number
 *       500:
 *         description: Internal Server Error
 */

// /**
//  * @swagger
//  * /dashboard/filtercount:
//  *   get:
//  *     summary: Get counts of locations, surveyed locations, and pending locations based on masterProjectId, surveyId, surveyFormId, and optional filters
//  *     tags: [Dashboard]
//  *     parameters:
//  *       - in: path
//  *         name: masterProjectId
//  *         schema:
//  *           type: string
//  *         required: true
//  *       - in: path
//  *         name: surveyId
//  *         schema:
//  *           type: string
//  *         required: true
//  *       - in: path
//  *         name: surveyFormId
//  *         schema:
//  *           type: string
//  *         required: true
//  *       - in: query
//  *         name: division
//  *         schema:
//  *           type: string
//  *       - in: query
//  *         name: district
//  *         schema:
//  *           type: string
//  *       - in: query
//  *         name: blockName
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Counts retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 totalLocations:
//  *                   type: number
//  *                 totalSurveyed:
//  *                   type: number
//  *                 totalPending:
//  *                   type: number
//  *       500:
//  *         description: Internal Server Error
//  */

/**
 * @swagger
 * /dashboard/filtercount/district/{masterProjectId}/{surveyId}/{surveyFormId}/{district}:
 *   get:
 *     summary: Get counts of locations, surveyed locations, and pending locations based on masterProjectId, surveyId, surveyFormId, and district
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: masterProjectId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: surveyId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: surveyFormId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: district
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Counts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalLocations:
 *                   type: number
 *                 totalSurveyed:
 *                   type: number
 *                 totalPending:
 *                   type: number
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /dashboard/filtercount/block/{masterProjectId}/{surveyId}/{surveyFormId}/{block}:
 *   get:
 *     summary: Get counts of locations, surveyed locations, and pending locations based on masterProjectId, surveyId, surveyFormId, and block
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: masterProjectId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: surveyId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: surveyFormId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: block
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Counts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalLocations:
 *                   type: number
 *                 totalSurveyed:
 *                   type: number
 *                 totalPending:
 *                   type: number
 *       500:
 *         description: Internal Server Error
 */
