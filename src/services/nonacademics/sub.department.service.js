const httpStatus = require('http-status');
const csv = require('csvtojson');
const { SubDepartment } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create a SubDepartment
 * @param {Object} SubDepartmentBody
 * @returns {Promise<SubDepartment>}
 */
const createSubDepartment = async (schoolArray, csvFilePath = null) => {
  try {
    let modifiedSchoolArray = schoolArray;
    if (csvFilePath) {
      modifiedSchoolArray = csvFilePath;
    }

    const batchSize = 1000;
    if (!modifiedSchoolArray || !modifiedSchoolArray.length) {
      throw new Error('Missing array');
    }
    const jsonArray = await csv().fromFile(modifiedSchoolArray);
    // Split the array into batches
    for (let i = 0; i < jsonArray.length; i += batchSize) {
      const batch = jsonArray.slice(i, i + batchSize);
      // eslint-disable-next-line no-await-in-loop
      await SubDepartment.bulkWrite(
        batch.map((doc) => ({
          insertOne: {
            document: doc,
          },
        }))
      );
    }
  } catch (error) {
    throw new Error(`Bulk upload failed: ${error.message}`);
  }
};

/**
 * Query for SubDepartment
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySubDepartment = async (filter, options) => {
  const SubDepartments = await SubDepartment.paginate(filter, options);
  return SubDepartments;
};

/**
 * Get SubDepartment by id
 * @param {ObjectId} id
 * @returns {Promise<SubDepartment>}
 */
const getSubDepartmentById = async (id) => {
  return SubDepartment.findById(id);
};

/**
 * Update subDepartmentId by id
 * @param {ObjectId} subDepartmentId
 * @param {Object} updateBody
 * @returns {Promise<SubDepartment>}
 */
const updateSubDepartmentById = async (subDepartmentId, updateBody) => {
  const subDepartment = await getSubDepartmentById(subDepartmentId);
  if (!subDepartment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubDepartment not found');
  }
  Object.assign(subDepartment, updateBody);
  await subDepartment.save();
  return subDepartment;
};

/**
 * Delete subDepartmentId by id
 * @param {ObjectId} subDepartmentId
 * @returns {Promise<SubDepartment>}
 */
const deleteSubDepartmentById = async (subDepartmentId) => {
  const subDepartment = await getSubDepartmentById(subDepartmentId);
  if (!subDepartment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubDepartment not found');
  }
  await subDepartment.remove();
  return subDepartment;
};

/**
 * Get book by filter
 * @param {ObjectId} SubDepartmentName
 * @returns {Promise<SubDepartment>}
 */

const getSubDepartmentByName = async (SubDepartmentName) => {
  return SubDepartment.find({ SubDepartmentName });
};

module.exports = {
  createSubDepartment,
  querySubDepartment,
  getSubDepartmentById,
  updateSubDepartmentById,
  deleteSubDepartmentById,
  getSubDepartmentByName,
};
