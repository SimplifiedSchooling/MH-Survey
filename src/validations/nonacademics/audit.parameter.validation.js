const Joi = require('joi');
const { objectId } = require('../custom.validation');

const createAuditParameter = {
  body: Joi.object().keys({
    Question: Joi.string().required(),
    AllowedResponse: Joi.string().required(),
    DisplayOrder: Joi.number().integer().required(),
    EvidenceRequired: Joi.string().required(),
    DepartmentCode: Joi.string().trim().uppercase().required(),
    SubDepartmentCode: Joi.string().trim().uppercase().required(),
    SubSubDepartmentCode: Joi.string().trim().uppercase().required(),
    Category: Joi.string().trim().uppercase().required(),
    SubCategory: Joi.string().trim().uppercase().required(),
    SubSubCategory: Joi.string().trim().uppercase().required(),
    OnsiteorOffsite: Joi.string().required(),
    roles: Joi.array()
      .items(
        Joi.object({
          roleCode: Joi.string().required(),
          roleDesc: Joi.string().required(),
          freq: Joi.string().trim().uppercase().valid('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY').required(),
          crit: Joi.string().trim().uppercase().valid('HIGH', 'MEDIUM', 'LOW').required(),
        })
      )
      .required(),
  }),
};

const getAllAuditParameter = {
  query: Joi.object().keys({
    search: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const deleteAuditParameterById = {
  params: Joi.object().keys({
    auditparameterid: Joi.string().custom(objectId),
  }),
};
const updateAuditParameterById = {
  params: Joi.object().keys({
    auditparameterid: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      Question: Joi.string(),
      AllowedResponse: Joi.string(),
      DisplayOrder: Joi.number().integer(),
      EvidenceRequired: Joi.string(),
      DepartmentCode: Joi.string().trim().uppercase(),
      SubDepartmentCode: Joi.string().trim().uppercase(),
      SubSubDepartmentCode: Joi.string().trim().uppercase(),
      Category: Joi.string().trim().uppercase(),
      SubCategory: Joi.string().trim().uppercase(),
      SubSubCategory: Joi.string().trim().uppercase(),
      OnsiteorOffsite: Joi.string(),
      roles: Joi.array().items(
        Joi.object({
          roleCode: Joi.string(),
          roleDesc: Joi.string(),
          freq: Joi.string().trim().uppercase().valid('DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'),
          crit: Joi.string().trim().uppercase().valid('HIGH', 'MEDIUM', 'LOW'),
        })
      ),
    })
    .min(1),
};

const getAuditParameterById = {
  params: Joi.object().keys({
    auditparameterid: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createAuditParameter,
  getAllAuditParameter,
  updateAuditParameterById,
  deleteAuditParameterById,
  getAuditParameterById,
};
