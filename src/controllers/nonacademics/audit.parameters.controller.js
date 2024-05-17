const httpStatus = require('http-status');
// eslint-disable-next-line import/no-extraneous-dependencies
const { join } = require('path');
const xlsxFile = require('read-excel-file/node');
const { AuditParameter } = require('../../models');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const auditParameterService = require('../../services/nonacademics/audit.parameters.service');
const ApiError = require('../../utils/ApiError');

// const uploadsFolder = join(staticFolder, 'uploads');

const createAuditParameter = catchAsync(async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }
    const filePath = req.file.path;
    const sheetName = 'Sheet1'; // Use the available sheet name
    const rows = await xlsxFile(filePath, { sheet: sheetName });

    const auditParams = [];
    for (let i = 3; i < rows.length; i++) {
      const auditParam = {};
      let add = false;
      for (let j = 12; j < rows[0].length; j += 2) {
        const freq = rows[i][j];
        if (freq != null) {
          auditParam.QuestionNumber = rows[i][0];
          auditParam.Question = rows[i][1];
          auditParam.AllowedResponse = rows[i][2];
          auditParam.DisplayOrder = rows[i][3];
          auditParam.EvidenceRequired = rows[i][4];
          auditParam.DepartmentCode = rows[i][5];
          auditParam.SubDepartmentCode = rows[i][6];
          auditParam.SubSubDepartmentCode = rows[i][7];
          auditParam.Category = rows[i][8];
          auditParam.SubCategory = rows[i][9];
          auditParam.SubSubCategory = rows[i][10];
          auditParam.OnsiteorOffsite = rows[i][11];
          const crit = rows[i][j + 1];
          const roleCode = rows[0][j];
          const roleDesc = rows[1][j];
          const role = {
            crit,
            freq,
            roleCode,
            roleDesc,
          };
          auditParam.roles = auditParam.roles || [];
          auditParam.roles.push(role);
          add = true;
        }
      }
      if (add) {
        auditParams.push(auditParam);
      }
    }
    for(const auditParam of auditParams) {
      await AuditParameter.updateOne({ QuestionNumber: auditParam.QuestionNumber }, { $set: auditParam }, { upsert: true });
    }
    res.status(200).json({ message: 'Excel file data processed successfully', auditParams: [] });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
});

const buildFilter = (search) => {
  const filter = {};
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

const getQuestionsByRoleCode = catchAsync(async (req, res) => {
  const { roleCode, freq, DepartmentCode, SubDepartmentCode, SubSubDepartmentCode } = req.query;
  const questions = await auditParameterService.getQuestionsByRoleCode(
    roleCode,
    freq,
    DepartmentCode,
    SubDepartmentCode,
    SubSubDepartmentCode
  );
  res.status(httpStatus.OK).json(questions);
});

const getDepartmentByRoleCode = catchAsync(async (req, res) => {
  const { roleCode } = req.query;
  const questions = await auditParameterService.getDepartmentByRoleCode(roleCode);
  res.status(httpStatus.OK).json(questions);
});

const filterDataByParameters = catchAsync(async (req, res) => {
  const { roleCode, ...filters } = req.body;
  const filteredData = await auditParameterService.filterDataByParameters(roleCode, filters);
  res.json(filteredData);
});

module.exports = {
  createAuditParameter,
  getAllAuditParameter,
  getAuditParameterById,
  updateAuditParameterById,
  deleteistrictById,
  getQuestionsByRoleCode,
  getDepartmentByRoleCode,
  filterDataByParameters,
};
