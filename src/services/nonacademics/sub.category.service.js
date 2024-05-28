const httpStatus = require('http-status');
const csv = require('csvtojson');
const xlsx = require('xlsx');
const { SubCategory } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create a SubCategory
 * @param {Object} SubCategoryBody
 * @returns {Promise<SubCategory>}
 */
const createSubCategory = async (xlsxFilePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      const workbook = xlsx.readFile(xlsxFilePath);
      const sheetName = 'SubCategory';
      if (!workbook.SheetNames.includes(sheetName)) {
        reject(`Bulk upload failed: Sheet ${sheetName} not found.`)
      }
      const index = workbook.SheetNames.indexOf(sheetName);
      const sheet = workbook.SheetNames[index];
      const jsonArray = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);
      const batchSize = 1000;
      for (let i = 0; i < jsonArray.length; i += batchSize) {
        const batch = jsonArray.slice(i, i + batchSize);
  
        // Use bulk write for efficient insertion
        // eslint-disable-next-line no-await-in-loop
        await SubCategory.bulkWrite(
          batch.map((doc) => ({
            updateOne: {
              filter: { DepartmentCode: doc.DepartmentCode, SubDepartmentCode: doc.SubDepartmentCode, SubSubDepartmentCode: doc.SubSubDepartmentCode, CategoryCode: doc.CategoryCode, SubCategoryCode: doc.SubCategoryCode },
              update: { $set: doc },
              upsert: true
            },
          }))
        );
      }
      resolve(true);
    } catch (error) {
      // Handle any other errors
     reject(`Bulk upload failed: ${error.message}`);
    }
  })
};

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
