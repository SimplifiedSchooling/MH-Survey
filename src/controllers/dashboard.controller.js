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
    if(!data){
 
      res.status((new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', error)));
    }
    res.status(httpStatus.OK).json(data);
});

const getDistrictList = catchAsync(async (req, res) => {
  const { masterProjectId, division} = req.body;
  const data = await DashboardServices.getDistrictList(masterProjectId, division);
  if(!data){

    res.status((new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', error)));
  }
  res.status(httpStatus.OK).json(data);
});

const getBlockList = catchAsync(async (req, res) => {
  const { masterProjectId, district} = req.body;
  const data = await DashboardServices.getBlockList(masterProjectId, district);
  if(!data){

    res.status((new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', error)));
  }
  res.status(httpStatus.OK).json(data);
});

module.exports = {
  getLocationCounts,
  getDivisionList,
  getDistrictList,
  getBlockList,
};
