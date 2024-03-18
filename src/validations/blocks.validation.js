const Joi = require('joi');
const { objectId } = require('./custom.validation');

const blockShema = Joi.object({
  district_cd: Joi.number().required(),
  block_cd_1: Joi.number().required(),
  block_cd_2: Joi.number().required(),
  Block_Name: Joi.string().required(),
  Division: Joi.string().required(),
  block: Joi.string().required(),
  Budget_block_seq: Joi.number().required(),
});

const getAllblocks = {
  query: Joi.object().keys({
    search: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getblock = {
  params: Joi.object().keys({
    blockId: Joi.string().custom(objectId),
  }),
};

const updateblock = {
  params: Joi.object().keys({
    blockId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      district_cd: Joi.number(),
      block_cd_1: Joi.number(),
      block_cd_2: Joi.number(),
      Block_Name: Joi.string(),
      Division: Joi.string(),
      block: Joi.string(),
      Budget_block_seq: Joi.number(),
    })
    .min(1),
};

const deleteblock = {
  params: Joi.object().keys({
    blockId: Joi.string().custom(objectId),
  }),
};

const getblockByDistricts = {
  params: Joi.object().keys({
    District: Joi.string(),
  }),
};
module.exports = {
  getblockByDistricts,
  deleteblock,
  updateblock,
  getblock,
  blockShema,
  getAllblocks,
};
