const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const freqEnum = ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'];
const critEnum = ['HIGH', 'MEDIUM', 'LOW'];

const auditParameterSchema = mongoose.Schema(
  {
    Question: {
      type: String,
      trim: true,
    },
    AllowedResponse: {
      type: String,
      trim: true,
      uppercase: true,
    },
    DisplayOrder: {
      type: Number,
      trim: true,
    },
    EvidenceRequired: {
      type: String,
      trim: true,
      uppercase: true,
    },
    DepartmentCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    SubDepartmentCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    SubSubDepartmentCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    Category: {
      type: String,
      trim: true,
      uppercase: true,
    },
    SubCategory: {
      type: String,
      trim: true,
      uppercase: true,
    },
    SubSubCategory: {
      type: String,
      trim: true,
      uppercase: true,
    },
    OnsiteorOffsite: {
      type: String,
      trim: true,
      uppercase: true,
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
          uppercase: true,
          validate: {
            validator: function(value) {
              return freqEnum.includes(value);
            },
            message: 'Invalid frequency value',
          },
        },
        crit: {
          type: String,
          trim: true,
          uppercase: true,
          validate: {
            validator: function(value) {
              return critEnum.includes(value);
            },
            message: 'Invalid crit value',
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add plugin that converts mongoose to JSON
auditParameterSchema.plugin(toJSON);
auditParameterSchema.plugin(paginate);

/**
 * @typedef AuditParameter
 */
const AuditParameter = mongoose.model('AuditParameter', auditParameterSchema);
module.exports = AuditParameter;