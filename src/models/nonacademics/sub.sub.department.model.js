const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const subSubDepartmentSchema = mongoose.Schema(
  {
    DepartmentCode: {
      type: String,
      required: true,
      trim: true,
      default: null,
    },
    DepartmentGroupCode: {
      type: String,
      required: true,
      trim: true,
      default: null,
    },
    DepartmentDescription: {
      type: String,
      required: true,
      trim: true,
      default: null,
    },
    DepartmentWeightage: {
      type: Number,
      required: true,
      trim: true,
      default: null,
    },
    SubDepartmentCode: {
      type: String,
      required: true,
      trim: true,
      default: null,
    },
    SubDepartmentDescription: {
      type: String,
      required: true,
      trim: true,
      default: null,
    },
    SubDepartmentWeightage: {
      type: Number,
      required: true,
      trim: true,
      default: null,
    },
    SubSubDepartmentCode: {
      type: String,
      required: true,
      trim: true,
      default: null,
    },
    SubSubDepartmentDescription: {
      type: String,
      required: true,
      trim: true,
      default: null,
    },
    SubSubDepartmentWeightage: {
      type: Number,
      required: true,
      trim: true,
      default: null,
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
