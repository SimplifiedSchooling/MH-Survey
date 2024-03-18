const httpStatus = require('http-status');
const { join } = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const csv = require('csvtojson');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { districtService } = require('../services');
const ApiError = require('../utils/ApiError');

const staticFolder = join(__dirname, '../');
const uploadsFolder = join(staticFolder, 'uploads');

const bulkUploadFile = catchAsync(async (req, res) => {
  if (req.file) {
    if (req.file.mimetype !== 'text/csv') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV format.');
    }
    const csvFilePath = join(uploadsFolder, req.file.filename);
    const csvJsonArray = await csv().fromFile(csvFilePath);
    const result = await districtService.bulkUpload(csvJsonArray);
    res.send(result);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
  }
});

const createDistrict = catchAsync(async (req, res) => {
  const district = await districtService.createDistrict(req.body);
  res.status(httpStatus.CREATED).send(district);
});

const buildFilter = (search) => {
  const filter = {
    $or: [
      { Division: { $regex: search || '', $options: 'i' } },
      { District: { $regex: search || '', $options: 'i' } },
    ],
  };

  // If search is a number, include it in the filter for numerical fields
  if (!isNaN(search)) {
    filter.$or.push({ district_cd: search });
  }

  return filter;
};

const getAllDistricts = catchAsync(async (req, res) => {
  const { search } = req.query;
  const query = await buildFilter(search);
  const filter = query || {};
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await districtService.queryDistrict(filter, options);
  res.send(result);
});
const getDistrict = catchAsync(async (req, res) => {
  const District = await districtService.getDistrictById(req.params.districtId);
  if (!District) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Districtnot found');
  }
  res.send(District);
});

const updateDistrict = catchAsync(async (req, res) => {
  const District = await districtService.updateDistrictById(req.params.districtId, req.body);
  res.send(District);
});

const deleteDistrict = catchAsync(async (req, res) => {
  await districtService.deleteDistrictById(req.params.districtId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getDistrictByName = catchAsync(async (req, res) => {
  const District = await districtService.getDistrictByName(req.params.Division);
  if (!District) {
    throw new ApiError(httpStatus.NOT_FOUND, 'District not found');
  }
  res.send(District);
});

module.exports = {
  getAllDistricts,
  bulkUploadFile,
  getDistrictByName,
  deleteDistrict,
  updateDistrict,
  getDistrict,
  createDistrict,
};
