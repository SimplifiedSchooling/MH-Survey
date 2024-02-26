const { SMEFilePath } = require('../models');

/**
 * Create a sme file Path
 * @param {Object} filePathnBody
 * @returns {Promise<SMEFilePath>}
 */
const createFilePath = async (filePathnBody) => {
  return SMEFilePath.create(filePathnBody);
};

/**
 * Query for sme file Path
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryFilePath = async (filter, options) => {
  const filePath = await SMEFilePath.paginate(filter, options);
  return filePath;
};

/**
 * Get sme file path by questionId
 * @param {ObjectId} questionId
 * @returns {Promise<SMEFilePath>}
 */
const getFilePathById = async (questionId) => {
  return SMEFilePath.find(questionId);
};

module.exports = {
  createFilePath,
  queryFilePath,
  getFilePathById,
};
