const httpStatus = require('http-status');
// eslint-disable-next-line import/no-extraneous-dependencies

const { join } = require('path');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const auditParameterService = require('../../services/nonacademics/audit.parameters.service');
const ApiError = require('../../utils/ApiError');

const staticFolder = join(__dirname, '../../');
const uploadsFolder = join(staticFolder, 'uploads');

const createAuditParameter = catchAsync(async (req, res) => {
  try {
    if (req.file) {
      if (req.file.mimetype !== 'text/csv') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV format.');
      }
      const csvFilePath = join(uploadsFolder, req.file.filename);
      await auditParameterService.createAuditParameter(null, csvFilePath);

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
      { SubSubDepartmentCode: { $regex: new RegExp(search, 'i') } },
      { SubDepartmentCode: { $regex: new RegExp(search, 'i') } },
      { CategoryCode: { $regex: new RegExp(search, 'i') } },
      { SubCategoryCode: { $regex: new RegExp(search, 'i') } },
    ];
  }

  return filter;
};

const getAllAuditParameter = catchAsync(async (req, res) => {
  const { search } = req.query;
  const query = await buildFilter(search);
  const filter = query || {};
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await auditParameterService.queryAuditParameter(filter, options);
  res.send(result);
});

const getAuditParameterById = catchAsync(async (req, res) => {
  const singleAuditParameter = await auditParameterService.getAuditParameterById(req.params.auditParameterId);
  if (!singleAuditParameter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'AuditParameter not found');
  }
  res.send(singleAuditParameter);
});

const updateAuditParameterById = catchAsync(async (req, res) => {
  const updateAuditParameter = await auditParameterService.updateAuditParameterById(req.params.auditParameterId, req.body);
  res.send(updateAuditParameter);
});

const deleteistrictById = catchAsync(async (req, res) => {
  const deleteAuditParameter = await auditParameterService.deleteAuditParameterById(req.params.auditParameterId);
  res.status(httpStatus.NO_CONTENT).send(deleteAuditParameter);
});

module.exports = {
  createAuditParameter,
  getAllAuditParameter,
  getAuditParameterById,
  updateAuditParameterById,
  deleteistrictById,
};
