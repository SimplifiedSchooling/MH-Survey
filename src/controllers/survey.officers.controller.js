const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { coordinatorAssignmentServices } = require('../services');

const bulkUploadFile = catchAsync(async (req, res) => {
  if (req.file) {
    if (req.file.mimetype !== 'text/csv') {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Uploaded file must be in CSV format.' });
    }
    const { masterProjectId, surveyAdmin, emailType } = req.body;
    const result = await coordinatorAssignmentServices.bulkUpload(req.file, masterProjectId, surveyAdmin, emailType);

    return res.status(httpStatus.CREATED).json(result);
  }

  return res.status(httpStatus.NOT_FOUND).json({ message: 'Missing file' });
});

const assignCoordinators = catchAsync(async (req, res) => {
  const result = await coordinatorAssignmentServices.assignCoordinators(req.body);
  res.status(httpStatus.CREATED).send(result);
});

const getAllCoordinatorAssignments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['masterProjectId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const assignments = await coordinatorAssignmentServices.getAllCoordinatorAssignments(filter, options);
  res.status(httpStatus.OK).send(assignments);
});

const getAssigment = catchAsync(async (req, res) => {
  const assignment = await coordinatorAssignmentServices.getAssignById(req.params.assignmentId);
  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Assignment found');
  }
  res.send(assignment);
});

const getAssigmentBySurveyId = catchAsync(async (req, res) => {
  const assignment = await coordinatorAssignmentServices.getAssignBySurveyId(req.params.masterProjectId);
  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Assignment found');
  }
  res.send(assignment);
});

const updateAssigment = catchAsync(async (req, res) => {
  const assignment = await coordinatorAssignmentServices.updateAssignmentIdById(req.params.assignmentId, req.body);
  res.send(assignment);
});

const deleteAssigment = catchAsync(async (req, res) => {
  await coordinatorAssignmentServices.deleteAssignmentById(req.params.assignmentId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getUsersBySurveyId = catchAsync(async (req, res) => {
  const { masterProjectId } = req.params;
  const users = await coordinatorAssignmentServices.getUsersBySurveyId(masterProjectId);
  res.status(httpStatus.OK).json({ users });
});

const getAssignedProjectsForuser = catchAsync(async (req, res) => {
  const { email, role } = req.body;
  const projects = await coordinatorAssignmentServices.getAssignedProjects(email, role);
  res.status(httpStatus.OK).json({ projects });
});

module.exports = {
  bulkUploadFile,
  assignCoordinators,
  getAllCoordinatorAssignments,
  getAssigment,
  updateAssigment,
  deleteAssigment,
  getAssigmentBySurveyId,
  getUsersBySurveyId,
  getAssignedProjectsForuser,
};
