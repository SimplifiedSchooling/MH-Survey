const httpStatus = require('http-status');
const userService = require('./user.service');
const ApiError = require('../../utils/ApiError');

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

module.exports = {
  loginUserWithEmailAndPassword,
};
