const { join } = require('path');
const csv = require('csvtojson');
const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const userService = require('../../services/nonacademics/user.service');

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

const bulkUploadUserRoleFile = catchAsync(async (req, res) => {
  if (req.file) {
    const csvFilePath = join(req.file.path);
    const csvJsonArray = await csv().fromFile(csvFilePath);
    const jsonArray = [];
    for (const csvData of csvJsonArray) {
      const normalizedData = {};
      for (const key in csvData) {
        normalizedData[normalizeHeaders(key)] = csvData[key];
      }
      jsonArray.push(normalizedData);
    }
    const user = await userService.bulkUploadNonAcademicUserRoles(null, jsonArray);
    res.status(httpStatus.CREATED).send(user);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
  }
});

const getUserRoleInfo = catchAsync(async (req, res) => {
  const getUserDetails = await userService.findUserRoleDetail(req.query.uniqRoleCode, req.query.centreCode);
  if (!getUserDetails) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Details Found.');
  }
  res.send(getUserDetails);
});

module.exports = {
  bulkUploadUserRoleFile,
  getUserRoleInfo,
};
