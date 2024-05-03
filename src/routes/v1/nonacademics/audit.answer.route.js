const express = require('express');
const auditAnswercontroller = require('../../../controllers/nonacademics/audit.answer.controller');

const router = express.Router();

router.route('/').post(auditAnswercontroller.createAuditAnswer).get(auditAnswercontroller.getAllAuditAnswer);

router
  .route('/:auditAnswerId')
  .get(auditAnswercontroller.getAuditAnswerById)
  .patch(auditAnswercontroller.updateAuditAnswerById)
  .delete(auditAnswercontroller.deleteistrictById);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: AuditAnswer
 *   description: AuditAnswer management
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
 *         category:
 *           type: string
 *           description: The category of the audit.
 *         subCategory:
 *           type: string
 *           description: The sub-category of the audit.
 *         SubSubCategory:
 *           type: string
 *           description: The sub-sub-category of the audit.
 *         OnsiteorOffsite:
 *           type: string
 *           description: Indicates if the audit is onsite or offsite.
 *         frequency:
 *           type: string
 *           description: The frequency of the audit.
 *         roleCode:
 *           type: string
 *           description: The role code associated with the audit.
 *         finalSubmit:
 *           type: boolean
 *           description: final submit of the form 
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
 *         - category
 *         - subCategory
 *         - frequency
 *         - roleCode
 *         - finalSubmit
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
 *       required:
 *         - question
 *         - answer
 *         - imageLink
 *         - criticality
 *         - comment
 */
