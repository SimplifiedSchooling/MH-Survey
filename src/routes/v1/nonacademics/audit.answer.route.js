const express = require('express');
const validate = require('../../../middlewares/validate');
const auditAnswercontroller = require('../../../controllers/nonacademics/audit.answer.controller');
const auditAnswerValidation = require('../../../validations/nonacademics/audit.answer.validation');

const router = express.Router();

router.route('/').post(auditAnswercontroller.createAuditAnswer).get(auditAnswercontroller.getAllAuditAnswer);

router
  .route('/:auditAnswerId')
  .get(auditAnswercontroller.getAuditAnswerById)
  .patch(auditAnswercontroller.updateAuditAnswerById)
  .delete(auditAnswercontroller.deleteistrictById);

router.route('/createorupdate').post(auditAnswercontroller.createOrUpdateAuditAnswer);

router
  .route('/getanswers/byfilters')
  .post(validate(auditAnswerValidation.getAuditAnswers), auditAnswercontroller.getAuditAnswers);

router.route('/updateProperty').post(auditAnswercontroller.updateAnswerProperty);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: AuditAnswer
 *   description: AuditAnswer management
 */

/**
 * @swagger
 * /auditanswer/createorupdate:
 *   post:
 *     summary: Create a AuditAnswer
 *     tags: [AuditAnswer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuditAnswer'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/AuditAnswer'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /auditanswer/getanswers/byfilters:
 *   post:
 *     summary: Get all Audit answers for filters
 *     tags: [AuditAnswer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departmentCode:
 *                 type: string
 *               subDepartmentCode:
 *                 type: string
 *               subSubDepartmentCode:
 *                 type: string
 *               frequency:
 *                 type: string
 *               roleCode:
 *                 type: string
 *               userId:
 *                 type: string
 *               schoolId:
 *                 type: string
 *             required:
 *               - departmentCode
 *               - subDepartmentCode
 *               - subSubDepartmentCode
 *               - frequency
 *               - roleCode
 *               - userId
 *               - schoolId
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuditAnswer'
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /auditanswer:
 *   post:
 *     summary: Create a AuditAnswer
 *     tags: [AuditAnswer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuditAnswer'
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/AuditAnswer'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /auditanswer:
 *   get:
 *     summary: Get query AuditAnswer
 *     tags: [AuditAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description:  search by deptCode, subDeptCode, subSubDeptCode, category, subCategory, SubSubCategory
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
 *         description: Maximum number of AuditAnswer
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
 *                     $ref: '#/components/schemas/AuditAnswer'
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
 * /auditanswer/{auditAnswerId}:
 *   get:
 *     summary: Get a AuditAnswer
 *     tags: [AuditAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: auditAnswerId
 *         required: true
 *         schema:
 *           type: string
 *         description: auditAnswerId
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/AuditAnswer'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a AuditAnswer
 *     tags: [AuditAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: auditAnswerId
 *         required: true
 *         schema:
 *           type: string
 *         description: auditAnswerId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuditAnswer'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/AuditAnswer'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a AuditAnswer
 *     tags: [AuditAnswer]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: auditAnswerId
 *         required: true
 *         schema:
 *           type: string
 *         description: auditAnswerId
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
 * /auditAnswer/updateProperty:
 *   post:
 *     summary: Update a property in the answer object for multiple questions
 *     tags: [AuditAnswer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filter:
 *                 type: object
 *                 description: Filter to find the audit answer document
 *                 properties:
 *                   schoolId:
 *                     type: string
 *                   deptCode:
 *                     type: string
 *                   subDeptCode:
 *                     type: string
 *                   subSubDeptCode:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   roleCode:
 *                     type: string
 *                   frequency:
 *                     type: string
 *               filter2:
 *                 type: object
 *                 description: Filter to find the question from answer answer
 *                 properties:
 *                   question:
 *                     type: string
 *                   category:
 *                     type: string
 *                   subCategory:
 *                     type: string
 *               propertyToUpdate:
 *                 type: string
 *                 description: The property in the answer object to update
 *               newValue:
 *                 type: string
 *                 description: The new value to set for the property
 *             required:
 *               - filter
 *               - filter2
 *               - propertyToUpdate
 *               - newValue
 *     responses:
 *       '200':
 *         description: Updated audit answer with the property updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuditAnswer'
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AuditAnswer:
 *       type: object
 *       properties:
 *         schoolId:
 *           type: string
 *           description: The ID of the school being audited.
 *         deptCode:
 *           type: string
 *           description: The department code.
 *         subDeptCode:
 *           type: string
 *           description: The sub-department code.
 *         subSubDeptCode:
 *           type: string
 *           description: The sub-sub-department code.
 *         frequency:
 *           type: string
 *           description: The frequency of the audit.
 *         roleCode:
 *           type: string
 *           description: The role code associated with the audit.
 *         finalSubmit:
 *           type: boolean
 *           description: final submit of the form
 *         userId:
 *           type: string
 *           description: user object id
 *         answers:
 *           type: array
 *           description: The array of answers provided for the audit.
 *           items:
 *             $ref: '#/components/schemas/Answer'
 *       required:
 *         - schoolId
 *         - deptCode
 *         - subDeptCode
 *         - subSubDeptCode
 *         - frequency
 *         - roleCode
 *         - finalSubmit
 *         - userId
 *
 *     Answer:
 *       type: object
 *       properties:
 *         question:
 *           type: string
 *           description: The question being audited.
 *         answer:
 *           type: string
 *           description: The answer to the question.
 *         imageLink:
 *           type: string
 *           description: The link to an image associated with the answer.
 *         criticality:
 *           type: string
 *           description: The criticality of the answer.
 *         comment:
 *           type: string
 *           description: The criticality of the answer.
 *         OnsiteorOffsite:
 *           type: string
 *           description: Indicates if the audit is onsite or offsite.
 *         category:
 *           type: string
 *           description: The category of the audit.
 *         subCategory:
 *           type: string
 *           description: The sub-category of the audit.
 *       required:
 *         - question
 *         - answer
 *         - imageLink
 *         - criticality
 *         - comment
 *         - OnsiteorOffsite
 *         - category
 *         - subCategory
 */
