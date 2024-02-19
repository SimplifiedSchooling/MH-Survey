const Joi = require('joi');

const getCounts = {
  params: Joi.object().keys({
    masterProjectId: Joi.string().required(),
    surveyId: Joi.string().required(),
    surveyFormId: Joi.string().required(),
  }),
};

const getDivisionList = {
  params: Joi.object().keys({
    masterProjectId: Joi.string().required(),
  }),
};

const getDistrictList = {
  body: Joi.object().keys({
    masterProjectId: Joi.string().required(),
    division: Joi.string().required(),
  }),
};
const getBlockList = {
  body: Joi.object().keys({
    masterProjectId: Joi.string().required(),
    district: Joi.string().required(),
  }),
};

const getLocationCountsValidation = {
  params: Joi.object().keys({
    masterProjectId: Joi.string().required(),
    surveyId: Joi.string().required(),
    surveyFormId: Joi.string().required(),
  }),
  query: Joi.object().keys({
    division: Joi.string().optional().allow(''),
    district: Joi.string().optional().allow(''),
    blockName: Joi.string().optional().allow(''),
  }),
};
module.exports = {
  getCounts,
  getBlockList,
  getDistrictList,
  getDivisionList,
  getLocationCountsValidation,
};
