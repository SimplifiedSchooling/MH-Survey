const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('../plugins');
// const { roles } = require('../config/roles');

const nonAcademicUserSchema = mongoose.Schema(
  {
    UserID: {
        type: String,
        trim: true
    },
    UniqueRoleCode: {
        type: String,
    },
    UniqueRoleName: {
        type: String,
    },
    UserName: {
        type: String,
        required: true,
        trim: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
        //   if (!validator.isEmail(value)) {
        //     throw new Error('Invalid email ==> ', value);
        //   }
        },
    },
    Contact: {
        type: String
    },
    Designation: {
        type: String
    },
    Level: {
        type: String
    },
    Function: {
        type: String
    },
    CentreCode: {
        type: String
    },
    CentreName: {
        type: String
    },
    Cluster: {
        type: String
    },
    Password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
          if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
            throw new Error('Password must contain at least one letter and one number');
          }
        },
        private: true, // used by the toJSON plugin
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
nonAcademicUserSchema.plugin(toJSON);
nonAcademicUserSchema.plugin(paginate);


nonAcademicUserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} Password
 * @returns {Promise<boolean>}
 */
nonAcademicUserSchema.methods.isPasswordMatch = async function (Password) {
  const user = this;
  return bcrypt.compare(Password, user.Password);
};

nonAcademicUserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('Password')) {
    user.Password = await bcrypt.hash(user.Password, 8);
  }
  next();
});

/**
 * @typedef NonAcademicUser
 */
const NonAcademicUser = mongoose.model('NonAcademicUser', nonAcademicUserSchema);

module.exports = NonAcademicUser;
