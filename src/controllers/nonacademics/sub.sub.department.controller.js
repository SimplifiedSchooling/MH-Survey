const httpStatus = require('http-status');
const { join } = require('path');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const SubSubDepartmentService = require('../../services/nonacademics/sub.sub.department.service');
const ApiError = require('../../utils/ApiError');

const staticFolder = join(__dirname, '../../');
const uploadsFolder = join(staticFolder, 'uploads');

const createSubSubDepartment = catchAsync(async (req, res) => {
  try {
    if (req.file) {
      if (req.file.mimetype !== 'text/csv') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV format.');
      }

      const csvFilePath = join(uploadsFolder, req.file.filename);

      await SubSubDepartmentService.createSubSubDepartment(null, csvFilePath);

      res.status(httpStatus.CREATED).send({ message: 'Data uploaded successfully.' });
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
});

// const createSubSubDepartment = catchAsync(async (req, res) => {
//   const SubSubDepartment = await SubSubDepartmentService.createSubSubDepartment(req.body);
//   res.status(httpStatus.CREATED).send(SubSubDepartment);
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
      { SubSubDepartmentCode: { $regex: new RegExp(search, 'i') } },
      { SubSubDepartmentDescription: { $regex: new RegExp(search, 'i') } },
    ];
  }

  return filter;
};

const getAllSubSubDepartment = catchAsync(async (req, res) => {
  const { search } = req.query;
  const query = await buildFilter(search);
  const filter = query || {};
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const getAllSubSubDepartments = await SubSubDepartmentService.querySubSubDepartment(filter, options);
  res.send(getAllSubSubDepartments);
});

const getSubSubDepartmentById = catchAsync(async (req, res) => {
  const singleSubSubDepartment = await SubSubDepartmentService.getSubSubDepartmentById(req.params.subSubDepartmentId);
  if (!singleSubSubDepartment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubSubDepartment not found');
  }
  res.send(singleSubSubDepartment);
});

const updateSubSubDepartmentById = catchAsync(async (req, res) => {
  const updateSubSubDepartment = await SubSubDepartmentService.updateSubSubDepartmentById(
    req.params.subSubDepartmentId,
    req.body
  );
  res.send(updateSubSubDepartment);
});

const deleteistrictById = catchAsync(async (req, res) => {
  const deleteSubSubDepartment = await SubSubDepartmentService.deleteSubSubDepartmentById(req.params.subSubDepartmentId);
  res.status(httpStatus.NO_CONTENT).send(deleteSubSubDepartment);
});

module.exports = {
  createSubSubDepartment,
  getAllSubSubDepartment,
  getSubSubDepartmentById,
  updateSubSubDepartmentById,
  deleteistrictById,
};
