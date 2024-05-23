const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { masterProjectService } = require('../services');

const createMasterSurveyProject = catchAsync(async (req, res) => {
  const { masterProjectData, subSurveyData } = req.body;
  const result = await masterProjectService.createMasterSurveyProject(masterProjectData, subSurveyData);
  res.status(httpStatus.CREATED).send(result);
});

const queryMasterProject = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['masterProjectName']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await masterProjectService.queryMasterSurvey(filter, options);
  res.send(result);
});

const getMasterProject = catchAsync(async (req, res) => {
  const MasterProject = await masterProjectService.getMasterProjectById(req.params.projectId);
  if (!MasterProject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'MasterProjectnot found');
  }
  res.send(MasterProject);
});

const updateMasterProject = catchAsync(async (req, res) => {
  const MasterProject = await masterProjectService.updateMasterProjectById(req.params.projectId, req.body);
  res.send(MasterProject);
});

const deleteMasterProject = catchAsync(async (req, res) => {
  await masterProjectService.deleteMasterProjectById(req.params.projectId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getProjectsByEmail = catchAsync(async (req, res) => {
  const surveys = await masterProjectService.getMasterProjectByEmail(req.params.masterProjectOwnerEmailId);
  if (!surveys) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Master Projects not found');
  }
  res.send(surveys);
});

module.exports = {
  createMasterSurveyProject,
  queryMasterProject,
  getMasterProject,
  updateMasterProject,
  deleteMasterProject,
  getProjectsByEmail,
};
