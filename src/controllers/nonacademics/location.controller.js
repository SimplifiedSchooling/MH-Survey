const httpStatus = require('http-status');
const { join } = require('path');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const locationService = require('../../services/nonacademics/location.service');
const ApiError = require('../../utils/ApiError');

const staticFolder = join(__dirname, '../../');
const uploadsFolder = join(staticFolder, 'uploads');

const createLocation = catchAsync(async (req, res) => {
  try {
    if (req.file) {
      if (req.file.mimetype !== 'text/csv') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV format.');
      }
      const csvFilePath = join(uploadsFolder, req.file.filename);
      await locationService.createLocation(null, csvFilePath);
      res.status(httpStatus.CREATED).send({ message: 'Data uploaded successfully.' });
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
});

const buildFilter = (search) => {
  const filter = {};

  // Construct the filter based on the search query
  if (search) {
    filter.$or = [
      { LocationCode: { $regex: new RegExp(search, 'i') } },
      { ClusterCode: { $regex: new RegExp(search, 'i') } },
      { SchoolName: { $regex: new RegExp(search, 'i') } },
    ];
  }

  return filter;
};

const getAllLocation = catchAsync(async (req, res) => {
  const { search } = req.query;
  const query = await buildFilter(search);
  const filter = query || {};
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await locationService.queryLocation(filter, options);
  res.send(result);
});

const getLocationById = catchAsync(async (req, res) => {
  const singleLocation = await locationService.getLocationById(req.params.locationId);
  if (!singleLocation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
  }
  res.send(singleLocation);
});

const updateLocationById = catchAsync(async (req, res) => {
  const updateLocation = await locationService.updateLocationById(req.params.locationId, req.body);
  res.send(updateLocation);
});

const deleteistrictById = catchAsync(async (req, res) => {
  const deleteLocation = await locationService.deleteLocationById(req.params.locationId);
  res.status(httpStatus.NO_CONTENT).send(deleteLocation);
});

module.exports = {
  createLocation,
  getAllLocation,
  getLocationById,
  updateLocationById,
  deleteistrictById,
};
