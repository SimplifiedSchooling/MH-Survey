const httpStatus = require('http-status');
const { join } = require('path');
const catchAsync = require('../../utils/catchAsync');
const pick = require('../../utils/pick');
const categoryService = require('../../services/nonacademics/category.service');
const ApiError = require('../../utils/ApiError');

const staticFolder = join(__dirname, '../../');
const uploadsFolder = join(staticFolder, 'uploads');

const createcategory = catchAsync(async (req, res) => {
  try {
    if (req.file) {
      if (req.file.mimetype !== 'text/csv') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV format.');
      }
      const csvFilePath = join(uploadsFolder, req.file.filename);
      await categoryService.createCategory(null, csvFilePath);
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
    ];
  }

  return filter;
};

const getAllcategory = catchAsync(async (req, res) => {
  const { search } = req.query;
  const query = await buildFilter(search);
  const filter = query || {};
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await categoryService.queryCategory(filter, options);
  res.send(result);
});

const getcategoryById = catchAsync(async (req, res) => {
  const singlecategory = await categoryService.getCategoryById(req.params.categoryId);
  if (!singlecategory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'category not found');
  }
  res.send(singlecategory);
});

const updatecategoryById = catchAsync(async (req, res) => {
  const updatecategory = await categoryService.updateCategoryById(req.params.categoryId, req.body);
  res.send(updatecategory);
});

const deleteistrictById = catchAsync(async (req, res) => {
  const deletecategory = await categoryService.deleteCategoryById(req.params.categoryId);
  res.status(httpStatus.NO_CONTENT).send(deletecategory);
});

module.exports = {
  createcategory,
  getAllcategory,
  getcategoryById,
  updatecategoryById,
  deleteistrictById,
};
