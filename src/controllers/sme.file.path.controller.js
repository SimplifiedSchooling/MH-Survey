const httpStatus = require('http-status');
const { URL } = require('url');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { smeFilePathService } = require('../services');

// Function to extract file path from URL
const extractFilePath = (fileUrl) => {
  const url = new URL(fileUrl);
  return url.pathname;
};

const createFilePath = catchAsync(async (req, res) => {
  req.body.file = extractFilePath(req.fileUrl);
  const filePath = await smeFilePathService.createFilePath(req.body);
  res.status(httpStatus.CREATED).send(filePath);
});

const queryFilePath = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['questionName']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await smeFilePathService.queryFilePath(filter, options);
  res.send(result);
});

const getFilepath = catchAsync(async (req, res) => {
  const filePath = await smeFilePathService.getFilePathById(req.params.questionId);
  if (!filePath) {
    throw new ApiError(httpStatus.NOT_FOUND, 'file path not  found');
  }
  res.send(filePath);
});

module.exports = {
  createFilePath,
  queryFilePath,
  getFilepath,
};
