const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { surveyQuetionsService } = require('../services');

const createSurveyQuetions = catchAsync(async (req, res) => {
  req.body.file = req.fileUrl;
  const quetion = await surveyQuetionsService.createSurveyQuetions(req.body);
  res.status(httpStatus.CREATED).send(quetion);
});

const getSurveyQuetions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await surveyQuetionsService.querySurveyQuetions(filter, options);
  res.send(result);
});

const getSurveyQuetion = catchAsync(async (req, res) => {
  const quetion = await surveyQuetionsService.getSurveyQuetionsBySurveyId(req.params.surveyId);
  if (!quetion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Survey questions not found');
  }
  res.send(quetion);
});
const getSurveyQuetionsBycreatedById = catchAsync(async (req, res) => {
  const quetion = await surveyQuetionsService.getSurveyQuetionsBycreatedById(req.params.createdById);
  if (!quetion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Survey questions not found');
  }
  res.send(quetion);
});

const updateSurveyQuetions = catchAsync(async (req, res) => {
  const quetion = await surveyQuetionsService.updateSurveyQuetionsBysurveyId(req.params.surveyId, req.body);
  res.send(quetion);
});

const deleteSurveyQuetions = catchAsync(async (req, res) => {
  await surveyQuetionsService.deleteSurveyQuetionsBysurveyId(req.params.surveyId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSurveyQuetions,
  getSurveyQuetions,
  getSurveyQuetion,
  updateSurveyQuetions,
  deleteSurveyQuetions,
  getSurveyQuetionsBycreatedById,
};
