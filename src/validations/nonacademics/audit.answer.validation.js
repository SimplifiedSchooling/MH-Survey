const Joi = require('joi');
const { objectId } = require('../custom.validation');

const getAuditAnswers = {
  body: Joi.object({
    departmentCode: Joi.string().required(),
    subDepartmentCode: Joi.string().required(),
    subSubDepartmentCode: Joi.string().required(),
    frequency: Joi.string().required(),
    schoolId: Joi.string().required(),
    roleCode: Joi.string().required(),
    userId: Joi.required().custom(objectId),
  }),
};

module.exports = {
  getAuditAnswers,
};
