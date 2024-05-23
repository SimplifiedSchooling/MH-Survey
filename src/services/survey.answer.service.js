const httpStatus = require('http-status');
const { SurveyAnswers } = require('../models');
const ApiError = require('../utils/ApiError');
const surveyUpdate = require('./add.new.survey.service');
/**
 * Create a survey answer
 * @param {Object} reqBody
 * @returns {Promise<SurveyAnswers>}
 */
// Update surveyLocations document

const createSurveyAnswers = async (reqBody) => {
  // await SurveyLocation.findOneAndUpdate(
  //   {
  //     masterProjectId: reqBody.masterProjectId,
  //     'surveyLocations.udise_sch_code': reqBody.udise_sch_code,
  //   },
  //   { $set: { 'surveyLocations.$.status': 'Surveyed' } },
  //   { new: true }
  // );
  const data = SurveyAnswers.create(reqBody);
  const { masterProjectId, surveyId, surveyFormId } = reqBody;
  await surveyUpdate.updateActualDatesForSurvey(masterProjectId, surveyId, surveyFormId);
  return data;
};

/**
 * Query for survey answer
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySurveyAnswers = async (filter, options) => {
  const results = await SurveyAnswers.paginate(filter, options);
  return results;
};

/**
 * Get survey answer by id
 * @param {ObjectId} id
 * @returns {Promise<SurveyAnswers>}
 */
const getSurveyAnswersBySurveyId = async (id) => {
  return SurveyAnswers.findById(id);
};

/**
 * Update Survey answer by surveyId
 * @param {ObjectId} answerId
 * @param {Object} updateBody
 * @returns {Promise<SurveyAnswers>}
 */
const updateSurveyAnswersBysurveyId = async (answerId, updateBody) => {
  const quetion = await getSurveyAnswersBySurveyId(answerId);
  if (!quetion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Survey questions not found');
  }
  Object.assign(quetion, updateBody);
  await quetion.save();
  return quetion;
};

/**
 * Delete Survey answer by id
 * @param {ObjectId} answerId
 * @returns {Promise<SurveyAnswers>}
 */
const deleteSurveyAnswersBysurveyId = async (answerId) => {
  const quetion = await getSurveyAnswersBySurveyId(answerId);
  if (!quetion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Survey answers not found');
  }
  await quetion.remove();
  return quetion;
};

/**
 * Create a survey answer
 * @param {Object} surveyId
 * @param {Object} masterProjectId
 * @param {Object} surveyFormId
 * @param {Object} udise_sch_code
 * @returns {Promise<SurveyAnswers>}
 */
/* eslint-disable camelcase */
const filterSurveyAnswers = async (surveyId, masterProjectId, surveyFormId, udise_sch_code) => {
  const filter = { surveyId, masterProjectId, surveyFormId, udise_sch_code };
  const surveyAnswers = await SurveyAnswers.find(filter);
  return surveyAnswers;
};

// /**
//  * Get survey answer by id
//  * @param {ObjectId} id
//  * @returns {Promise<SurveyAnswers>}
//  */
// const getSurveyStatus = async (surveyId, masterProjectId, udise_sch_code) => {
//   return SurveyAnswers.find({ surveyId, masterProjectId, udise_sch_code });
// };
// /* eslint-enable camelcase */

module.exports = {
  createSurveyAnswers,
  querySurveyAnswers,
  getSurveyAnswersBySurveyId,
  updateSurveyAnswersBysurveyId,
  deleteSurveyAnswersBysurveyId,
  filterSurveyAnswers,
};
