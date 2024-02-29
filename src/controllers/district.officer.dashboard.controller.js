const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { SurveyAnswers } = require('../models');
const { distictOfficerAnswerService } = require('../services');

/* eslint-disable camelcase */
const createSurveyAnswers = catchAsync(async (req, res) => {
  const { masterProjectId, udise_sch_code, surveyFormId, surveyId, status } = req.body;
  const filter = {
    surveyId,
    masterProjectId,
    udise_sch_code,
    surveyFormId,
  };

  const existingDocument = await SurveyAnswers.findOne(filter);

  if (existingDocument) {
    existingDocument.status = status;
    await existingDocument.save();
  }
  const question = await distictOfficerAnswerService.createSurveyAnswers(req.body);
  res.status(httpStatus.CREATED).send(question);
});

const getSurveyAnswers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await distictOfficerAnswerService.querySurveyAnswers(filter, options);
  res.send(result);
});

const getSurveyAnswer = catchAsync(async (req, res) => {
  const answer = await distictOfficerAnswerService.getSurveyAnswersBySurveyId(req.params.answerId);
  if (!answer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Survey Answers not found');
  }
  res.send(answer);
});

const updateSurveyAnswers = catchAsync(async (req, res) => {
  const answer = await distictOfficerAnswerService.updateSurveyAnswersBysurveyId(req.params.answerId, req.body);
  res.send(answer);
});

const deleteSurveyAnswers = catchAsync(async (req, res) => {
  await distictOfficerAnswerService.deleteSurveyAnswersBysurveyId(req.params.answerId);
  res.status(httpStatus.NO_CONTENT).send();
});

/* eslint-disable camelcase */
const filterSurveyAnswersController = catchAsync(async (req, res) => {
  const { surveyId, masterProjectId, surveyFormId, udise_sch_code } = req.params;
  const surveyAnswers = await distictOfficerAnswerService.filterSurveyAnswers(
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

