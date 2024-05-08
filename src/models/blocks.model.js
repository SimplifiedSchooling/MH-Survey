/* eslint-disable object-shorthand */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const blockSchema = new mongoose.Schema({
  district_cd: {
    type: Number,
    required: true,
  },
  Division: {
    type: String,
  },
  District: {
    type: String,
  },
  Budget_district_seq: {
    type: Number,
    required: true,
  },
  Block_Name: {
    type: String,
    //unique: true,
  },
  block_cd_1: {
    type: Number,
    required: true,
  },
  block_cd_2: {
    type: Number,
    required: true,
  },
});

// add plugin that converts mongoose to json
blockSchema.plugin(toJSON);
blockSchema.plugin(paginate);

const Block = mongoose.model('Block', blockSchema);

module.exports = Block;
