const httpStatus = require('http-status');
const { NewSurvey, SurveyAnswers, SurveyLocation } = require('../models');
const ApiError = require('../utils/ApiError');

const updateActualDatesForSurvey = async (masterProjectId, surveyId, surveyFormId) => {
  // Find the corresponding survey
  const survey = await NewSurvey.findOne({ masterProjectId, surveyId });
  if (!survey) {
    throw new Error('Survey not found');
  }
  const surveyLocation = await SurveyLocation.findOne({ masterProjectId });
  const udiseCodes = surveyLocation.surveyLocations.map((location) => location.udise_sch_code);

  // Find the first survey answer for any of the udise_sch_code
  const firstSurveyAnswer = await SurveyAnswers.findOne({
    masterProjectId,
    surveyId,
    surveyFormId,
    udise_sch_code: { $in: udiseCodes },
  }).sort({ createdAt: 1 });
  // Find the last survey answer for any of the udise_sch_code
  const lastSurveyAnswer = await SurveyAnswers.findOne({
    masterProjectId,
    surveyId,
    surveyFormId,
    udise_sch_code: { $in: udiseCodes },
  }).sort({ createdAt: -1 });
  // Update actualStartDate if there is a first survey answer
  if (firstSurveyAnswer) {
    survey.actualStartDate = firstSurveyAnswer.createdAt;
  }

  // Update actualEndDate if there is a last survey answer
  if (lastSurveyAnswer) {
    survey.actualEndDate = lastSurveyAnswer.createdAt;
  }

  // Save the changes to the database
  await survey.save();
};

/**
 * Create a NewSurvey
 * @param {Object} NewSurveyBody
 * @returns {Promise<NewSurvey>}
 */
const createNewSurvey = async (NewSurveyBody) => {
  const surveyName = NewSurveyBody.surveyName.replace(/\s+/g, '').toUpperCase();
  const randomNumbers = Math.floor(100 + Math.random() * 900); // generate random 3-digit number
  const surveyId = `${surveyName.slice(0, 3)}${randomNumbers}`;
  const reqBody = {
    ...NewSurveyBody,
    surveyId,
  };
  return NewSurvey.create(reqBody);
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
const queryNewSurvey = async (filter, options) => {
  const newSurveys = await NewSurvey.paginate(filter, options);
  return newSurveys;
};

/**
 * Get NewSurvey by id
 * @param {ObjectId} id
 * @returns {Promise<NewSurvey>}
 */
const getNewSurveyById = async (id) => {
  return NewSurvey.findById(id);
};

/**
 * Update NewSurvey by id
 * @param {ObjectId} newSurveyId
 * @param {Object} updateBody
 * @returns {Promise<NewSurvey>}
 */
const updateNewSurveyById = async (newSurveyId, updateBody) => {
  const newSurvey = await getNewSurveyById(newSurveyId);
  if (!newSurvey) {
    throw new ApiError(httpStatus.NOT_FOUND, 'NewSurvey not found');
  }
  Object.assign(newSurvey, updateBody);
  await newSurvey.save();
  return newSurvey;
};

/**
 * Delete NewSurvey by id
 * @param {ObjectId} newSurveyId
 * @returns {Promise<NewSurvey>}
 */
const deleteNewSurveyById = async (newSurveyId) => {
  const newSurvey = await getNewSurveyById(newSurveyId);
  if (!newSurvey) {
    throw new ApiError(httpStatus.NOT_FOUND, 'NewSurvey not found');
  }
  await newSurvey.remove();
  return newSurvey;
};

/**
 * Get book by filter
 * @param {ObjectId} surveyOwnerEmailId
 * @returns {Promise<NewSurvey>}
 */

const getSurveyByEmailAndProjectId = async (masterProjectOwnerEmailId, masterProjectId) => {
  return NewSurvey.find({ masterProjectOwnerEmailId, masterProjectId });
};

module.exports = {
  createNewSurvey,
  queryNewSurvey,
  getNewSurveyById,
  updateNewSurveyById,
  deleteNewSurveyById,
  getSurveyByEmailAndProjectId,
  updateActualDatesForSurvey,
};
