const express = require('express');
const multer = require('multer');
const path = require('path');
const subcategorycontroller = require('../../../controllers/nonacademics/sub.category.controller');

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
  .post(uploads.single('file'), subcategorycontroller.createSubCategory)
  .get(subcategorycontroller.getAllsubCategory);

router
  .route('/:subCategoryId')
  .get(subcategorycontroller.getsubCategoryById)
  .patch(subcategorycontroller.updatesubCategoryById)
  .delete(subcategorycontroller.deleteistrictById);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: SubCategory
 *   description:   subcategory Management System
 */

/**
 * @swagger
 * /subcategory/bulkupload:
 *   post:
 *     summary: Create a new subcategory
 *     tags: [SubCategory]
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
 *     summary: Get list of subcategory
 *     tags: [SubCategory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description:  search by DepartmentCode, SubDepartmentCode, SubSubDepartmentCode, CategoryCode, SubCategoryCode
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
 *         description: Maximum number of subcategory
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
 *                     $ref: '#/components/schemas/SubcategoryInput'
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
 * /subcategory/{subcategoryId}:
 *   patch:
 *     summary: Update a single subcategory by ID
 *     tags: [SubCategory]
 *     parameters:
 *       - in: path
 *         name: subCategoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the subcategory
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
 *         description: subcategory not found
 *   delete:
 *     summary: Delete a single subcategory by ID
 *     tags: [SubCategory]
 *     parameters:
 *       - in: path
 *         name: subCategoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the subcategory
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: subcategory not found
 *   get:
 *     summary: Get a single subcategory by ID
 *     tags: [SubCategory]
 *     parameters:
 *       - in: path
 *         name: subCategoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the subcategory
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: subcategory not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SubcategoryInput:
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
 *         SubCategoryCode:
 *           type: string
 *         SubCategoryDescription:
 *           type: string
 *         SubCategoryWeightage:
 *           type: number
 *         SubCategoryDisplayOrder:
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
 *         SubCategoryCode: SC_CT1_SUBCT1
 *         SubCategoryDescription: Sub Category 1
 *         SubCategoryWeightage: 40
 *         SubCategoryDisplayOrder: 1
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
 *         SubCategoryCode:
 *           type: string
 *         SubCategoryDescription:
 *           type: string
 *         SubCategoryWeightage:
 *           type: number
 *         SubCategoryDisplayOrder:
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
 *         SubCategoryCode: SC_CT1_SUBCT1
 *         SubCategoryDescription: Sub Category 1
 *         SubCategoryWeightage: 40
 *         SubCategoryDisplayOrder: 1
 */
