const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { surveyAnswerService } = require('../services');

const createSurveyAnswers = catchAsync(async (req, res) => {
  const quetion = await surveyAnswerService.createSurveyAnswers(req.body);
  res.status(httpStatus.CREATED).send(quetion);
});

const getSurveyAnswers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await surveyAnswerService.querySurveyAnswers(filter, options);
  res.send(result);
});

const getSurveyAnswer = catchAsync(async (req, res) => {
  const answer = await surveyAnswerService.getSurveyAnswersBySurveyId(req.params.answerId);
  if (!answer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Survey Answers not found');
  }
  res.send(answer);
});

const updateSurveyAnswers = catchAsync(async (req, res) => {
  const answer = await surveyAnswerService.updateSurveyAnswersBysurveyId(req.params.answerId, req.body);
  res.send(answer);
});

const deleteSurveyAnswers = catchAsync(async (req, res) => {
  await surveyAnswerService.deleteSurveyAnswersBysurveyId(req.params.answerId);
  res.status(httpStatus.NO_CONTENT).send();
});
/* eslint-disable camelcase */
const filterSurveyAnswersController = catchAsync(async (req, res) => {
  const { surveyId, masterProjectId, surveyFormId, udise_sch_code } = req.params;
  const surveyAnswers = await surveyAnswerService.filterSurveyAnswers(
    surveyId,
    masterProjectId,
    surveyFormId,
    udise_sch_code
  );

  if (!surveyAnswers || surveyAnswers.length === 0) {
    return res.status(httpStatus.OK).json({ message: 'Data not found' });
  }
  res.status(httpStatus.OK).json(surveyAnswers);
});
module.exports = {
  createSurveyAnswers,
  getSurveyAnswers,
  getSurveyAnswer,
  updateSurveyAnswers,
  deleteSurveyAnswers,
  filterSurveyAnswersController,
};
