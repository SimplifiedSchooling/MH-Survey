const httpStatus = require('http-status');
// eslint-disable-next-line import/no-extraneous-dependencies

const { join } = require('path');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const subCategoryService = require('../../services/nonacademics/sub.category.service');
const ApiError = require('../../utils/ApiError');

const staticFolder = join(__dirname, '../../');
const uploadsFolder = join(staticFolder, 'uploads');

const createSubCategory = catchAsync(async (req, res) => {
  try {
    if (req.file) {
      if (req.file.mimetype !== 'text/csv') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV format.');
      }
      const csvFilePath = join(uploadsFolder, req.file.filename);
      await subCategoryService.createSubCategory(null, csvFilePath);
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
      { DepartmentCode: { $regex: new RegExp(search, 'i') } },
      { SubSubDepartmentCode: { $regex: new RegExp(search, 'i') } },
      { SubDepartmentCode: { $regex: new RegExp(search, 'i') } },
      { CategoryCode: { $regex: new RegExp(search, 'i') } },
      { SubCategoryCode: { $regex: new RegExp(search, 'i') } },
    ];
  }

  return filter;
};

const getAllsubCategory = catchAsync(async (req, res) => {
  const { search } = req.query;
  const query = await buildFilter(search);
  const filter = query || {};
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await subCategoryService.querySubCategory(filter, options);
  res.send(result);
});

const getsubCategoryById = catchAsync(async (req, res) => {
  const singlesubCategory = await subCategoryService.getSubCategoryById(req.params.subCategoryId);
  if (!singlesubCategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'subCategory not found');
  }
  res.send(singlesubCategory);
});

const updatesubCategoryById = catchAsync(async (req, res) => {
  const updatesubCategory = await subCategoryService.updateSubCategoryById(req.params.subCategoryId, req.body);
  res.send(updatesubCategory);
});

const deleteistrictById = catchAsync(async (req, res) => {
  const deletesubCategory = await subCategoryService.deleteSubCategoryById(req.params.subCategoryId);
  res.status(httpStatus.NO_CONTENT).send(deletesubCategory);
});

module.exports = {
  createSubCategory,
  getAllsubCategory,
  getsubCategoryById,
  updatesubCategoryById,
  deleteistrictById,
};
