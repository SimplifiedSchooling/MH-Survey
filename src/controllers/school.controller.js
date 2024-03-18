const httpStatus = require('http-status');
const { join } = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { schoolService } = require('../services');
const ApiError = require('../utils/ApiError');

const staticFolder = join(__dirname, '../');
const uploadsFolder = join(staticFolder, 'uploads');

const bulkUploadFile = catchAsync(async (req, res) => {
  try {
    if (req.file) {
      if (req.file.mimetype !== 'text/csv') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV format.');
      }
      const csvFilePath = join(uploadsFolder, req.file.filename);
      await schoolService.bulkUpload(null, csvFilePath);
      res.status(httpStatus.CREATED).send({ message: 'Data uploaded successfully.' });
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
});
const buildFilter = (search) => {
  const filter = {
    $or: [
      { Division: { $regex: search || '', $options: 'i' } },
      { Block_Name: { $regex: search || '', $options: 'i' } },
      { District: { $regex: search || '', $options: 'i' } },
      { school_name: { $regex: search || '', $options: 'i' } },
    ],
  };

  // If search is a number, include it in the filter for numerical fields
  if (!isNaN(search)) {
    filter.$or.push({ district_cd: search },{ udise_sch_code: search },{ block_cd_1: search },);
  }

  return filter;
};

const getAllSchools = catchAsync(async (req, res) => {
  const { search } = req.query;
  const query = await buildFilter(search);
  const filter = query || {};
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await schoolService.getAllSchools(filter, options);
  res.send(result);
});
module.exports = {
  getAllSchools,
  bulkUploadFile,
};
