const mongoose = require('mongoose');
const _ = require('lodash');
const { toJSON, paginate } = require('../plugins');

const subDepartmentSchema = mongoose.Schema(
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
      uppercase: true,
      required: true,
      trim: true,
    },
    SubDepartmentDescription: {
      type: String,
      set: (value) => _.startCase(_.toLower(value.replace(/_/g, ' '))),
      required: true,
      trim: true,
    },
    SubDepartmentWeightage: {
      type: Number,
      required: true,
      default: null,
    },
    SubDepartmentDisplayOrder: {
      type: Number,
      required: true,
      default: null,
    },
  },
  { timestamps: true }
);

subDepartmentSchema.plugin(toJSON);
subDepartmentSchema.plugin(paginate);

const SubDepartment = mongoose.model('SubDepartment', subDepartmentSchema);

module.exports = SubDepartment;
