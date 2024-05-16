const httpStatus = require('http-status');
const { User, NonAcademicsUser } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Filter users
 * @param {Object} options
 * @returns {Promise<User>}
 */
const userBulkFilter = (options) => {
  return {
    filter: options.filter || (options.email ? { email: options.email } : {}),
    getFilter() {
      return this.filter;
    },
  };
};

const getUserFilterEmail = async (filter) => {
  const userFilter = userBulkFilter(filter).getFilter();
  if (userFilter) {
    const record = await User.findOne(userFilter).exec();
    return record;
  }
  return { message: 'Missing query params !!!' };
};

/**
 * Create a user in bulk
 * @param {Object} userArray
 * @returns {Promise<User>}
 */

const bulkUploadUsers = async (userArray, csvFilePath = null) => {
  let modifiedUserArray = userArray;
  if (csvFilePath) {
    modifiedUserArray = { users: csvFilePath };
  }
  if (!modifiedUserArray.users || !modifiedUserArray.users.length) return { error: true, message: 'missing array' };

  const records = [];
  const dups = [];

  await Promise.all(
    modifiedUserArray.users.map(async (user) => {
      const studentFound = await getUserFilterEmail({ email: user.email });
      if (studentFound) {
        dups.push(user);
      } else {
        let record = new User(user);
        record = await record.save();
        if (record) {
          records.push(user);
        }
      }
    })
  );

  const duplicates = {
    totalDuplicates: dups.length ? dups.length : 0,
    data: dups.length ? dups : [],
  };
  const nonduplicates = {
    totalNonDuplicates: records.length ? records.length : 0,
    data: records.length ? records : [],
  };
  return { nonduplicates, duplicates };
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Get user by email and check if the user role is surveyadmin
 * @param {string} email
 * @returns {Promise<User|null>} - Returns the user if found and role is surveyadmin, otherwise null
 */
const checkUserByEmailAndRole = async (email) => {
  const user = await User.findOne({ email });

  if (user && user.role === 'surveyadmin') {
    return user;
  }

  return null;
};

/**
 * Check if email is taken and get user role
 * @param {string} email - The user's email
 * @param {string} role - The user's role
 * @returns {Promise<{ isEmailTaken: boolean, isValidRole: boolean, userRole: string|null }>}
 */
const checkEmailAndRole = async (email, role) => {
  const user = await User.findOne({ email });

  if (user) {
    return { isEmailTaken: true, isValidRole: user.role === role, userRole: user.role };
  }

  return { isEmailTaken: false, isValidRole: false, userRole: null };
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};
const getUsersByEmails = async (emails) => {
  if (!Array.isArray(emails)) {
    return { message: 'Invalid input. "emails" must be an array.' };
  }
  const users = await User.find({ email: { $in: emails } });
  return users;
};

/**
 * Create a user in bulk
 * @param {Object} userArray
 * @returns {Promise<NonAcademicsUser>}
 */

const bulkUploadNonAcademicUsers = async (userArray, csvFilePath = []) => {
  let modifiedUserArray = userArray;
  if (csvFilePath.length) {
    modifiedUserArray = csvFilePath ;
  }
  if (!modifiedUserArray || !modifiedUserArray.length) return { error: true, message: 'missing array' };

  const records = [];
  const dups = [];
  await Promise.all(
    modifiedUserArray.map(async (user) => {
      const studentFound = await getUserFilterEmail({ email: user.email });
      if (studentFound) {
        dups.push(user);
      } else {
        let record = new NonAcademicsUser(user);
        record = await record.save();
        if (record) {
          records.push(user);
        }
      }
    })
  );

  const duplicates = {
    totalDuplicates: dups.length ? dups.length : 0,
    data: dups.length ? dups : [],
  };
  const nonduplicates = {
    totalNonDuplicates: records.length ? records.length : 0,
    data: records.length ? records : [],
  };
  return { nonduplicates, duplicates };
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  bulkUploadUsers,
  checkEmailAndRole,
  checkUserByEmailAndRole,
  getUsersByEmails,
  bulkUploadNonAcademicUsers
};
