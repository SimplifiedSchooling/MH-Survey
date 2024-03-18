const Joi = require('joi');
const { objectId } = require('./custom.validation');

const districtShema = Joi.object({
  district_cd: Joi.number().required(),
  Division: Joi.string().required(),
  District: Joi.string().required(),
  Budget_district_seq: Joi.number().required(),
});

const getAllDistricts = {
  query: Joi.object().keys({
    search: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
const getDistrict = {
  params: Joi.object().keys({
    districtId: Joi.string().custom(objectId),
  }),
};

const updateDistrict = {
  params: Joi.object().keys({
    districtId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      district_cd: Joi.number().required(),
      Division: Joi.string().required(),
      District: Joi.string().required(),
      Budget_district_seq: Joi.number().required(),
    })
    .min(1),
};

const deleteDistrict = {
  params: Joi.object().keys({
    districtId: Joi.string().custom(objectId),
  }),
};

const getDistrictByDivision = {
  params: Joi.object().keys({
    Division: Joi.string(),
  }),
};
module.exports = {
  getDistrictByDivision,
  deleteDistrict,
  updateDistrict,
  getDistrict,
  districtShema,
  getAllDistricts,
};
