const express = require('express');
const multer = require('multer');
const path = require('path');
const validate = require('../../../middlewares/validate');
const auditParameterController = require('../../../controllers/nonacademics/audit.parameters.controller');
const auditParametersValidation = require('../../../validations/nonacademics/audit.parameter.validation');

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
  .post(uploads.single('file'), auditParameterController.createAuditParameter)
  .get(validate(auditParametersValidation.getAllAuditParameter), auditParameterController.getAllAuditParameter);

router
  .route('/:auditparameterid')
  .get(validate(auditParametersValidation.getAuditParameterById), auditParameterController.getAuditParameterById)
  .patch(auditParameterController.updateAuditParameterById)
  .delete(validate(auditParametersValidation.deleteAuditParameterById), auditParameterController.deleteistrictById);

router.route('/getquestionlist/byrolcode').get(auditParameterController.getQuestionsByRoleCode);

router.route('/departmentlist/byrolecode/:roleCode/:schoolId/:level').get(auditParameterController.getDepartmentByRoleCode);
// router.route('/departmentlist/byrolecode').get(auditParameterController.getDepartmentByRoleCode);
router.route('/data/filter').post(auditParameterController.filterDataByParameters);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: AuditParameter
 *   description:   AuditParameter Management System
 */

/**
 * @swagger
 * /auditparameter/bulkupload:
 *   post:
 *     summary: Create a new AuditParameter by uploading excel file
 *     tags: [AuditParameter]
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
 *         description: Successfully added Excel file
 *       404:
 *         description: Missing file
 *   get:
 *     summary: Get list of AuditParameter
 *     tags: [AuditParameter]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description:  search by DepartmentCode, SubDepartmentCode, SubSubDepartmentCode, CategoryCode, AuditParameterCode
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
 *         description: Maximum number of AuditParameter
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
 *                     $ref: '#/components/schemas/AuditParameterInput'
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
 * /auditparameter/{auditparameterid}:
 *   patch:
 *     summary: Update a single AuditParameter by ID
 *     tags: [AuditParameter]
 *     parameters:
 *       - in: path
 *         name: auditparameterid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the AuditParameter
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
 *         description: AuditParameter not found
 *   delete:
 *     summary: Delete a single AuditParameter by ID
 *     tags: [AuditParameter]
 *     parameters:
 *       - in: path
 *         name: auditparameterid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the AuditParameter
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: AuditParameter not found
 *   get:
 *     summary: Get a single AuditParameter by ID
 *     tags: [AuditParameter]
 *     parameters:
 *       - in: path
 *         name: auditparameterid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the AuditParameter
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: AuditParameter not found
 */

/**
 * @swagger
 * /auditparameter/getquestionlist/byrolcode:
 *   get:
 *     summary: Get questions by role code,Frequency , department, sub-department, and sub-sub-department
 *     tags: [AuditParameter]
 *     parameters:
 *       - in: query
 *         name: roleCode
 *         required: true
 *         description: Role code to filter questions
 *         schema:
 *           type: string
 *       - in: query
 *         name: freq
 *         required: true
 *         description: freq to filter questions
 *         schema:
 *           type: string
 *       - in: query
 *         name: DepartmentCode
 *         required: true
 *         description: Department code to filter questions
 *         schema:
 *           type: string
 *       - in: query
 *         name: SubDepartmentCode
 *         required: true
 *         description: Sub-department code to filter questions
 *         schema:
 *           type: string
 *       - in: query
 *         name: SubSubDepartmentCode
 *         required: true
 *         description: Sub-sub-department code to filter questions
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: List of questions grouped by category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 Safety:
 *                   - Question: "What is the safety procedure?"
 *                     AllowedResponse: "Yes"
 *                   - Question: "How often is the safety inspection conducted?"
 *                     AllowedResponse: "Monthly"
 *                 Compliance:
 *                   - Question: "Are we compliant with regulations?"
 *                     AllowedResponse: "Yes"
 */

/**
 * @swagger
 * /auditparameter/data/filter:
 *   post:
 *     summary: Filter audit data by parameters
 *     tags: [AuditParameter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleCode:
 *                 type: string
 *               DepartmentCode:
 *                 type: string
 *               SubDepartmentCode:
 *                 type: string
 *               SubSubDepartmentCode:
 *                 type: string
 *               freq:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved filtered data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AuditParameter'
 *       '400':
 *         description: Invalid request body
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /auditparameter/departmentlist/byrolecode/{roleCode}/{schoolId}:
 *   get:
 *     summary: Get questions by role code
 *     tags: [AuditParameter]
 *     parameters:
 *       - in: path
 *         name: roleCode
 *         required: true
 *         description: Role code to filter questions
 *         schema:
 *           type: string
 *       - in: path
 *         name: schoolId
 *         required: true
 *         description: School ID to filter questions
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         required: false
 *         description: Sort option in the format (desc|asc)
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Maximum number of results per page
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: page
 *         required: false
 *         description: Current page number
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       "200":
 *         description: List of questions with corresponding department, sub-department, and sub-sub-department
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QuestionResponse'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     AuditParameterInput:
 *       type: object
 *       properties:
 *         Question:
 *           type: string
 *         AllowedResponse:
 *           type: string
 *         DisplayOrder:
 *           type: number
 *         EvidenceRequired:
 *           type: string
 *         DepartmentCode:
 *           type: string
 *         SubDepartmentCode:
 *           type: string
 *         SubSubDepartmentCode:
 *           type: string
 *         Category:
 *           type: string
 *         SubCategory:
 *           type: string
 *         SubSubCategory:
 *           type: string
 *         OnsiteorOffsite:
 *           type: string
 *       example:
 *         Question: Example Question
 *         AllowedResponse: Yes, No
 *         DisplayOrder: 1
 *         EvidenceRequired: Yes , No
 *         DepartmentCode: HR
 *         SubDepartmentCode: HS
 *         SubSubDepartmentCode: SC
 *         Category: Category 1
 *         SubCategory: Sub Category 1
 *         SubSubCategory: Sub Sub Category 1
 *         OnsiteorOffsites: Onsite
 */

/**
 * @swagger
 * components:
 *   schemas:
 *    DepartmentUpdateInput:
 *       type: object
 *       properties:
 *         Question:
 *           type: string
 *         AllowedResponse:
 *           type: string
 *         DisplayOrder:
 *           type: number
 *         EvidenceRequired:
 *           type: string
 *         DepartmentCode:
 *           type: string
 *         SubDepartmentCode:
 *           type: string
 *         SubSubDepartmentCode:
 *           type: string
 *         Category:
 *           type: string
 *         SubCategory:
 *           type: string
 *         SubSubCategory:
 *           type: string
 *         OnsiteorOffsite:
 *           type: string
 *       example:
 *         Question: Example Question
 *         AllowedResponse: Yes, No
 *         DisplayOrder: 1
 *         EvidenceRequired: Yes , No
 *         DepartmentCode: HR
 *         SubDepartmentCode: HS
 *         SubSubDepartmentCode: SC
 *         Category: Category 1
 *         SubCategory: Sub Category 1
 *         SubSubCategory: Sub Sub Category 1
 *         OnsiteorOffsites: Onsite
 */
