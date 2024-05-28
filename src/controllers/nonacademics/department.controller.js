const httpStatus = require('http-status');
const { join } = require('path');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const departmentService = require('../../services/nonacademics/department.service');
const subDepartmentService = require('../../services/nonacademics/sub.department.service');
const subSubDepartmentService = require('../../services/nonacademics/sub.sub.department.service');
const catagoryService = require('../../services/nonacademics/category.service');
const subCategoryService = require('../../services/nonacademics/sub.category.service');
const ApiError = require('../../utils/ApiError');
const { SubCategory } = require('../../models');

const staticFolder = join(__dirname, '../../');
const uploadsFolder = join(staticFolder, 'uploads');

const createDepartment = catchAsync(async (req, res) => {
  try {
    if (req.file) {
      if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in xlsx format.');
      }
      const xlsxFilePath = join(uploadsFolder, req.file.filename);
      const data = await departmentService.createDepartment(xlsxFilePath);
      if(!data.status) {
        res.status(400).send({ message: data.message });
      }
      res.status(httpStatus.CREATED).send({ message: 'Data uploaded successfully.' });
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
});

const createAllHierarchy = catchAsync(async (req, res) => {
  try {
    if (req.file) {
      if (req.file.mimetype != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in xlsx format.');
      }
      const xlsxFilePath = join(uploadsFolder, req.file.filename);
      const promises = [];
      promises.push(departmentService.createDepartment(xlsxFilePath));
      promises.push(subDepartmentService.createSubDepartment(xlsxFilePath));
      promises.push(subSubDepartmentService.createSubSubDepartment(xlsxFilePath));
      promises.push(catagoryService.createCategory(xlsxFilePath));
      promises.push(subCategoryService.createSubCategory(xlsxFilePath));
      const wrappedPromises = promises.map(promise => promise.catch(error => ({ error })));
      const results = await Promise.all(wrappedPromises);
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        // Iterate over errors to throw a dynamic ApiError
        for (const err of errors) {
          if (err.error.includes('Bulk upload failed')) {
            throw new ApiError(httpStatus.BAD_REQUEST, err.error);
          } else {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.error);
          }
        }
      }
      res.status(httpStatus.CREATED).send({ message: 'Data uploaded successfully.' });
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
});

const buildFilter = (search) => {
  const filter = {};

  // Construct the filter based on the search query
  if (search) {
    filter.$or = [
      { DepartmentCode: { $regex: new RegExp(search, 'i') } },
      { DepartmentGroupCode: { $regex: new RegExp(search, 'i') } },
      { DepartmentDescription: { $regex: new RegExp(search, 'i') } },
    ];
  }

  return filter;
};

const getAllDepartment = catchAsync(async (req, res) => {
  const { search } = req.query;
  const query = await buildFilter(search);
  const filter = query || {};
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await departmentService.queryDepartment(filter, options);
  res.send(result);
});

const getDepartmentById = catchAsync(async (req, res) => {
  const singleDepartment = await departmentService.getDepartmentById(req.params.departmentid);
  if (!singleDepartment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Department not found');
  }
  res.send(singleDepartment);
});

const updateDepartmentById = catchAsync(async (req, res) => {
  const updateDepartment = await departmentService.updateDepartmentById(req.params.departmentid, req.body);
  res.send(updateDepartment);
});

const deleteistrictById = catchAsync(async (req, res) => {
  const deleteDepartment = await departmentService.deleteDepartmentById(req.params.departmentid);
  res.status(httpStatus.NO_CONTENT).send(deleteDepartment);
});

module.exports = {
  createDepartment,
  getAllDepartment,
  getDepartmentById,
  updateDepartmentById,
  deleteistrictById,
  createAllHierarchy
};
