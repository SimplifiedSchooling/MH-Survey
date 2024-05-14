const Joi = require('joi');

const createSurveyQuetions = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    finalSubmit: Joi.boolean().default(false),
    description: Joi.string().required(),
    questions: Joi.array()
      .items(
        Joi.object({
          type: Joi.string().required(),
          name: Joi.string().required(),
          title: Joi.string().required(),
          choices: Joi.array().items(Joi.string()),
          isRequired: Joi.boolean(), // Add this line if 'choices' is optional
          visibleIf: Joi.string().allow(''),
          label: Joi.string(),
          panel: Joi.string(),
        })
      )
      .required(),
    createdById: Joi.string().required(),
  }),
};

const getSurveyQuetions = {
  query: Joi.object().keys({
    title: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSurveyQuetionById = {
  params: Joi.object().keys({
    surveyId: Joi.string(),
  }),
};

const getSurveyQuetionByCreatedById = {
  params: Joi.object().keys({
    createdById: Joi.string(),
  }),
};

const updateSurveyQuetion = {
  params: Joi.object().keys({
    surveyId: Joi.string(),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      finalSubmit: Joi.boolean(),
      description: Joi.string(),
      questions: Joi.array().items(
        Joi.object({
          type: Joi.string().required(),
          name: Joi.string().required(),
          title: Joi.string().required(),
          choices: Joi.array().items(Joi.string()),
          isRequired: Joi.boolean(),
          visibleIf: Joi.string().allow(''),
          label: Joi.string(),
          panel: Joi.string(),
        })
      ),
      createdById: Joi.string(),
    })
    .min(1),
};

const deleteSurveyQuetion = {
  params: Joi.object().keys({
    surveyId: Joi.string(),
  }),
};

module.exports = {
  createSurveyQuetions,
  getSurveyQuetions,
  getSurveyQuetionById,
  updateSurveyQuetion,
  deleteSurveyQuetion,
  getSurveyQuetionByCreatedById,
};
