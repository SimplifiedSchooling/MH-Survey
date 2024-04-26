const express = require('express');
const multer = require('multer');
const Excel = require('exceljs');
const path = require('path');
const auditParameterController = require('../../../controllers/nonacademics/audit.parameters.controller');

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

// router
//   // .route('/bulkupload')
//   // .post(uploads.single('file'), auditParameterController.createAuditParameter)
//   .get(auditParameterController.getAllAuditParameter);

// router
//   .route('/:auditParameterId')
//   .get(auditParameterController.getAuditParameterById)
//   .patch(auditParameterController.updateAuditParameterById)
//   .delete(auditParameterController.deleteistrictById);

;


router.route('/bulkupload').post(uploads.single('file'), async (req, res) => {
    try {
        // Read uploaded Excel file
        const workbook = new Excel.Workbook();
        console.log(workbook);

        await workbook.xlsx.readFile(req.file.path);
     
        const worksheet = workbook.getWorksheet(1);

        // Loop through each row in the worksheet
        worksheet.eachRow({ includeEmpty: true }, async function(row, rowNumber) {
            if (rowNumber > 1) {
                const roles = [];
                let col = 21; // Starting column number for roles data

                // Loop through role data columns
                while (row.getCell(col).value !== undefined) {
                     console.log(row)
                    const role = {
                        RoleCode: row.getCell(col).value,
                        RoleDescription: row.getCell(col + 1).value,
                        Frequency: row.getCell(col + 2).value,
                        Criticality: row.getCell(col + 3).value
                    };

                    roles.push(role);
                    col += 4; // Move to the next set of role data columns
                }

                const rowData = {
                    Question: `Is ${row.getCell(16).value} maintained`,
                    AllowedResponse: 'YES_NO',
                    DisplayOrder: row.getCell(17).value,
                    EvidenceRequired: true,
                    DepartmentCode: row.getCell(2).value,
                    SubDepartmentCode: row.getCell(5).value,
                    SubSubDepartmentCode: row.getCell(8).value || '',
                    Category: row.getCell(12).value,
                    SubCategory: row.getCell(14).value,
                    IsOnsite: true,
                    Roles: roles
                };
                

                // Save the data to MongoDB
               console.log(rowData)
                const newData = new Data(rowData);
                await newData.save();
            }
        });
        console.log(worksheet)
        res.status(200).send('Data saved to MongoDB' );
    } catch (error) {
        console.error(error);
        // res.status(500).send('Internal Server Error');
    }
});
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
 *     summary: Create a new AuditParameter
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
 *         description: Successfully added CSV file
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
 * /auditparameter/{auditParameterId}:
 *   patch:
 *     summary: Update a single AuditParameter by ID
 *     tags: [AuditParameter]
 *     parameters:
 *       - in: path
 *         name: auditParameterId
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
 *         name: auditParameterId
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
 *         name: auditParameterId
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
