const express = require('express');
const multer = require('multer');
const path = require('path');
const validate = require('../../../middlewares/validate');
const locationcontroller = require('../../../controllers/nonacademics/location.controller');

const router = express.Router();
const uploadDir = path.join(__dirname, '../../../uploads');

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
  .route('/bulkupload')
  .post(uploads.single('file'), locationcontroller.createLocation)
  .get(locationcontroller.getAllLocation);

router
  .route('/:locationId')
  .get(locationcontroller.getLocationById)
  .patch(locationcontroller.updateLocationById)
  .delete(locationcontroller.deleteistrictById);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Location
 *   description:   Location Management System
 */

/**
 * @swagger
 * /location/bulkupload:
 *   post:
 *     summary: Create a new Location
 *     tags: [Location]
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
 *   get:
 *     summary: Get list of SubLocation
 *     tags: [Location]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: search by LocationCode, ClusterCode , SchoolName
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of Location
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
 *                     $ref: '#/components/schemas/Location'
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
 *
 * /location/{locationId}:
 *   patch:
 *     summary: Update a single subSubLocation by ID
 *     tags: [Location]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the SubLocation
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubLocationUpdateInput'
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 *       404:
 *         description: SubLocation not found
 *   delete:
 *     summary: Delete a single subSubLocation by ID
 *     tags: [Location]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the SubLocation
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: SubLocation not found
 *   get:
 *     summary: Get a single subSubLocation by ID
 *     tags: [Location]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the SubLocation
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: SubLocation not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       properties:
 *         LocationCode:
 *           type: string
 *         ClusterCode:
 *           type: string
 *         LocationTypeCode:
 *           type: string
 *         SchoolName:
 *           type: string
 *         Address:
 *           type: string
 *         City:
 *           type: string
 *         District:
 *           type: string
 *         State:
 *           type: string
 *         PinCode:
 *           type: string
 *         SPOCName:
 *           type: string
 *         SPOCEmail:
 *           type: string
 *         SPOCContact:
 *           type: string
 *       example:
 *         LocationCode: ABC
 *         ClusterCode: XYZ
 *         LocationTypeCode: L1
 *         SchoolName: Example School
 *         Address: 123 Example St
 *         City: Example City
 *         District: Example District
 *         State: Example State
 *         PinCode: 123456
 *         SPOCName: John Doe
 *         SPOCEmail: john.doe@example.com
 *         SPOCContact: +1234567890
 */

/**
 * @swagger
 * components:
 *   schemas:
 *    SubLocationUpdateInput:
 *       type: object
 *       properties:
 *         LocationCode:
 *           type: string
 *         ClusterCode:
 *           type: string
 *         LocationTypeCode:
 *           type: string
 *         SchoolName:
 *           type: string
 *         Address:
 *           type: string
 *         City:
 *           type: string
 *         District:
 *           type: string
 *         State:
 *           type: string
 *         PinCode:
 *           type: string
 *         SPOCName:
 *           type: string
 *         SPOCEmail:
 *           type: string
 *         SPOCContact:
 *           type: string
 *       example:
 *       LocationCode: ABC
 *       ClusterCode: XYZ
 *       LocationTypeCode: XYZ
 *       SchoolName: Example School
 *       Address: Example Address
 *       City: Example City
 *       District: Example District
 *       State: Example State
 *       PinCode: 123456
 *       SPOCName: John Doe
 *       SPOCEmail: john.doe@example.com
 *       SPOCContact: 1234567890
 */
