const httpStatus = require('http-status');
const { Districts } = require('../models');
const ApiError = require('../utils/ApiError');

const bulkUpload = async (schoolArray, csvFilePath = null) => {
  let modifiedSchoolArray = schoolArray;
  if (csvFilePath) {
    modifiedSchoolArray = csvFilePath;
  }

  if (!modifiedSchoolArray || !modifiedSchoolArray.length) {
    throw new Error('Missing array');
  }

  const promises = modifiedSchoolArray.map(async (district) => {
    const schoolFound = await Districts.findOne({
      district_cd: district.district_cd,
    });
    if (schoolFound) {
      return { duplicate: true, data: district };
    }

    let data = new Districts(district);
    // eslint-disable-next-line no-unused-vars
    data = await data.save();

    return { duplicate: false, data: district };
  });
  const results = await Promise.all(promises);

  const duplicates = {
    totalDuplicates: results.filter((result) => result.duplicate).length,
    data: results.filter((result) => result.duplicate),
  };

  const nonDuplicates = {
    totalNonDuplicates: results.filter((result) => !result.duplicate).length,
    data: results.filter((result) => !result.duplicate),
  };

  return {
    duplicates,
    nonDuplicates,
  };
};

/**
 * Create a District
 * @param {Object} DistrictBody
 * @returns {Promise<Districts>}
 */
const createDistrict = async (DistrictBody) => {
  return Districts.create(DistrictBody);
};

/**
 * Query for District
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDistrict = async (filter, options) => {
  const districts = await Districts.paginate(filter, options);
  return districts;
};

/**
 * Get District by id
 * @param {ObjectId} id
 * @returns {Promise<Districts>}
 */
const getDistrictById = async (id) => {
  return Districts.findById(id);
};

/**
 * Update District by id
 * @param {ObjectId} districtId
 * @param {Object} updateBody
 * @returns {Promise<Districts>}
 */
const updateDistrictById = async (districtId, updateBody) => {
  const district = await getDistrictById(districtId);
  if (!district) {
    throw new ApiError(httpStatus.NOT_FOUND, 'District not found');
  }
  Object.assign(district, updateBody);
  await district.save();
  return district;
};

/**
 * Delete District by id
 * @param {ObjectId} districtId
 * @returns {Promise<Districts>}
 */
const deleteDistrictById = async (districtId) => {
  const district = await getDistrictById(districtId);
  if (!district) {
    throw new ApiError(httpStatus.NOT_FOUND, 'District not found');
  }
  await district.remove();
  return district;
};

/**
 * Get book by filter
 * @param {ObjectId} Division
 * @returns {Promise<Districts>}
 */

const getDistrictByName = async (Division) => {
  return Districts.find({ Division });
};

module.exports = {
  createDistrict,
  bulkUpload,
  queryDistrict,
  getDistrictById,
  updateDistrictById,
  deleteDistrictById,
  getDistrictByName,
};
