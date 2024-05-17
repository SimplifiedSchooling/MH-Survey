const mongoose = require('mongoose');
const _ = require('lodash');
const { toJSON, paginate } = require('../plugins');

const subCategorySchema = mongoose.Schema(
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
      set: (value) => _.startCase(_.toLower(value.replace(/_/g, ' '))),
      required: true,
      trim: true,
    },
    SubCategoryCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    SubCategoryDescription: {
      type: String,
      set: (value) => _.startCase(_.toLower(value.replace(/_/g, ' '))),
      required: true,
      trim: true,
    },
    SubCategoryWeightage: {
      type: Number,
      required: true,
      trim: true,
    },
    SubCategoryDisplayOrder: {
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
subCategorySchema.plugin(toJSON);
subCategorySchema.plugin(paginate);

/**
 * @typedef SubCategory
 */

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

module.exports = SubCategory;
