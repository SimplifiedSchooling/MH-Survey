const express = require('express');
const multer = require('multer');
const path = require('path');
const validate = require('../../../middlewares/validate');
const departmentValidation = require('../../../validations/nonacademics/sub.sub.department.validation');
const departmentcontroller = require('../../../controllers/nonacademics/sub.sub.department.controller');

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
  .post(uploads.single('file'), departmentcontroller.createSubSubDepartment)
  .get(validate(departmentValidation.getAlldepartment), departmentcontroller.getAllSubSubDepartment);

router
  .route('/:subsubdepartmentId')
  .get(validate(departmentValidation.getdepartmentById), departmentcontroller.getSubSubDepartmentById)
  .patch(validate(departmentValidation.updatedepartmentbyId), departmentcontroller.updateSubSubDepartmentById)
  .delete(validate(departmentValidation.deleteDepartmentById), departmentcontroller.deleteistrictById);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: SubSubDepartment
 *   description:   SubSubDepartment Management System
 */

/**
 * @swagger
 * /subsubdepartment/bulkupload:
 *   post:
 *     summary: Create a new department
 *     tags: [SubSubDepartment]
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
 *     summary: Get list of department
 *     tags: [SubSubDepartment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: search by DepartmentCode, DepartmentGroupCode, DepartmentDescription, SubDepartmentCode, SubDepartmentDescription , SubSubDepartmentCode, SubSubDepartmentDescription
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
 *         description: Maximum number of Department
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
 *                     $ref: '#/components/schemas/DepartmentInput'
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
 * /subsubdepartment/{subsubdepartmentId}:
 *   patch:
 *     summary: Update a single subsubdepartment by ID
 *     tags: [SubSubDepartment]
 *     parameters:
 *       - in: path
 *         name: subsubdepartmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the SubSubDepartment
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
 *         description: SubSubDepartment not found
 *   delete:
 *     summary: Delete a single SubSubDepartment by ID
 *     tags: [SubSubDepartment]
 *     parameters:
 *       - in: path
 *         name: subsubdepartmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the SubSubDepartment
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: SubSubDepartment not found
 *   get:
 *     summary: Get a single SubSubDepartment by ID
 *     tags: [SubSubDepartment]
 *     parameters:
 *       - in: path
 *         name: subsubdepartmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the SubSubDepartment
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: SubSubDepartment not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DepartmentInput:
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
 */
