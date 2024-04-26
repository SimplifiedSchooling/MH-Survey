const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const departmentSchema = mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
departmentSchema.plugin(toJSON);
departmentSchema.plugin(paginate);

/**
 * @typedef Department
 */

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;
