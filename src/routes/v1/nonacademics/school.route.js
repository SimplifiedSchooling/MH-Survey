const express = require('express');
const { getSchoolList } = require('../../../controllers/nonacademics/school.controller');

const router = express.Router();

router.get('/get', getSchoolList);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Non Academic Schools
 *   description: Non Academic School management
 */

/**
 * @swagger
 * /schools/get:
 *   get:
 *     summary: get user role details.
 *     tags: [Non Academic Schools]
 *     parameters:
 *       - in: query
 *         name: cluster
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       201:
 *         description: Details Fetched Successfully
 *       404:
 *         description: Details Not Fetched
 */
