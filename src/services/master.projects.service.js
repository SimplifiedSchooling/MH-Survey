const httpStatus = require('http-status');
const { NewSurvey, MasterProject } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Master Survey Project with Sub Surveys
 * @param {Object} masterProjectData - Data for Master Project
 * @param {Array} subSurveyData - Data for Sub Survey Projects
 * @returns {Promise<{ masterProject: MasterProject, subSurveys: NewSurvey[] }>}
 */
const createMasterSurveyProject = async (masterProjectData, subSurveyData) => {
  function generateRandomString(length, characters) {
    let result = '';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  const randomLetters = generateRandomString(4, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'); // generate 4 random letters
  const randomDigits = generateRandomString(4, '0123456789'); // generate 4 random digits
  const masterProjectId = `${randomLetters}${randomDigits}`;
  const reqBody = {
    ...masterProjectData,
    masterProjectId,
  };

  const masterProject = await MasterProject.create(reqBody);
  const subSurveys = subSurveyData.map((subSurvey) => {
    const surveyName = subSurvey.surveyName.replace(/\s+/g, '').toUpperCase();
    const randomNumbers = Math.floor(100 + Math.random() * 900); // generate random 3-digit number
    const surveyId = `${surveyName.slice(0, 3)}${randomNumbers}`;

    const newSubSurvey = new NewSurvey({
      ...subSurvey,
      surveyId,
      masterProjectId,
      masterProjectOwnerEmailId: masterProject.masterProjectOwnerEmailId,
    });
    return newSubSurvey.save();
  });

  const createdSubSurveys = await Promise.all(subSurveys);
  return { masterProject, subSurveys: createdSubSurveys };
};

/**
 * Query for NewSurvey
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMasterSurvey = async (filter, options) => {
  const masterProjects = await MasterProject.paginate(filter, options);
  return masterProjects;
};

/**
 * Get MasterProject by id
 * @param {ObjectId} id
 * @returns {Promise<MasterProject>}
 */
const getMasterProjectById = async (id) => {
  return MasterProject.findById(id);
};

/**
 * Update MasterProject by id
 * @param {ObjectId} masterProjectId
 * @param {Object} updateBody
 * @returns {Promise<MasterProject>}
 */
const updateMasterProjectById = async (masterProjectId, updateBody) => {
  const masterProject = await getMasterProjectById(masterProjectId);
  if (!masterProject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'MasterProject not found');
  }
  Object.assign(masterProject, updateBody);
  await masterProject.save();
  return masterProject;
};

/**
 * Delete MasterProject by id
 * @param {ObjectId} projectId
 * @returns {Promise<MasterProject>}
 */
const deleteMasterProjectById = async (projectId) => {
  const masterProject = await getMasterProjectById(projectId);
  if (!masterProject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'MasterProject not found');
  }
  await masterProject.remove();
  return masterProject;
};

/**
 * Get MasterProject by filter
 * @param {ObjectId} masterProjectOwnerEmailId
 * @returns {Promise<MasterProject>}
 */

const getMasterProjectByEmail = async (masterProjectOwnerEmailId) => {
  return MasterProject.find({ masterProjectOwnerEmailId, finalSubmit: true });
};

module.exports = {
  createMasterSurveyProject,
  queryMasterSurvey,
  getMasterProjectById,
  updateMasterProjectById,
  deleteMasterProjectById,
  getMasterProjectByEmail,
};
