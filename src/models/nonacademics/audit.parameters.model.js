const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const auditParameterSchema = mongoose.Schema(
  {
    Question: {
      type: String,
      trim: true,
    },
    AllowedResponse: {
      type: String,
      trim: true,
    },
    DisplayOrder: {
      type: Number,
      trim: true,
    },
    EvidenceRequired: {
      type: String,
      trim: true,
    },
    DepartmentCode: {
      type: String,
      trim: true,
      // uppercase: true,
    },
    SubDepartmentCode: {
      type: String,
      trim: true,
      // uppercase: true,
    },
    SubSubDepartmentCode: {
      type: String,
      trim: true,
      // uppercase: true,
    },
    Category: {
      type: String,
      trim: true,
      // uppercase: true,
    },
    SubCategory: {
      type: String,
      trim: true,
      // uppercase: true,
    },
    SubSubCategory: {
      type: String,
      trim: true,
      // uppercase: true,
    },
    OnsiteorOffsite: {
      type: String,
      trim: true,
    },
    roles: [
      {
        _id: false,
        roleCode: {
          type: String,
          trim: true,
        },
        roleDesc: {
          type: String,
          trim: true,
        },
        freq: {
          type: String,
          trim: true,
          // uppercase: true,
        },
        crit: {
          type: String,
          trim: true,
          // uppercase: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
auditParameterSchema.plugin(toJSON);
auditParameterSchema.plugin(paginate);

/**
 * @typedef AuditParameter
 */

const AuditParameter = mongoose.model('AuditParameter', auditParameterSchema);

module.exports = AuditParameter;