const httpStatus = require('http-status');
const { Division } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Division
 * @param {Object} DivisionBody
 * @returns {Promise<Division>}
 */
const createDivision = async (DivisionBody) => {
  return Division.create(DivisionBody);
};

/**
 * Query for Division
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDivision = async (filter, options) => {
  const Divisions = await Division.paginate(filter, options);
  return Divisions;
};

/**
 * Get Division by id
 * @param {ObjectId} id
 * @returns {Promise<Division>}
 */
const getDivisionById = async (id) => {
  return Division.findById(id);
};

/**
 * Update Division by id
 * @param {ObjectId} divisionId
 * @param {Object} updateBody
 * @returns {Promise<Division>}
 */
const updateDivisionById = async (divisionId, updateBody) => {
  const division = await getDivisionById(divisionId);
  if (!division) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Division not found');
  }
  Object.assign(division, updateBody);
  await division.save();
  return division;
};

/**
 * Delete Division by id
 * @param {ObjectId} divisionId
 * @returns {Promise<Division>}
 */
const deleteDivisionById = async (divisionId) => {
  const division = await getDivisionById(divisionId);
  if (!division) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Division not found');
  }
  await division.remove();
  return division;
};

/**
 * Get book by filter
 * @param {ObjectId} divisionName
 * @returns {Promise<Division>}
 */

const getDivisionByName = async (divisionName) => {
  return Division.find({ divisionName });
};

module.exports = {
  createDivision,
  queryDivision,
  getDivisionById,
  updateDivisionById,
  deleteDivisionById,
  getDivisionByName,
};
