const csv = require('csv-parser');
const httpStatus = require('http-status');
const fs = require('fs');
const ApiError = require('../utils/ApiError');
const { CoordinatorAssignment, User, MasterProject } = require('../models');

const userBulkFilter = (options) => {
  return {
    filter: options.filter || (options.email ? { email: options.email, role: options.role } : {}),
    getFilter() {
      return this.filter;
    },
  };
};

const getUserFilterEmailAndRole = async (filter) => {
  const userFilter = userBulkFilter(filter).getFilter();
  if (userFilter) {
    const record = await User.findOne(userFilter).exec();
    return record;
  }
  return null;
};

const bulkUpload = async (file, masterProjectId, surveyAdmin, emailType) => {
  const validEmailTypes = ['blockCoordinatorEmails', 'districtCoordinatorEmails', 'divisionCoordinatorEmails', 'smeEmails'];

  if (!validEmailTypes.includes(emailType)) {
    throw new Error('Invalid emailType');
  }

  let role;

  // Set role based on emailType
  switch (emailType) {
    case 'blockCoordinatorEmails':
      role = 'block';
      break;
    case 'districtCoordinatorEmails':
      role = 'district';
      break;
    case 'divisionCoordinatorEmails':
      role = 'division';
      break;
    case 'smeEmails':
      role = 'SME';
      break;
    default:
      throw new Error('Invalid emailType');
  }

  const users = [];

  // Read CSV file and extract email and other user data
  await new Promise((resolve, reject) => {
    /* eslint-disable-next-line security/detect-non-literal-fs-filename */
    fs.createReadStream(file.path)
      .pipe(csv())
      .on('data', (row) => {
        const { email } = row;
        if (email) {
          users.push({ email, role });
        }
      })
      .on('end', () => {
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });

  if (!users.length) {
    throw new Error('No valid users found in the CSV file');
  }

  const records = [];
  const dups = [];

  await Promise.all(
    users.map(async (user) => {
      const userFound = await getUserFilterEmailAndRole(user);
      if (userFound) {
        records.push(user);
      } else {
        dups.push(user);
      }
    })
  );

  if (dups.length) {
    return { duplicates: { totalDuplicates: dups.length, data: dups } };
  }

  const existingAssignment = await CoordinatorAssignment.findOne({ masterProjectId }).exec();

  if (existingAssignment) {
    const newEmails = records.map((user) => user.email);

    // Check for duplicates in existing assignment
    const duplicatesInAssignment = newEmails.filter((email) => existingAssignment[emailType].includes(email));

    if (duplicatesInAssignment.length > 0) {
      return {
        duplicates: {
          totalDuplicates: duplicatesInAssignment.length,
          data: duplicatesInAssignment,
        },
      };
    }

    // Update existing assignment with new emails
    existingAssignment[emailType] = existingAssignment[emailType].concat(newEmails);
    const result = await existingAssignment.save();
    return { result, duplicates: { totalDuplicates: 0, data: [] } };
  }

  // No existing assignment, create a new one
  const newAssignment = new CoordinatorAssignment({
    masterProjectId,
    surveyAdmin,
    [emailType]: records.map((user) => user.email),
  });

  const result = await newAssignment.save();
  return { result, duplicates: { totalDuplicates: 0, data: [] } };
};

/**
 * Query for CoordinatorAssignment
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const getAllCoordinatorAssignments = async (filter, options) => {
  const assignments = await CoordinatorAssignment.paginate(filter, options);
  return assignments;
};

/**
 * Get CoordinatorAssignment by id
 * @param {ObjectId} id
 * @returns {Promise<CoordinatorAssignment>}
 */
const getAssignById = async (id) => {
  return CoordinatorAssignment.findById(id);
};

/**
 * Get CoordinatorAssignment by id
 * @param {String} masterProjectId
 * @returns {Promise<CoordinatorAssignment>}
 */
const getAssignBySurveyId = async (masterProjectId) => {
  return CoordinatorAssignment.find({ masterProjectId });
};

/**
 * Update CoordinatorAssignment by id
 * @param {ObjectId} assignmentId
 * @param {Object} updateBody
 * @returns {Promise<CoordinatorAssignment>}
 */
const updateAssignmentIdById = async (assignmentId, updateBody) => {
  const assignment = await getAssignById(assignmentId);
  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'assignment not found');
  }
  Object.assign(assignment, updateBody);
  await assignment.save();
  return assignment;
};

/**
 * Delete CoordinatorAssignment by id
 * @param {ObjectId} assignmentId
 * @returns {Promise<CoordinatorAssignment>}
 */
const deleteAssignmentById = async (assignmentId) => {
  const assignment = await getAssignById(assignmentId);
  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'assignment not found');
  }
  await assignment.remove();
  return assignment;
};

/**
 * Get users based on email IDs in CoordinatorAssignment arrays
 * @param {string} masterProjectId - Survey ID
 * @returns {Promise<Array>} - Array of user data matching the email IDs
 */
const getUsersBySurveyId = async (masterProjectId) => {
  const coordinatorAssignment = await CoordinatorAssignment.findOne({ masterProjectId });
  if (!coordinatorAssignment) {
    throw new Error('CoordinatorAssignment not found for the given surveyId');
  }

  const emailArrays = ['blockCoordinatorEmails', 'districtCoordinatorEmails', 'divisionCoordinatorEmails', 'smeEmails'];

  const users = [];
  /* eslint-disable */
  for (const emailArray of emailArrays) {
    const emailIds = coordinatorAssignment[emailArray];
    const usersWithEmails = await User.find({ email: { $in: emailIds } });
    users.push({ [emailArray]: usersWithEmails });
  }
  /* eslint-enable */
  return users;
};

/**
 * Get list of projects assigned to the coordinator based on email and role
 * @param {string} email - Email of the coordinator
 * @param {string} role - Role of the coordinator (block, district, division, SME, etc.)
 * @returns {Promise<Array>} - Array of assigned projects
 */

/* eslint-disable global-require */
const getAssignedProjects = async (email, role) => {
  let OfficerModel;
  let coordinatorField;

  switch (role) {
    case 'block':
      OfficerModel = require('../models/blockOfficer.model');
      coordinatorField = 'block_Coordinator_EmailId';
      break;
    case 'district':
      OfficerModel = require('../models/distictOfficer.model');
      coordinatorField = 'district_Coordinator_EmailId';
      break;
    case 'division':
      OfficerModel = require('../models/divisionofficer.model');
      coordinatorField = 'division_Coordinator_EmailId';
      break;
    case 'SME':
      OfficerModel = require('../models/smeofficer.model');
      coordinatorField = 'sme_EmailId';
      break;
    default:
      throw new Error('Invalid role');
  }

  // Fetch data from Officer collection
  const coordinatorAssignments = await OfficerModel.find({ [coordinatorField]: email })
    .select('masterProjectId')
    .exec();

  const masterProjectIds = coordinatorAssignments.map(({ masterProjectId }) => masterProjectId);
  const projects = await MasterProject.find({ masterProjectId: { $in: masterProjectIds } });

  return projects;
};
/* eslint-enable global-require */

module.exports = {
  bulkUpload,
  getAllCoordinatorAssignments,
  deleteAssignmentById,
  updateAssignmentIdById,
  getAssignById,
  getAssignBySurveyId,
  getUsersBySurveyId,
  getAssignedProjects,
};
