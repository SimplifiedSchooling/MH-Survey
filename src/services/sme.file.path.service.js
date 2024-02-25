const { FilePath } = require('../models');

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

module.exports = {
  createFilePath,
  queryFilePath,
  getFilePathById,
};
