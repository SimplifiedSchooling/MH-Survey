const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createDivision = {
  body: Joi.object().keys({
    divisionName: Joi.string().required(),
    divisionCode: Joi.number(),
  }),
};

const getDivisions = {
  query: Joi.object().keys({
    divisionName: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getDivision = {
  params: Joi.object().keys({
    divisionId: Joi.string().custom(objectId),
  }),
};

const updateDivision = {
  params: Joi.object().keys({
    divisionId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      divisionName: Joi.string(),
    })
    .min(1),
};

const deleteDivision = {
  params: Joi.object().keys({
    divisionId: Joi.string().custom(objectId),
  }),
};

const getDivisionByName = {
  params: Joi.object().keys({
    divisionName: Joi.string(),
  }),
};
module.exports = {
  createDivision,
  getDivisions,
  getDivision,
  updateDivision,
  deleteDivision,
  getDivisionByName,
};
