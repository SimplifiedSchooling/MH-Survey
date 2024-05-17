const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('../plugins');
// const { roles } = require('../config/roles');

const nonAcademicUserSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    uniqueRoleCode: {
      type: String,
    },
    uniqueRoleName: {
      type: String,
    },
    username: {
      type: String,
      // required: true,
      trim: true,
    },
    email: {
      type: String,
      // required: true,
      unique: true,
      trim: true,
      lowercase: true,
      // validate(value) {
      //   if (!validator.isEmail(value)) {
      //     // throw new Error('Invalid email ==> ', value);
      //     return false;
      //   }
      // },
    },
    contact: {
      type: String,
    },
    designation: {
      type: String,
    },
    level: {
      type: String,
    },
    function: {
      type: String,
    },
    centreCode: {
      type: String,
    },
    centreName: {
      type: String,
    },
    cluster: {
      type: String,
    },
    password: {
      type: String,
      // required: true,
      trim: true,
      minlength: 8,
      // validate(value) {
      //   if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
      //     // throw new Error('Password must contain at least one letter and one number');
      //     return false;
      //   }
      // },
      private: true, // used by the toJSON plugin
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
nonAcademicUserSchema.plugin(toJSON);
nonAcademicUserSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */

nonAcademicUserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
nonAcademicUserSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

nonAcademicUserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef NonAcademicUser
 */
const NonAcademicUser = mongoose.model('NonAcademicUser', nonAcademicUserSchema);

module.exports = NonAcademicUser;
