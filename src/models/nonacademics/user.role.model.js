const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('../plugins');
// const { roles } = require('../config/roles');

const nonAcademicUserRoleSchema = mongoose.Schema(
  {
    designation: {
        type: String,
    },
    uniqueRoleCode: {
        type: String,
    },
    erpLongRoleCode: {
        type: String,
    },
    erpShortRoleCode: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
    },
    uniqueRole: {
        type: String,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
nonAcademicUserRoleSchema.plugin(toJSON);
nonAcademicUserRoleSchema.plugin(paginate);

/**
 * @typedef NonAcademicUserRole
 */
const NonAcademicUserRole = mongoose.model('NonAcademicUserRole', nonAcademicUserRoleSchema);

module.exports = NonAcademicUserRole;
