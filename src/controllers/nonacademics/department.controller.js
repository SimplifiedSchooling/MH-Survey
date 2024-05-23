const httpStatus = require('http-status');
const { join } = require('path');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const departmentService = require('../../services/nonacademics/department.service');
const ApiError = require('../../utils/ApiError');

const staticFolder = join(__dirname, '../../');
const uploadsFolder = join(staticFolder, 'uploads');

const createDepartment = catchAsync(async (req, res) => {
  try {
    if (req.file) {
      if (req.file.mimetype !== 'text/csv') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV format.');
      }
      const csvFilePath = join(uploadsFolder, req.file.filename);
      await departmentService.createDepartment(null, csvFilePath);
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
};
