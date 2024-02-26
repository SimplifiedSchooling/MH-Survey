const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSmeFilePath = {
  body: Joi.object().keys({
    questionId: Joi.string().required(),
    questionName: Joi.string(),
    file: Joi.string(),
    surveyId: Joi.string(),
    masterProjectId: Joi.string(),
    udise_sch_code: Joi.string(),
  }),
};

const getSmeFilePaths = {
  query: Joi.object().keys({
    questionName: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSmeFilePath = {
  params: Joi.object().keys({
    questionId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createSmeFilePath,
  getSmeFilePaths,
  getSmeFilePath,
};
