const Joi = require('joi');
const { objectId } = require('./custom.validation');

const assignCoordinatorsValidation = {
  body: Joi.object({
    masterProjectId: Joi.string().required(),
    surveyAdmin: Joi.string().required().custom(objectId),
    blockCoordinatorEmails: Joi.array().items(Joi.string().email()),
    districtCoordinatorEmails: Joi.array().items(Joi.string().email()),
    divisionCoordinatorEmails: Joi.array().items(Joi.string().email()),
    smeEmails: Joi.array().items(Joi.string().email()),
  }),
};

const getAllCoordinators = {
  query: Joi.object().keys({
    masterProjectId: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAssignment = {
  params: Joi.object().keys({
    assignmentId: Joi.string().custom(objectId),
  }),
};

const getAssignmentBySurveyId = {
  params: Joi.object().keys({
    masterProjectId: Joi.string(),
  }),
};

const getUsersBySurveyIdValidation = {
  masterProjectId: Joi.string(),
};

const updateAssignment = {
  params: Joi.object().keys({
    surveyId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      surveyId: Joi.string().required(),
      surveyAdmin: Joi.string().required().custom(objectId),
      blockCoordinatorEmails: Joi.array().items(Joi.string().email()),
      districtCoordinatorEmails: Joi.array().items(Joi.string().email()),
      divisionCoordinatorEmails: Joi.array().items(Joi.string().email()),
      smeEmails: Joi.array().items(Joi.string().email()),
    })
    .min(1),
};

const deleteAssignment = {
  params: Joi.object().keys({
    assignmentId: Joi.string().custom(objectId),
  }),
};

const bulkUploadValidationSchema = {
  masterProjectId: Joi.string().required(),
  surveyAdmin: Joi.string(),
  emailType: Joi.string()
    .valid('blockCoordinatorEmails', 'districtCoordinatorEmails', 'divisionCoordinatorEmails', 'smeEmails')
    .required(),
};

const getProjectsList = {
  body: Joi.object({
    email: Joi.string().required(),
    role: Joi.string().valid('block', 'district', 'division', 'SME').required(),
  }),
};

module.exports = {
  assignCoordinatorsValidation,
  getAllCoordinators,
  deleteAssignment,
  updateAssignment,
  getAssignment,
  bulkUploadValidationSchema,
  getAssignmentBySurveyId,
  getUsersBySurveyIdValidation,
  getProjectsList,
};
