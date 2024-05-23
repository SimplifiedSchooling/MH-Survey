const Joi = require('joi');

const districtOfficerAnswerValidation = {
  body: Joi.object().keys({
    surveyId: Joi.string(),
    masterProjectId: Joi.string(),
    udise_sch_code: Joi.number(),
    surveyFormId: Joi.string(),
    surveyConductEmail: Joi.string(),
    auditConductEmail: Joi.string(),
    remark: Joi.string(),
    status: Joi.string(),
    Latitude: Joi.string().allow(''),
    Longitude: Joi.string().allow(''),
  }),
};

const getSurveyAnswers = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSurveyAnswerById = {
  params: Joi.object().keys({
    answerId: Joi.string(),
  }),
};

const updateSurveyAnswer = {
  params: Joi.object().keys({
    answerId: Joi.string(),
  }),
  body: Joi.object()
    .keys({
      surveyQuetions: Joi.array().items(
        Joi.object({
          quetion: Joi.string(),
          answer: Joi.array(),
        })
      ),
      surveyId: Joi.string(),
      masterProjectId: Joi.string(),
      surveyFormId: Joi.string(),
      surveyConductEmail: Joi.string(),
    })
    .min(1),
};

const deleteSurveyAnswer = {
  params: Joi.object().keys({
    answerId: Joi.string(),
  }),
};

const filterSurveyAnswer = {
  params: Joi.object().keys({
    surveyId: Joi.string().required(),
    masterProjectId: Joi.string().required(),
    surveyFormId: Joi.string().required(),
    udise_sch_code: Joi.number().required(),
  }),
};

module.exports = {
  districtOfficerAnswerValidation,
  getSurveyAnswers,
  getSurveyAnswerById,
  updateSurveyAnswer,
  deleteSurveyAnswer,
  filterSurveyAnswer,
};
