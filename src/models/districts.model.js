/* eslint-disable object-shorthand */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const districtSchema = new mongoose.Schema({
  district_cd: {
    type: Number,
    required: true,
  },
  Division: {
    type: String,
  },
  District: {
    type: String,
    unique: true,
  },
  Budget_district_seq: {
    type: Number,
    required: true,
  },
});

// add plugin that converts mongoose to json
districtSchema.plugin(toJSON);
districtSchema.plugin(paginate);

const District = mongoose.model('District', districtSchema);

module.exports = District;
