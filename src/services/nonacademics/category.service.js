const httpStatus = require('http-status');
const csv = require('csvtojson');
const { Category } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create a Category
 * @param {Object} CategoryBody
 * @returns {Promise<Category>}
 */
const createCategory = async (schoolArray, csvFilePath = null) => {
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
    for (let i = 0; i < jsonArray.length; i += batchSize) {
      const batch = jsonArray.slice(i, i + batchSize);
      // eslint-disable-next-line no-await-in-loop
      await Category.bulkWrite(
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
 * Query for Category
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCategory = async (filter, options) => {
  const Categorys = await Category.paginate(filter, options);
  return Categorys;
};

/**
 * Get Category by id
 * @param {ObjectId} id
 * @returns {Promise<Category>}
 */
const getCategoryById = async (id) => {
  return Category.findById(id);
};

/**
 * Update Category by id
 * @param {ObjectId} categoryId
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 */
const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  Object.assign(category, updateBody);
  await category.save();
  return category;
};

/**
 * Delete Category by id
 * @param {ObjectId} categoryId
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  await category.remove();
  return category;
};

/**
 * Get book by filter
 * @param {ObjectId} CategoryName
 * @returns {Promise<Category>}
 */

const getCategoryByName = async (CategoryName) => {
  return Category.find({ CategoryName });
};

module.exports = {
  createCategory,
  queryCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
  getCategoryByName,
};
