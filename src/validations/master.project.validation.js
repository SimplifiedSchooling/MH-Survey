const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createNewMasterSurvey = {
  body: Joi.object().keys({
    masterProjectName: Joi.string().required(),
    masterProjectPurpose: Joi.string(),
    masterProjectStartDate: Joi.date(),
    masterProjectEndDate: Joi.date(),
    masterProjectOwnerName: Joi.string(),
    masterProjectOwnerEmailId: Joi.string().email(),
    masterProjectOwnerMoNumber: Joi.number(),
    masterProjectConductBy: Joi.string().allow(''),
    masterProjectRequireAudit: Joi.boolean().default(false),
    masterProjectAuditBy: Joi.string().allow(''),
    masterProjectRequireApproval: Joi.boolean().default(false),
    masterProjectApprovedBy: Joi.string().allow(''),
    auditStartDate: Joi.date().default(null),
    auditEndDate: Joi.date().default(null),
    approvelStartDate: Joi.date().default(null),
    approvelEndDate: Joi.date().default(null),
    finalSubmit: Joi.boolean().default(false),
    projectDetailsSubmit: Joi.boolean().default(false),
    projectStatus: Joi.string().valid('Not-Started', 'Started', 'In-progress', 'Completed').default('Not-Started'),
  }),
};

const getNewSurveys = {
  query: Joi.object().keys({
    masterProjectName: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getNewSurvey = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
  }),
};

const updateNewSurvey = {
  params: Joi.object().keys({
    projectId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      masterProjectName: Joi.string(),
      masterProjectPurpose: Joi.string(),
      masterProjectStartDate: Joi.date(),
      masterProjectEndDate: Joi.date(),
      masterProjectOwnerName: Joi.string(),
      masterProjectOwnerEmailId: Joi.string().email(),
      masterProjectOwnerMoNumber: Joi.number(),
      masterProjectConductBy: Joi.string(),
      masterProjectRequireAudit: Joi.boolean(),
      masterProjectAuditBy: Joi.string(),
      masterProjectRequireApproval: Joi.boolean(),
      masterProjectApprovedBy: Joi.string(),
      auditStartDate: Joi.date(),
      auditEndDate: Joi.date(),
      approvelStartDate: Joi.date(),
      approvelEndDate: Joi.date(),
      finalSubmit: Joi.boolean(),
      projectDetailsSubmit: Joi.boolean(),
      projectStatus: Joi.string().valid('Not-Started', 'Started', 'In-progress', 'Completed'),
    })
    .min(1),
};

const deleteNewSurvey = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
  }),
};

const getSurveysByEmail = {
  params: Joi.object().keys({
    masterProjectOwnerEmailId: Joi.string(),
    masterProjectId: Joi.string(),
  }),
};

module.exports = {
  createNewMasterSurvey,
  getNewSurveys,
  getNewSurvey,
  updateNewSurvey,
  deleteNewSurvey,
  getSurveysByEmail,
};
