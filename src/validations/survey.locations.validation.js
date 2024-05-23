const Joi = require('joi');

const bulkUploadValidationSchema = {
  masterProjectName: Joi.string().required(),
  masterProjectId: Joi.string(),
  masterProjectPurpose: Joi.string().required(),
  masterProjectStartDate: Joi.date().required(),
  masterProjectEndDate: Joi.date().required(),
  masterProjectOwnerName: Joi.string().required(),
  masterProjectOwnerEmailId: Joi.string().required(),
  masterProjectOwnerMoNumber: Joi.number().required(),
  masterProjectConductBy: Joi.string(),
  masterProjectRequireAudit: Joi.string(),
  masterProjectAuditBy: Joi.string(),
  masterProjectRequireApproval: Joi.string(),
  masterProjectApprovedBy: Joi.string(),
  auditStartDate: Joi.date(),
  auditEndDate: Joi.date(),
  approvelStartDate: Joi.date(),
  approvelEndDate: Joi.date(),
  file: Joi.string(),
};
const getAllSurveyLocatins = {
  query: Joi.object().keys({
    surveyId: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
const getSchoolDataBySurveyId = {
  params: Joi.object().keys({
    masterProjectId: Joi.string(),
  }),
};

module.exports = {
  bulkUploadValidationSchema,
  getAllSurveyLocatins,
  getSchoolDataBySurveyId,
};
