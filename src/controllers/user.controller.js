const httpStatus = require('http-status');
const fs = require('fs');
const { join } = require('path');
const csv = require('csvtojson');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const bulkUploadFile = catchAsync(async (req, res) => {
  if (req.file) {
    const csvFilePath = join(req.file.path);
    const csvJsonArray = await csv().fromFile(csvFilePath);
    const user = await userService.bulkUploadUsers(null, csvJsonArray);
    res.status(httpStatus.CREATED).send(user);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
  }
});

const bulkUploadNonAcademicFile = catchAsync(async (req, res) => {
  if (req.file) {
    const csvFilePath = join(req.file.path);
    const csvJsonArray = await csv().fromFile(csvFilePath);
    const jsonArray = [];
    console.log('csvJsonArray ', csvJsonArray.length);
    for (const csvData of csvJsonArray) {
      const normalizedData = {};
      for (const key in csvData) {
        normalizedData[normalizeHeaders(key)] = csvData[key];
      }
      jsonArray.push(normalizedData);
    }
    // const csvJsonArray = await parseCsvFile(csvFilePath);
    console.log('jsonArray ==> ', jsonArray);

    const user = await userService.bulkUploadNonAcademicUsers(null, jsonArray);
    res.status(httpStatus.CREATED).send(user);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
  }
});

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const checkUser = catchAsync(async (req, res) => {
  const user = await userService.checkUserByEmailAndRole(req.body.email);
  if (!user) {
    res.send({});
  } else {
    res.send(user);
  }
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const normalizeHeaders = (header) => {
  // return header.trim().toLowerCase();
  const words = header
    .trim()
    .toLowerCase()
    .split(/[\s_-]+/);
  const camelCaseHeader = words.map((word, index) => {
    if (index === 0) {
      return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1); // Capitalize the first letter of each word
  });

  return camelCaseHeader.join('');
};

module.exports = {
  bulkUploadFile,
  createUser,
  getUsers,
  checkUser,
  getUser,
  updateUser,
  deleteUser,
  bulkUploadNonAcademicFile,
};
