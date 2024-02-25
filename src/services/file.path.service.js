const httpStatus = require('http-status');
const { FilePath } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a FilePath
 * @param {Object} filePathnBody
 * @returns {Promise<FilePath>}
 */
const createFilePath = async (filePathnBody) => {
  return FilePath.create(filePathnBody);
};

/**
 * Query for file Path
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryFilePath = async (filter, options) => {
  const filePath = await FilePath.paginate(filter, options);
  return filePath;
};

/**
 * Get filepath by questionId
 * @param {ObjectId} questionId
 * @returns {Promise<FilePath>}
 */
const getFilePathById = async (questionId) => {
  return FilePath.find(questionId);
};

/**
 * Update File path by questionId
 * @param {ObjectId} questionId
 * @param {Object} updateBody
 * @returns {Promise<FilePath>}
 */
const updateFilePathById = async (questionId, updateBody) => {
  const filePath = await getFilePathById(questionId);
  if (!filePath) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File path not found');
  }
  Object.assign(filePath, updateBody);
  await filePath.save();
  return filePath;
};

/**
 * Delete file path by questionId
 * @param {ObjectId} questionId
 * @returns {Promise<Division>}
 */
const deleteFilePathById = async (questionId) => {
  const filePath = await getFilePathById(questionId);
  if (!filePath) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File path not found');
  }
  await filePath.remove();
  return filePath;
};

// /**
//  * Delete file path by id
//  * @param {ObjectId} questionId
//  * @returns {Promise<FilePath>}
//  */
// const deleteQuestionPathById = async (questionId, questionNameToDelete, filePath) => {
//   const path = await FilePath.findByIdAndUpdate(
//     questionId,
//     { $pull: { uploadedFiles: { questionName: questionNameToDelete, filePath } } },
//     { new: true }
//   );
//   if (!path) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'File path not found');
//   }
//   return path;
// };

module.exports = {
  createFilePath,
  queryFilePath,
  getFilePathById,
  updateFilePathById,
  deleteFilePathById,
};
