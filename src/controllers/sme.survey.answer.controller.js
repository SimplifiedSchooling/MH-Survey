const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { SurveyAnswers } = require('../models');
const { smeSurveyAnswerService } = require('../services');

/* eslint-disable camelcase */
// const createSurveyAnswers = catchAsync(async (req, res) => {
//   const { questionId, masterProjectId, udise_sch_code, surveyFormId } = req.body;
//   const filter = {
//     questionId,
//     masterProjectId,
//     udise_sch_code,
//     surveyFormId,
//   };
//   const update = {
//     status: 'Audited',
//   };
//   const updatedDocument = await SurveyAnswer.findOneAndUpdate(filter, update, { new: true });
//   if (!updatedDocument) {
//     console.log('Survey not found');
//   }
//   const quetion = await smeSurveyAnswerService.createSurveyAnswers(req.body);
//   res.status(httpStatus.CREATED).send(quetion);
// });

const createSurveyAnswers = catchAsync(async (req, res) => {
  const {masterProjectId, udise_sch_code, surveyFormId, surveyId } = req.body;

const filter = {
  surveyId,
  masterProjectId,
  udise_sch_code,
  surveyFormId,
};
const existingDocument = await SurveyAnswers.findOne(filter);

if (existingDocument) {
  // Document exists, update it
  existingDocument.status = 'Auditted';
  await existingDocument.save();
} else {
  // Document doesn't exist, create a new one
  const newDocument = new SurveyAnswer({
    ...filter,
    status: 'Auditted',
  });
  await newDocument.save();
}

// Continue with additional actions if needed
const question = await smeSurveyAnswerService.createSurveyAnswers(req.body);
res.status(httpStatus.CREATED).send(question);
});

const getSurveyAnswers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await smeSurveyAnswerService.querySurveyAnswers(filter, options);
  res.send(result);
});

const getSurveyAnswer = catchAsync(async (req, res) => {
  const answer = await smeSurveyAnswerService.getSurveyAnswersBySurveyId(req.params.answerId);
  if (!answer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Survey Answers not found');
  }
  res.send(answer);
});

const updateSurveyAnswers = catchAsync(async (req, res) => {
  const answer = await smeSurveyAnswerService.updateSurveyAnswersBysurveyId(req.params.answerId, req.body);
  res.send(answer);
});

const deleteSurveyAnswers = catchAsync(async (req, res) => {
  await smeSurveyAnswerService.deleteSurveyAnswersBysurveyId(req.params.answerId);
  res.status(httpStatus.NO_CONTENT).send();
});

/* eslint-disable camelcase */
const filterSurveyAnswersController = catchAsync(async (req, res) => {
  const { surveyId, masterProjectId, surveyFormId, udise_sch_code } = req.params;
  const surveyAnswers = await smeSurveyAnswerService.filterSurveyAnswers(
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
