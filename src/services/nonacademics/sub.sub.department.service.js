const httpStatus = require('http-status');
const csv = require('csvtojson');
const { SubSubDepartment } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create a SubSubDepartment
 * @param {Object} SubSubDepartmentBody
 * @returns {Promise<SubSubDepartment>}
 */
const createSubSubDepartment = async (schoolArray, csvFilePath = null) => {
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

      // Use bulk write for efficient insertion
      // eslint-disable-next-line no-await-in-loop
      await SubSubDepartment.bulkWrite(
        batch.map((doc) => ({
          insertOne: {
            document: doc,
          },
        }))
      );
    }
  } catch (error) {
    // Handle any other errors
    throw new Error(`Bulk upload failed: ${error.message}`);
  }
};
// const createSubSubDepartment = async (SubSubDepartmentBody) => {
//   return SubSubDepartment.create(SubSubDepartmentBody);
// };

/**
 * Query for SubSubDepartment
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySubSubDepartment = async (filter, options) => {
  const SubSubDepartments = await SubSubDepartment.paginate(filter, options);
  return SubSubDepartments;
};

/**
 * Get SubSubDepartment by id
 * @param {ObjectId} id
 * @returns {Promise<SubSubDepartment>}
 */
const getSubSubDepartmentById = async (id) => {
  return SubSubDepartment.findById(id);
};

/**
 * Update subSubDepartmentId by id
 * @param {ObjectId} subSubDepartmentId
 * @param {Object} updateBody
 * @returns {Promise<SubSubDepartment>}
 */
const updateSubSubDepartmentById = async (subSubDepartmentId, updateBody) => {
  const subSubDepartment = await getSubSubDepartmentById(subSubDepartmentId);
  if (!subSubDepartment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubSubDepartment not found');
  }
  Object.assign(subSubDepartment, updateBody);
  await subSubDepartment.save();
  return subSubDepartment;
};

/**
 * Delete subSubDepartmentId by id
 * @param {ObjectId} SubSubDepartmentId
 * @returns {Promise<SubSubDepartment>}
 */
const deleteSubSubDepartmentById = async (SubSubDepartmentId) => {
  const SubSubDepartment = await getSubSubDepartmentById(SubSubDepartmentId);
  if (!SubSubDepartment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubSubDepartment not found');
  }
  await SubSubDepartment.remove();
  return SubSubDepartment;
};

/**
 * Get book by filter
 * @param {ObjectId} SubSubDepartmentName
 * @returns {Promise<SubSubDepartment>}
 */

const getSubSubDepartmentByName = async (SubSubDepartmentName) => {
  return SubSubDepartment.find({ SubSubDepartmentName });
};

module.exports = {
  createSubSubDepartment,
  querySubSubDepartment,
  getSubSubDepartmentById,
  updateSubSubDepartmentById,
  deleteSubSubDepartmentById,
  getSubSubDepartmentByName,
};
