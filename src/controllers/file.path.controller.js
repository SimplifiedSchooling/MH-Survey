const httpStatus = require('http-status');
const { URL } = require('url');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { filePathService } = require('../services');

// Function to extract file path from URL
const extractFilePath = (fileUrl) => {
  const url = new URL(fileUrl);
  return url.pathname;
};

const createFilePath = catchAsync(async (req, res) => {
  req.body.file = await extractFilePath(req.fileUrl);
  const filePath = await filePathService.createFilePath(req.body);
  res.status(httpStatus.CREATED).send(filePath);
});

const queryFilePath = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await filePathService.queryFilePath(filter, options);
  res.send(result);
});

const getFilepath = catchAsync(async (req, res) => {
  const filePath = await filePathService.getFilePathById(req.params.questionId);
  if (!filePath) {
    throw new ApiError(httpStatus.NOT_FOUND, 'file path not  found');
  }
  res.send(filePath);
});

const updateFilePath = catchAsync(async (req, res) => {
  //   const { updatedFilePath, questionName } = req.body;
  const filePath = await filePathService.updateFilePathById(req.params.questionId, req.body);
  res.send(filePath);
});

const deleteFilePath = catchAsync(async (req, res) => {
  //   const { updatedFilePath, questionName } = req.body;
  await filePathService.updateFilePathById(req.params.questionId, req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createFilePath,
  queryFilePath,
  getFilepath,
  updateFilePath,
  deleteFilePath,
};
