const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { DashboardServices } = require('../services');
const ApiError = require('../utils/ApiError');

const getLocationCounts = catchAsync(async (req, res, next) => {
  try {
    const { masterProjectId, surveyId, surveyFormId } = req.params;
    const counts = await DashboardServices.getLocationCounts(masterProjectId, surveyId, surveyFormId);
    res.status(httpStatus.OK).json(counts);
  } catch (error) {
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', error));
  }
});

const getDivisionList = catchAsync(async (req, res) => {
  const { masterProjectId } = req.params;
  const data = await DashboardServices.getDivisionList(masterProjectId);
  if (!data) {
    res.status(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', error));
  }
  res.status(httpStatus.OK).json(data);
});

const getDistrictList = catchAsync(async (req, res) => {
  const { masterProjectId, division } = req.body;
  const data = await DashboardServices.getDistrictList(masterProjectId, division);
  if (!data) {
    res.status(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', error));
  }
  res.status(httpStatus.OK).json(data);
});

const getBlockList = catchAsync(async (req, res) => {
  const { masterProjectId, district } = req.body;
  const data = await DashboardServices.getBlockList(masterProjectId, district);
  if (!data) {
    res.status(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', error));
  }
  res.status(httpStatus.OK).json(data);
});

const getLocationCountsByDivisionController = catchAsync(async (req, res, next) => {
  try {
    const { masterProjectId, surveyId, surveyFormId, division } = req.params;
    const counts = await DashboardServices.getLocationCountsByDivision(masterProjectId, surveyId, surveyFormId, division);
    res.status(httpStatus.OK).json(counts);
  } catch (error) {
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', error));
  }
});

const getLocationCountsByDistrict = catchAsync(async (req, res, next) => {
  try {
    const { masterProjectId, surveyId, surveyFormId, district } = req.params;
    const counts = await DashboardServices.getLocationCountsByDistrict(masterProjectId, surveyId, surveyFormId, district);
    res.status(httpStatus.OK).json(counts);
  } catch (error) {
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', error));
  }
});

const getLocationCountsByBlock = catchAsync(async (req, res, next) => {
  try {
    const { masterProjectId, surveyId, surveyFormId, block } = req.params;
    const counts = await DashboardServices.getLocationCountsByBlock(masterProjectId, surveyId, surveyFormId, block);
    res.status(httpStatus.OK).json(counts);
  } catch (error) {
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', error));
  }
});

const getLocationCountsByFiltersController = catchAsync(async (req, res, next) => {
  try {
    const { masterProjectId, surveyId, surveyFormId } = req.params;
    const { division, district, blockName } = req.query;
    const counts = await DashboardServices.getLocationCountsByFilters(masterProjectId, surveyId, surveyFormId, {
      division,
      district,
      blockName,
    });

    res.status(httpStatus.OK).json(counts);
  } catch (error) {
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', error));
  }
});

module.exports = {
  getLocationCounts,
  getDivisionList,
  getDistrictList,
  getBlockList,
  getLocationCountsByDivisionController,
  getLocationCountsByFiltersController,
  getLocationCountsByDistrict,
  getLocationCountsByBlock,
};
