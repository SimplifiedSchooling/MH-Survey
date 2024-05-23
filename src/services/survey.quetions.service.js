const httpStatus = require('http-status');
const { SurveyQuetions } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a survey quetions
 * @param {Object} reqBody
 * @returns {Promise<SurveyQuetions>}
 */
const createSurveyQuetions = async (reqBody) => {
  return SurveyQuetions.create(reqBody);
};

/**
 * Query for survey quetions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySurveyQuetions = async (filter, options) => {
  const results = await SurveyQuetions.paginate(filter, options);
  return results;
};

/**
 * Get survey quetions by id
 * @param {ObjectId} id
 * @returns {Promise<SurveyQuetions>}
 */
const getSurveyQuetionsBySurveyId = async (id) => {
  return SurveyQuetions.findById(id);
};
/**
 * Get survey quetions by createdById
 * @param {ObjectId} createdById
 * @returns {Promise<SurveyQuetions>}
 */
const getSurveyQuetionsBycreatedById = async (createdById) => {
  return SurveyQuetions.find({ createdById });
};

/**
 * Update Survey Quetions by surveyId
 * @param {ObjectId} surveyId
 * @param {Object} updateBody
 * @returns {Promise<SurveyQuetions>}
 */
const updateSurveyQuetionsBysurveyId = async (surveyId, updateBody) => {
  const quetion = await getSurveyQuetionsBySurveyId(surveyId);
  if (!quetion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Survey questions not found');
  }
  Object.assign(quetion, updateBody);
  await quetion.save();
  return quetion;
};

/**
 * Delete Survey Quetions by id
 * @param {ObjectId} surveyId
 * @returns {Promise<SurveyQuetions>}
 */
const deleteSurveyQuetionsBysurveyId = async (surveyId) => {
  const quetion = await getSurveyQuetionsBySurveyId(surveyId);
  if (!quetion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Survey questions not found');
  }
  await quetion.remove();
  return quetion;
};

module.exports = {
  createSurveyQuetions,
  querySurveyQuetions,
  getSurveyQuetionsBySurveyId,
  updateSurveyQuetionsBysurveyId,
  deleteSurveyQuetionsBysurveyId,
  getSurveyQuetionsBycreatedById,
};
