const mongoose = require('mongoose');
const _ = require('lodash');
const { toJSON, paginate } = require('../plugins');

const freqEnum = ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY'];
const critEnum = ['HIGH', 'MEDIUM', 'LOW'];

const auditParameterSchema = mongoose.Schema(
  {
    Question: {
      type: String,
      trim: true,
      required: true,
    },
    AllowedResponse: {
      type: String,
      trim: true,
      required: true,
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
      required: true,
      uppercase: true,
    },
    SubDepartmentCode: {
      type: String,
      trim: true,
      required: true,
      uppercase: true,
    },
    SubSubDepartmentCode: {
      type: String,
      trim: true,
      required: true,
      uppercase: true,
    },
    Category: {
      type: String,
      trim: true,
      required: true,
      set: (value) => _.startCase(_.toLower(value.replace(/_/g, ' '))),
    },
    SubCategory: {
      type: String,
      trim: true,
      required: true,
      set: (value) => _.startCase(_.toLower(value.replace(/_/g, ' '))),
    },
    SubSubCategory: {
      type: String,
      trim: true,
      set: (value) => _.startCase(_.toLower(value.replace(/_/g, ' '))),
    },
    OnsiteorOffsite: {
      type: String,
      trim: true,
      required: true,
      set: (value) => _.startCase(_.toLower(value.replace(/_/g, ' '))),
    },
    roles: [
      {
        roleCode: {
          type: String,
          trim: true,
          required: true,
        },
        roleDesc: {
          type: String,
          trim: true,
        },
        freq: {
          type: String,
          trim: true,
          validate: {
            validator: function(value) {
              return freqEnum.includes(value.toUpperCase());
            },
            message: 'Invalid frequency value',
          },
          set: (value) => (freqEnum.includes(value.toUpperCase()) ? value.toUpperCase() : ''),
        },
        crit: {
          type: String,
          trim: true,
          validate: {
            validator: function(value) {
              return critEnum.includes(value.toUpperCase());
            },
            message: 'Invalid crit value',
          },
          set: (value) => (critEnum.includes(value.toUpperCase()) ? value.toUpperCase() : ''),
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
