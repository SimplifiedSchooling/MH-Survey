const httpStatus = require('http-status');
const moment = require('moment');
const userService = require('./user.service');
const ApiError = require('../../utils/ApiError');
const { NonAcademicUserOTP, NonAcademicsUser } = require('../../models/index');
const { plivoClient } = require('../../config/plivo');
const { plivoVar } = require('../../config/config');
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  try {
    const foundUser = await userService.getUserByEmail(email);
    if (!foundUser || !(await foundUser.isPasswordMatch(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    const userCopy = { ...foundUser.toObject() };
    const user = {
      role: userCopy.role,
      roleAssingedTo: userCopy.uniqueRoleCode,
      name: userCopy.username,
      email: userCopy.email,
      mobNumber: userCopy.contact,
      uniqRoleName: userCopy.uniqueRoleName,
      centreCode: userCopy.centreCode,
      level: userCopy.level,
      cluster: userCopy.cluster,
      id: userCopy._id
    }
    return user;
  } catch (err) {
    throw new Error(`Login failed: ${err.message}`);
  }
};

const loginWithNumber = async ({ mobNumber }) => {
  try {
    const record = await NonAcademicsUser.findOne({ contact: mobNumber });
    if(record) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const storeObj = {
        mobNumber,
        otp
      };
      const src = plivoVar.smsHeader;
      const dst = `+91${mobNumber}`;
      const text = `${otp} is your OTP for verification on Hubblehox -VIBGYOR`;
      // const url = 'Webhook Endpoint';
      const dlt_entity_id = plivoVar.entityId;
      const dlt_template_id = plivoVar.templateID;
      const dlt_template_category = plivoVar.templateCategory;
      return plivoClient.messages.create({src, dst, text, dlt_entity_id, dlt_template_id ,
        dlt_template_category}).then(async (data) => {
          await NonAcademicUserOTP.updateOne({ mobNumber }, { $set: storeObj }, { upsert: true });
          return { success: true, data: { message: 'OTP sent successfully!!' } };
        }) .catch((err) => {
          return { success: false, data: { message: err.message } };
        });
    } else {
      return { success: false, storeObj: {}, message: 'Number does not exist.' };
    }
  } catch(err) {
    throw new Error(`OTP failed: ${err.message}`);
  }
}

const validateOtp = async ({ mobNumber, otp }) => {
  try {
    const record = await NonAcademicUserOTP.findOne({ mobNumber });
    if (record) {
      const now = moment();
      const updatedAt = moment(record.updatedAt);
      const diff = now.diff(updatedAt, 'minutes');
      if(diff < 6) {
        if(otp === record.otp) {
          await NonAcademicUserOTP.findOneAndDelete({ mobNumber, otp });
          const foundUser = await userService.getUserByMobNumber(mobNumber);
          const userCopy = { ...foundUser.toObject() };
          const user = {
            role: userCopy.role,
            roleAssingedTo: userCopy.uniqueRoleCode,
            name: userCopy.username,
            email: userCopy.email,
            mobNumber: userCopy.contact,
            uniqRoleName: userCopy.uniqueRoleName,
            centreCode: userCopy.centreCode,
            level: userCopy.level,
            cluster: userCopy.cluster,
            id: userCopy._id
          }
          return { success: true, user, timeExceeded: false, message: 'OTP verified successfully' };
        } else {
          return { success: false, user: {}, timeExceeded: false, message: 'Please provide Valid OTP.' };
        }
      } else {
        await NonAcademicUserOTP.findOneAndDelete({ mobNumber, otp });
        return { success: false, user: {}, timeExceeded: true, message: 'OTP has expired.' };
      }
    } else {
      return { success: false, user: {}, timeExceeded: true, message: 'Number does not exist.' };
    }
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

module.exports = {
  loginUserWithEmailAndPassword,
  loginWithNumber,
  validateOtp
};
