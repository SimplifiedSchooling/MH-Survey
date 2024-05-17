const mongoose = require('mongoose');
const _ = require('lodash');
const { toJSON, paginate } = require('../plugins');

const departmentSchema = mongoose.Schema(
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
    DepartmentWeightage: {
      type: Number,
      required: true,
      default: null,
    },
  },
  { timestamps: true }
);

departmentSchema.plugin(toJSON);
departmentSchema.plugin(paginate);

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;
