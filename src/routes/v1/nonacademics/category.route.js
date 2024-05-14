const express = require('express');
const multer = require('multer');
const path = require('path');
const categorycontroller = require('../../../controllers/nonacademics/category.controller');

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
  .post(uploads.single('file'), categorycontroller.createcategory)
  .get(categorycontroller.getAllcategory);

router
  .route('/:categoryid')
  .get(categorycontroller.getcategoryById)
  .patch(categorycontroller.updatecategoryById)
  .delete(categorycontroller.deleteistrictById);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Category
 *   description:   Category Management System
 */

/**
 * @swagger
 * /category/bulkupload:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
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
 *     summary: Get list of category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: search by DepartmentCode, SubDepartmentCode, SubSubDepartmentCode, CategoryCode
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
 *         description: Maximum number of category
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
 *                     $ref: '#/components/schemas/CategoryInput'
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
 * /category/{categoryid}:
 *   patch:
 *     summary: Update a single category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: categoryid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DepartmentUpdateInput'
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 *       404:
 *         description: category not found
 *   delete:
 *     summary: Delete a single category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: categoryid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: category not found
 *   get:
 *     summary: Get a single category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: categoryid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: category not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CategoryInput:
 *       type: object
 *       properties:
 *         DepartmentGroupCode:
 *           type: string
 *         DepartmentCode:
 *           type: string
 *         DepartmentDescription:
 *           type: string
 *         DepartmentWeightage:
 *           type: string
 *         SubDepartmentCode:
 *           type: string
 *         SubDepartmentDescription:
 *           type: string
 *         SubDepartmentWeightage:
 *           type: string
 *         SubSubDepartmentCode:
 *           type: string
 *         SubSubDepartmentDescription:
 *           type: string
 *         SubSubDepartmentWeightage:
 *           type: string
 *         CategoryCode:
 *           type: string
 *         CategoryDescription:
 *           type: string
 *         CategoryWeightage:
 *           type: number
 *         CategoryDisplayOrder:
 *           type: number
 *       example:
 *         DepartmentGroupCode: NON ACADEMIC
 *         DepartmentCode: HR
 *         DepartmentDescription: Human Resources and Development
 *         DepartmentWeightage:
 *         SubDepartmentCode: HS
 *         SubDepartmentDescription: HR Services
 *         SubDepartmentWeightage:
 *         SubSubDepartmentCode: SC
 *         SubSubDepartmentDescription: School
 *         SubSubDepartmentWeightage:
 *         CategoryCode: SC_CT1
 *         CategoryDescription: Category 1
 *         CategoryWeightage: 50
 *         CategoryDisplayOrder: 1
 */

/**
 * @swagger
 * components:
 *   schemas:
 *    DepartmentUpdateInput:
 *       type: object
 *       properties:
 *         DepartmentGroupCode:
 *           type: string
 *         DepartmentCode:
 *           type: string
 *         DepartmentDescription:
 *           type: string
 *         DepartmentWeightage:
 *           type: number
 *         SubDepartmentCode:
 *           type: string
 *         SubDepartmentDescription:
 *           type: string
 *         SubDepartmentWeightage:
 *           type: number
 *         SubSubDepartmentCode:
 *           type: string
 *         SubSubDepartmentDescription:
 *           type: string
 *         SubSubDepartmentWeightage:
 *           type: number
 *         CategoryCode:
 *           type: string
 *         CategoryDescription:
 *           type: string
 *         CategoryWeightage:
 *           type: number
 *         CategoryDisplayOrder:
 *           type: number
 *       example:
 *         DepartmentGroupCode: NON ACADEMIC
 *         DepartmentCode: HR
 *         DepartmentDescription: Human Resources and Development
 *         DepartmentWeightage: 20
 *         SubDepartmentCode: HS
 *         SubDepartmentDescription: HR Services
 *         SubDepartmentWeightage: 10
 *         SubSubDepartmentCode: SC
 *         SubSubDepartmentDescription: School
 *         SubSubDepartmentWeightage: 10
 *         CategoryCode: SC_CT1
 *         CategoryDescription: Category 1
 *         CategoryWeightage: 50
 *         CategoryDisplayOrder: 1
 */
