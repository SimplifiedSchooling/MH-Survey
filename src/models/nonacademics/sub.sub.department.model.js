const mongoose = require('mongoose');
const _ = require('lodash');
const { toJSON, paginate } = require('../plugins');

const subSubDepartmentSchema = mongoose.Schema(
  {
    DepartmentCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    DepartmentDescription: {
      type: String,
      set: (value) => _.startCase(_.toLower(value.replace(/_/g, ' '))),
      required: true,
      trim: true,
    },
    SubDepartmentCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    SubDepartmentDescription: {
      type: String,
      set: (value) => _.startCase(_.toLower(value.replace(/_/g, ' '))),
      required: true,
      trim: true,
    },
    SubSubDepartmentCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    SubSubDepartmentDescription: {
      type: String,
      required: true,
      trim: true,
      set: (value) => _.startCase(_.toLower(value.replace(/_/g, ' '))),
    },
    SubSubDepartmentWeightage: {
      type: Number,
      required: true,
      trim: true,
    },
    SubSubDepartmentDisplayOrder: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
subSubDepartmentSchema.plugin(toJSON);
subSubDepartmentSchema.plugin(paginate);

/**
 * @typedef SubSubDepartment
 */

const SubSubDepartment = mongoose.model('SubSubDepartment', subSubDepartmentSchema);

module.exports = SubSubDepartment;
