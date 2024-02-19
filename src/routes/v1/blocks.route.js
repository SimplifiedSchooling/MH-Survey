const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require('multer');
const path = require('path');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { blockController } = require('../../controllers');
const { blockValidation } = require('../../validations');

const router = express.Router();
const uploadDir = path.join(__dirname, '../../uploads');

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
  .route('/bulkupload-block')
  .post(
    uploads.single('file'),
    validate(blockValidation.blockShema),
    blockController.bulkUploadFile
  );
router
  .route('/')
  .post(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(blockValidation.blockShema),
    blockController.createBlock
  )
  .get(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(blockValidation.getAllblocks),
    blockController.getAllBlocks
  );

router
  .route('/:blockId')
  .get(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(blockValidation.getblock),
    blockController.getBlock
  )
  .patch(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(blockValidation.updateblock),
    blockController.updateBlock
  )
  .delete(
    auth('surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    validate(blockValidation.deleteblock),
    blockController.deleteBlock
  );

router.route('/filterby/:District').get(validate(blockValidation.getblockByDistricts), blockController.getBlockByDistrict);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Block
 *   description: Block management
 */

/**
 * @swagger
 * /block/bulkupload-block:
 *   post:
 *     summary: Upload a CSV file for bulk block upload
 *     tags: [Block]
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
 */

/**
 * @swagger
 * /block:
 *   post:
 *     summary: Create a block
 *     tags: [Block]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               block_cd:
 *                 type: number
 *               Division:
 *                 type: string
 *               block:
 *                 type: string
 *               Budget_block_seq:
 *                 type: number
 *               block_cd_2:
 *                 type: number
 *               block_cd_1:
 *                 type: number
 *               Block_Name:
 *                 type: string
 *             example:
 *               block_cd: 24567
 *               Division: Nagpur
 *               block: Nagpur
 *               Budget_block_seq: 21
 *               Block_Name: Jath
 *               block_cd_1: 273502
 *               block_cd_2: 273502
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/block'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get query block
 *     tags: [Block]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: Block_Name
 *         schema:
 *           type: string
 *         description: Block_Name
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
 *         description: Maximum number of block
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
 *                     $ref: '#/components/schemas/block'
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
 * /block/{blockId}:
 *   get:
 *     summary: Get a block
 *     tags: [Block]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blockId
 *         required: true
 *         schema:
 *           type: string
 *         description: blockId
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/block'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a block
 *     tags: [Block]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blockId
 *         required: true
 *         schema:
 *           type: string
 *         description: blockId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               block_cd:
 *                 type: number
 *               Division:
 *                 type: string
 *               block:
 *                 type: string
 *               Budget_block_seq:
 *                 type: number
 *               block_cd_2:
 *                 type: number
 *               block_cd_1:
 *                 type: number
 *               Block_Name:
 *                 type: string
 *             example:
 *               block_cd: 24567
 *               Division: Nagpur
 *               block: Nagpur
 *               Budget_block_seq: 21
 *               Block_Name: Jath
 *               block_cd_1: 273502
 *               block_cd_2: 273502
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/block'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a block
 *     tags: [Block]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blockId
 *         required: true
 *         schema:
 *           type: string
 *         description: blockId
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
 * /block/filterby/{District}:
 *   get:
 *     summary: Get a block by blockName
 *     tags: [Block]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: District
 *         required: true
 *         schema:
 *           type: string
 *         description: District name
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/block'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
