const httpStatus = require('http-status');
const csv = require('csvtojson');
const { SubCategory } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create a SubCategory
 * @param {Object} SubCategoryBody
 * @returns {Promise<SubCategory>}
 */
const createSubCategory = async (schoolArray, csvFilePath = null) => {
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
      await SubCategory.bulkWrite(
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
// const createSubCategory = async (SubCategoryBody) => {
//   return SubCategory.create(SubCategoryBody);
// };

/**
 * Query for SubCategory
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySubCategory = async (filter, options) => {
  const SubCategorys = await SubCategory.paginate(filter, options);
  return SubCategorys;
};

/**
 * Get SubCategory by id
 * @param {ObjectId} id
 * @returns {Promise<SubCategory>}
 */
const getSubCategoryById = async (id) => {
  return SubCategory.findById(id);
};

/**
 * Update SubCategory by id
 * @param {ObjectId} subCategoryId
 * @param {Object} updateBody
 * @returns {Promise<SubCategory>}
 */
const updateSubCategoryById = async (subCategoryId, updateBody) => {
  const subCategory = await getSubCategoryById(subCategoryId);
  if (!subCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubCategory not found');
  }
  Object.assign(subCategory, updateBody);
  await subCategory.save();
  return subCategory;
};

/**
 * Delete SubCategory by id
 * @param {ObjectId} subCategoryId
 * @returns {Promise<SubCategory>}
 */
const deleteSubCategoryById = async (subCategoryId) => {
  const subCategory = await getSubCategoryById(subCategoryId);
  if (!subCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubCategory not found');
  }
  await subCategory.remove();
  return subCategory;
};

/**
 * Get book by filter
 * @param {ObjectId} SubCategoryName
 * @returns {Promise<SubCategory>}
 */

const getSubCategoryByName = async (SubCategoryName) => {
  return SubCategory.find({ SubCategoryName });
};

module.exports = {
  createSubCategory,
  querySubCategory,
  getSubCategoryById,
  updateSubCategoryById,
  deleteSubCategoryById,
  getSubCategoryByName,
};
