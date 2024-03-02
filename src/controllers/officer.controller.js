const httpStatus = require('http-status');
const { join } = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const catchAsync = require('../utils/catchAsync');
const { OfficersService } = require('../services');
const ApiError = require('../utils/ApiError');
const csv = require('csvtojson');
const xlsx = require('xlsx');

const staticFolder = join(__dirname, '../');
const uploadsFolder = join(staticFolder, 'uploads');

// const smeOfficerBulkUpload = catchAsync(async (req, res) => {
//   try {
//     if (req.file) {
//       if (req.file.mimetype !== 'text/csv') {
//         throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV format.');
//       }
//       const { surveyAdmin, masterProjectId } = req.body;
//       const csvFilePath = join(uploadsFolder, req.file.filename);
//       const result = await OfficersService.smeOfficerBulkUpload(csvFilePath, surveyAdmin, masterProjectId);

//       res.status(httpStatus.CREATED).send(result);
//     } else {
//       throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
//     }
//   } catch (error) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
//   }
// });
const smeOfficerBulkUpload = catchAsync(async (req, res) => {
  try {
    if (req.file) {
      let dataArray;

      if (req.file.mimetype === 'text/csv' || req.file.mimetype === 'application/vnd.ms-excel') {
        // For CSV files
        const csvFilePath = join(uploadsFolder, req.file.filename);
        dataArray = await csv().fromFile(csvFilePath);
      } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        // For XLSX files
        const xlsxFilePath = join(uploadsFolder, req.file.filename);
        const workbook = xlsx.readFile(xlsxFilePath);
        const sheetName = workbook.SheetNames[0];
        dataArray = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      } else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV or XLSX format.');
      }

      // Your service logic for Officer upload using dataArray
      const { surveyAdmin, masterProjectId } = req.body;
      const result = await OfficersService.smeOfficerBulkUpload(dataArray, surveyAdmin, masterProjectId);

      res.status(httpStatus.CREATED).send(result);
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
});

// const blockOfficerBulkUpload = catchAsync(async (req, res) => {
//   try {
//     if (req.file) {
//       if (req.file.mimetype !== 'text/csv') {
//         throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV format.');
//       }
//       const { surveyAdmin, masterProjectId } = req.body;
//       const csvFilePath = join(uploadsFolder, req.file.filename);
//       const result = await OfficersService.blockOfficerBulkUpload(csvFilePath, surveyAdmin, masterProjectId);

//       res.status(httpStatus.CREATED).send(result);
//     } else {
//       throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
//     }
//   } catch (error) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
//   }
// });
const blockOfficerBulkUpload = catchAsync(async (req, res) => {
  try {
    if (req.file) {
      let dataArray;

      if (req.file.mimetype === 'text/csv' || req.file.mimetype === 'application/vnd.ms-excel') {
        // For CSV files
        const csvFilePath = join(uploadsFolder, req.file.filename);
        dataArray = await csv().fromFile(csvFilePath);
      } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        // For XLSX files
        const xlsxFilePath = join(uploadsFolder, req.file.filename);
        const workbook = xlsx.readFile(xlsxFilePath);
        const sheetName = workbook.SheetNames[0];
        dataArray = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      } else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV or XLSX format.');
      }

      // Your service logic for Officer upload using dataArray
      const { surveyAdmin, masterProjectId } = req.body;
      const result = await OfficersService.blockOfficerBulkUpload(dataArray, surveyAdmin, masterProjectId);

      res.status(httpStatus.CREATED).send(result);
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
});

// const districtOfficerBulkUpload = catchAsync(async (req, res) => {
//   try {
//     if (req.file) {
//       if (req.file.mimetype !== 'text/csv') {
//         throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV format.');
//       }
//       const { surveyAdmin, masterProjectId } = req.body;
//       const csvFilePath = join(uploadsFolder, req.file.filename);
//       const result = await OfficersService.districtOfficerBulkUpload(csvFilePath, surveyAdmin, masterProjectId);

//       res.status(httpStatus.CREATED).send(result);
//     } else {
//       throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
//     }
//   } catch (error) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
//   }
// });
const districtOfficerBulkUpload = catchAsync(async (req, res) => {
  try {
    if (req.file) {
      let dataArray;

      if (req.file.mimetype === 'text/csv' || req.file.mimetype === 'application/vnd.ms-excel') {
        // For CSV files
        const csvFilePath = join(uploadsFolder, req.file.filename);
        dataArray = await csv().fromFile(csvFilePath);
      } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        // For XLSX files
        const xlsxFilePath = join(uploadsFolder, req.file.filename);
        const workbook = xlsx.readFile(xlsxFilePath);
        const sheetName = workbook.SheetNames[0];
        dataArray = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      } else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV or XLSX format.');
      }

      // Your service logic for Officer upload using dataArray
      const { surveyAdmin, masterProjectId } = req.body;
      const result = await OfficersService.districtOfficerBulkUpload(dataArray, surveyAdmin, masterProjectId);

      res.status(httpStatus.CREATED).send(result);
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
});

// const divisinOfficerBulkUpload = catchAsync(async (req, res) => {
//   try {
//     if (req.file) {
//       if (req.file.mimetype !== 'text/csv') {
//         throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV format.');
//       }
//       const { surveyAdmin, masterProjectId } = req.body;
//       const csvFilePath = join(uploadsFolder, req.file.filename);
//       const result = await OfficersService.divisinOfficerBulkUpload(csvFilePath, surveyAdmin, masterProjectId);

//       res.status(httpStatus.CREATED).send(result);
//     } else {
//       throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
//     }
//   } catch (error) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
//   }
// });
const divisinOfficerBulkUpload = catchAsync(async (req, res) => {
  try {
    if (req.file) {
      let dataArray;

      if (req.file.mimetype === 'text/csv' || req.file.mimetype === 'application/vnd.ms-excel') {
        // For CSV files
        const csvFilePath = join(uploadsFolder, req.file.filename);
        dataArray = await csv().fromFile(csvFilePath);
      } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        // For XLSX files
        const xlsxFilePath = join(uploadsFolder, req.file.filename);
        const workbook = xlsx.readFile(xlsxFilePath);
        const sheetName = workbook.SheetNames[0];
        dataArray = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      } else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Uploaded file must be in CSV or XLSX format.');
      }

      // Your service logic for Officer upload using dataArray
      const { surveyAdmin, masterProjectId } = req.body;
      const result = await OfficersService.divisinOfficerBulkUpload(dataArray, surveyAdmin, masterProjectId);

      res.status(httpStatus.CREATED).send(result);
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'Missing file');
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
});

const getDivisionCoordinatorsDetails = catchAsync(async (req, res) => {
  const { masterProjectId } = req.params;
  const coordinatorsDetails = await OfficersService.getDivisionCoordinatorsDetails(masterProjectId);
  res.json(coordinatorsDetails);
});
const getDistrictCoordinatorsDetails = catchAsync(async (req, res) => {
  const { masterProjectId } = req.params;
  const coordinatorsDetails = await OfficersService.getDistrictCoordinatorsDetails(masterProjectId);
  res.json(coordinatorsDetails);
});
const getBlockCoordinatorsDetails = catchAsync(async (req, res) => {
  const { masterProjectId } = req.params;
  const coordinatorsDetails = await OfficersService.getBlockCoordinatorsDetails(masterProjectId);
  res.json(coordinatorsDetails);
});
const getSmeCoordinatorsDetails = catchAsync(async (req, res) => {
  const { masterProjectId } = req.params;
  const coordinatorsDetails = await OfficersService.getSMECoordinatorsDetails(masterProjectId);
  res.json(coordinatorsDetails);
});

module.exports = {
  smeOfficerBulkUpload,
  blockOfficerBulkUpload,
  districtOfficerBulkUpload,
  divisinOfficerBulkUpload,
  getDivisionCoordinatorsDetails,
  getDistrictCoordinatorsDetails,
  getBlockCoordinatorsDetails,
  getSmeCoordinatorsDetails,
};
