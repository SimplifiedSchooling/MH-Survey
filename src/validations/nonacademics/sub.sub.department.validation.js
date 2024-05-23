const Joi = require('joi');
const { objectId } = require('../custom.validation');

const createdepartment = {
  body: Joi.object().keys({
    departmentCode: Joi.string().required(),
    departmentGroupCode: Joi.string().required(),
    departmentDescription: Joi.string().required(),
  }),
};

const getAlldepartment = {
  query: Joi.object().keys({
    search: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const deleteDepartmentById = {
  params: Joi.object().keys({
    subsubdepartmentId: Joi.string().custom(objectId),
  }),
};

const updatedepartmentbyId = {
  params: Joi.object().keys({
    subsubdepartmentId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      departmentCode: Joi.string(),
      departmentGroupCode: Joi.string(),
      departmentDescription: Joi.string(),
    })
    .min(1),
};
const getdepartmentById = {
  params: Joi.object().keys({
    subsubdepartmentId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createdepartment,
  getAlldepartment,
  updatedepartmentbyId,
  deleteDepartmentById,
  getdepartmentById,
};
