const httpStatus = require('http-status');
const { join } = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const csv = require('csvtojson');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { blockService } = require('../services');
const ApiError = require('../utils/ApiError');

const staticFolder = join(__dirname, '../');
const uploadsFolder = join(staticFolder, 'uploads');

const bulkUploadFile = catchAsync(async (req, res) => {
  if (req.file) {
    if (req.file.mimetype !== 'text/csv') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV format.');
    }
    const csvFilePath = join(uploadsFolder, req.file.filename);
    const csvJsonArray = await csv().fromFile(csvFilePath);
    const result = await blockService.bulkUpload(csvJsonArray);
    res.send(result);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
  }
});
const createBlock = catchAsync(async (req, res) => {
  const Block = await blockService.createBlock(req.body);
  res.status(httpStatus.CREATED).send(Block);
});
const buildFilter = (search) => {
  const filter = {
    $or: [
      { Division: { $regex: search || '', $options: 'i' } },
      { District: { $regex: search || '', $options: 'i' } },
      { Block_Name: { $regex: search || '', $options: 'i' } },
    ],
  };

  // If search is a number, include it in the filter for numerical fields
  if (!isNaN(search)) {
    filter.$or.push({ district_cd: search });
    filter.$or.push({ block_cd_1: search });
    filter.$or.push({ block_cd_2: search });
  }

  return filter;
};

const getAllBlocks = catchAsync(async (req, res) => {
  const { search } = req.query;
  const query = await buildFilter(search);
  const filter = query || {};
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await blockService.queryBlock(filter, options);
  res.send(result);
});

const getBlock = catchAsync(async (req, res) => {
  const Block = await blockService.getBlockById(req.params.blockId);
  if (!Block) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Blocknot found');
  }
  res.send(Block);
});

const updateBlock = catchAsync(async (req, res) => {
  const Block = await blockService.updateBlockById(req.params.blockId, req.body);
  res.send(Block);
});

const deleteBlock = catchAsync(async (req, res) => {
  await blockService.deleteBlockById(req.params.blockId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getBlockByDistrict = catchAsync(async (req, res) => {
  const Block = await blockService.getBlocksByDistricts(req.params.District);
  if (!Block) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Block not found');
  }
  res.send(Block);
});

module.exports = {
  getAllBlocks,
  bulkUploadFile,
  getBlockByDistrict,
  deleteBlock,
  updateBlock,
  getBlock,
  createBlock,
};
