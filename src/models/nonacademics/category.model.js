const mongoose = require('mongoose');
const _ = require('lodash');
const { toJSON, paginate } = require('../plugins');

const categorySchema = mongoose.Schema(
  {
    DepartmentCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    SubDepartmentCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    SubSubDepartmentCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    CategoryCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    CategoryDescription: {
      type: String,
      // set: (value) => _.startCase(_.toLower(value.replace(/_/g, ' '))),
      required: true,
      trim: true,
    },
    CategoryWeightage: {
      type: String,
      required: true,
      trim: true,
    },
    CategoryDisplayOrder: {
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
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

/**
 * @typedef Category
 */

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
