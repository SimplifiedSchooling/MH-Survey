const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const AuditAnswerService = require('../../services/nonacademics/audit.answer.service');
const ApiError = require('../../utils/ApiError');

const createAuditAnswer = catchAsync(async (req, res) => {
  const auditAnswer = await AuditAnswerService.createAuditAnswer(req.body);
  res.status(httpStatus.CREATED).send(auditAnswer);
});

const createOrUpdateAuditAnswer = catchAsync(async (req, res) => {
  console.log("level",req.body)
  const { schoolId, deptCode, subDeptCode, subSubDeptCode, frequency, roleCode,level, finalSubmit, userId, answers } = req.body;
  const filter = { schoolId, deptCode, subDeptCode, subSubDeptCode, frequency, roleCode,level, userId };
  const data = { schoolId, deptCode, subDeptCode, subSubDeptCode, frequency, roleCode, level,finalSubmit, userId, answers };
  console.log("data",data,"filter",filter)
  const auditAnswer = await AuditAnswerService.createOrUpdateAuditAnswer(filter, data);
  res.status(httpStatus.OK).json(auditAnswer);
});

const buildFilter = (search) => {
  const filter = {};
  if (search) {
    filter.$or = [
      { deptCode: { $regex: new RegExp(search, 'i') } },
      { subDeptCode: { $regex: new RegExp(search, 'i') } },
      { subSubDeptCode: { $regex: new RegExp(search, 'i') } },
      { category: { $regex: new RegExp(search, 'i') } },
      { subCategory: { $regex: new RegExp(search, 'i') } },
      { SubSubCategory: { $regex: new RegExp(search, 'i') } },
    ];
  }
  return filter;
};

const getAllAuditAnswer = catchAsync(async (req, res) => {
  const { search } = req.query;
  const query = await buildFilter(search);
  const filter = query || {};
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await AuditAnswerService.queryAuditAnswer(filter, options);
  res.send(result);
});

const getAuditAnswerById = catchAsync(async (req, res) => {
  const singleAuditAnswer = await AuditAnswerService.getAuditAnswerById(req.params.auditAnswerId);
  if (!singleAuditAnswer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'AuditAnswer not found');
  }
  res.send(singleAuditAnswer);
});

const updateAuditAnswerById = catchAsync(async (req, res) => {
  const updateAuditAnswer = await AuditAnswerService.updateAuditAnswerById(req.params.auditAnswerId, req.body);
  res.send(updateAuditAnswer);
});

const deleteistrictById = catchAsync(async (req, res) => {
  const deleteAuditAnswer = await AuditAnswerService.deleteAuditAnswerById(req.params.auditAnswerId);
  res.status(httpStatus.NO_CONTENT).send(deleteAuditAnswer);
});

const getAuditAnswers = catchAsync(async (req, res) => {
  const { departmentCode, subDepartmentCode, subSubDepartmentCode, frequency, level, userId, schoolId } = req.body;
  // roleCode
  const filters = { departmentCode, subDepartmentCode, subSubDepartmentCode, frequency, level, userId, schoolId };
  const groupedAnswers = await AuditAnswerService.getAuditAnswersByFilters(filters);
  res.status(httpStatus.OK).send(groupedAnswers);
});

const updateAnswerProperty = async (req, res) => {
  try {
    const { filter, filter2, propertyToUpdate, newValue } = req.body;
    const updatedAuditAnswer = await AuditAnswerService.updateAnswerProperty(filter, filter2, propertyToUpdate, newValue);
    res.status(httpStatus.OK).json(updatedAuditAnswer);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

module.exports = {
  createAuditAnswer,
  getAllAuditAnswer,
  getAuditAnswerById,
  updateAuditAnswerById,
  deleteistrictById,
  createOrUpdateAuditAnswer,
  getAuditAnswers,
  updateAnswerProperty,
};
