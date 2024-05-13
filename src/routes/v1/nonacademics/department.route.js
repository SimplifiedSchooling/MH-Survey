const express = require('express');
const multer = require('multer');
const path = require('path');
const validate = require('../../../middlewares/validate');
const departmentValidation = require('../../../validations/nonacademics/department.validation');
const departmentcontroller = require('../../../controllers/nonacademics/department.controller');

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
  .post(uploads.single('file'), departmentcontroller.createDepartment)
  .get(validate(departmentValidation.getAlldepartment), departmentcontroller.getAllDepartment);

router
  .route('/:departmentid')
  .get(validate(departmentValidation.getdepartmentById), departmentcontroller.getDepartmentById)
  .patch(validate(departmentValidation.updatedepartmentbyId), departmentcontroller.updateDepartmentById)
  .delete(validate(departmentValidation.deleteDepartmentById), departmentcontroller.deleteistrictById);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Department
 *   description:   Department Management System
 */

/**
 * @swagger
 * /department/bulkupload:
 *   post:
 *     summary: Create a new department
 *     tags: [Department]
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
 *     tags: [Department]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: search by DepartmentCode, DepartmentGroupCode , DepartmentDescription
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
 *                     $ref: '#/components/schemas/Department'
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
 * /department/{departmentid}:
 *   patch:
 *     summary: Update a single department by ID
 *     tags: [Department]
 *     parameters:
 *       - in: path
 *         name: departmentid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the department
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Department'
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 *       404:
 *         description: department not found
 *   delete:
 *     summary: Delete a single department by ID
 *     tags: [Department]
 *     parameters:
 *       - in: path
 *         name: departmentid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the department
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: department not found
 *   get:
 *     summary: Get a single department by ID
 *     tags: [Department]
 *     parameters:
 *       - in: path
 *         name: departmentid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the department
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: department not found
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
 *       example:
 *         DepartmentGroupCode: NON ACADEMIC
 *         DepartmentCode: HR
 *         DepartmentDescription: Human Resources and Development
 *         DepartmentWeightage: 20
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Department:
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
 *       example:
 *         DepartmentGroupCode: NON ACADEMIC
 *         DepartmentCode: HR
 *         DepartmentDescription: Human Resources and Development
 *         DepartmentWeightage: 20
 */
