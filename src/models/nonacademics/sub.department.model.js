const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const subDepartmentSchema = mongoose.Schema(
  {
    DepartmentCode: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    DepartmentGroupCode: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    DepartmentDescription: {
      type: String,
      required: true,
      trim: true,
      default: '',
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
      default: '',
    },
    SubDepartmentDescription: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    SubDepartmentWeightage: {
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
subDepartmentSchema.plugin(toJSON);
subDepartmentSchema.plugin(paginate);

/**
 * @typedef SubDepartment
 */

const SubDepartment = mongoose.model('SubDepartment', subDepartmentSchema);

module.exports = SubDepartment;
