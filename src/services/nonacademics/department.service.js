const httpStatus = require('http-status');
const csv = require('csvtojson');
const xlsx = require('xlsx');
const { Department } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create a Department
 * @param {Object} DepartmentBody
 * @returns {Promise<boolean>}
 */
const createDepartment = async (xlsxFilePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      const workbook = xlsx.readFile(xlsxFilePath);
      const sheetName = 'Department';
      if (!workbook.SheetNames.includes(sheetName)) {
        reject(`Bulk upload failed: Sheet ${sheetName} not found.`);
      }
      const index = workbook.SheetNames.indexOf(sheetName);
      const sheet = workbook.SheetNames[index];
      const jsonArray = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);
      const batchSize = 1000;
      // Split the array into batches
      for (let i = 0; i < jsonArray.length; i += batchSize) {
        const batch = jsonArray.slice(i, i + batchSize);
        // eslint-disable-next-line no-await-in-loop
        await Department.bulkWrite(
          batch.map((doc) => ({
            updateOne: {
              filter: { DepartmentCode: doc.DepartmentCode },
              update: { $set: doc },
              upsert: true,
            },
          }))
        );
      }
      resolve(true);
    } catch (error) {
      reject(`Bulk upload failed: ${error.message}`);
    }

  })
};

/**
 * Query for Department
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDepartment = async (filter, options) => {
  const Departments = await Department.paginate(filter, options);
  return Departments;
};

/**
 * Get Department by id
 * @param {ObjectId} id
 * @returns {Promise<Department>}
 */
const getDepartmentById = async (id) => {
  return Department.findById(id);
};

/**
 * Update Department by id
 * @param {ObjectId} DepartmentId
 * @param {Object} updateBody
 * @returns {Promise<Department>}
 */
const updateDepartmentById = async (departmentId, updateBody) => {
  const department = await getDepartmentById(departmentId);
  if (!department) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Department not found');
  }
  Object.assign(department, updateBody);
  await department.save();
  return department;
};

/**
 * Delete Department by id
 * @param {ObjectId} departmentId
 * @returns {Promise<Department>}
 */
const deleteDepartmentById = async (departmentId) => {
  const department = await getDepartmentById(departmentId);
  if (!department) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Department not found');
  }
  await department.remove();
  return department;
};

/**
 * Get book by filter
 * @param {ObjectId} DepartmentName
 * @returns {Promise<Department>}
 */

const getDepartmentByName = async (DepartmentName) => {
  return Department.find({ DepartmentName });
};

module.exports = {
  createDepartment,
  queryDepartment,
  getDepartmentById,
  updateDepartmentById,
  deleteDepartmentById,
  getDepartmentByName,
};
