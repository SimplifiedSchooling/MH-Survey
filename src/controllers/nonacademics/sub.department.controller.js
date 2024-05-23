const httpStatus = require('http-status');
const { join } = require('path');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const SubDepartmentService = require('../../services/nonacademics/sub.department.service');
const ApiError = require('../../utils/ApiError');

const staticFolder = join(__dirname, '../../');
const uploadsFolder = join(staticFolder, 'uploads');

const createSubDepartment = catchAsync(async (req, res) => {
  try {
    if (req.file) {
      if (req.file.mimetype !== 'text/csv') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV format.');
      }

      const csvFilePath = join(uploadsFolder, req.file.filename);

      await SubDepartmentService.createSubDepartment(null, csvFilePath);

      res.status(httpStatus.CREATED).send({ message: 'Data uploaded successfully.' });
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
});
// const createSubDepartment = catchAsync(async (req, res) => {
//   const SubDepartment = await SubDepartmentService.createSubDepartment(req.body);
//   res.status(httpStatus.CREATED).send(SubDepartment);
// });
const buildFilter = (search) => {
  const filter = {};

  // Construct the filter based on the search query
  if (search) {
    filter.$or = [
      { DepartmentCode: { $regex: new RegExp(search, 'i') } },
      { DepartmentGroupCode: { $regex: new RegExp(search, 'i') } },
      { DepartmentDescription: { $regex: new RegExp(search, 'i') } },
      { SubDepartmentCode: { $regex: new RegExp(search, 'i') } },
      { SubDepartmentDescription: { $regex: new RegExp(search, 'i') } },
    ];
  }

  return filter;
};
const getAllSubDepartment = catchAsync(async (req, res) => {
  const { search } = req.query;
  const query = await buildFilter(search);
  const filter = query || {};
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const getAllSubDepartments = await SubDepartmentService.querySubDepartment(filter, options);
  res.send(getAllSubDepartments);
});

const getSubDepartmentById = catchAsync(async (req, res) => {
  const singleSubDepartment = await SubDepartmentService.getSubDepartmentById(req.params.subdepartmentid);
  if (!singleSubDepartment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubDepartment not found');
  }
  res.send(singleSubDepartment);
});

const updateSubDepartmentById = catchAsync(async (req, res) => {
  const updateSubDepartment = await SubDepartmentService.updateSubDepartmentById(req.params.subdepartmentid, req.body);
  res.send(updateSubDepartment);
});

const deleteistrictById = catchAsync(async (req, res) => {
  const deleteSubDepartment = await SubDepartmentService.deleteSubDepartmentById(req.params.subdepartmentid);
  res.status(httpStatus.NO_CONTENT).send(deleteSubDepartment);
});

module.exports = {
  createSubDepartment,
  getAllSubDepartment,
  getSubDepartmentById,
  updateSubDepartmentById,
  deleteistrictById,
};
