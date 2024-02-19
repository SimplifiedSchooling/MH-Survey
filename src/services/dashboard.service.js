const { SurveyLocation, SurveyAnswers, School } = require('../models');

/**
 * Get counts of locations, surveyed locations, and pending locations based on masterProjectId
 * @param {String} masterProjectId - ID of the master project
 * @param {String} surveyId - ID of the master project
 * @param {String} surveyFormId - ID of the master project
 * @returns {Promise<{ totalLocations: number, totalSurveyed: number, totalPending: number }>}
 */

const getLocationCounts = async (masterProjectId, surveyId, surveyFormId) => {
  // Get udise_sch_code from SurveyLocation
  const surveyLocation = await SurveyLocation.findOne({ masterProjectId });
  const udiseCodes = surveyLocation.surveyLocations.map((location) => location.udise_sch_code);
  const totalLocations = new Set(udiseCodes).size;
  // Get total surveyed locations
  const totalSurveyed = await SurveyAnswers.countDocuments({
    masterProjectId,
    surveyId,
    surveyFormId,
    udise_sch_code: { $in: udiseCodes },
  });

  // Calculate total pending locations
  const totalPending = totalLocations - totalSurveyed;

  return { totalLocations, totalSurveyed, totalPending };
};

/**
 * Get school data by surveyId
 * @param {String} masterProjectId
 * @returns {Promise<School[]>}
 */
const getSchoolDataBySurveyId = async (masterProjectId) => {
  const surveyLocation = await SurveyLocation.findOne({ masterProjectId });

  if (!surveyLocation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Survey location not found');
  }
  const udiseSchCodes = surveyLocation.surveyLocations.map((location) => location.udise_sch_code);
  const query = { udise_sch_code: { $in: udiseSchCodes.map(Number) } };
  const schools = await School.find(query).lean();

  return schools;
};

/**
 * Get counts of locations, surveyed locations, and pending locations based on masterProjectId
 * @param {String} masterProjectId - ID of the master project
 * @returns {Promise<{ totalLocations: number, totalSurveyed: number, totalPending: number }>}
 */

const getDivisionList = async (masterProjectId) => {
  const schools = await getSchoolDataBySurveyId(masterProjectId);
  const uniqueDivisions = [...new Set(schools.map((school) => school.Division))];
  return { divisionList: uniqueDivisions };
};

/**
 * Get unique district list based on division name and masterProjectId
 * @param {String} masterProjectId - ID of the master project
 * @param {String} division - name of the division
 * @returns {Promise<{ districtList: string[] }>}
 */
const getDistrictList = async (masterProjectId, division) => {
  const schools = await getSchoolDataBySurveyId(masterProjectId);

  // Filter schools based on the provided division
  const filteredSchools = schools.filter((school) => school.Division === division);

  // Get unique district list from the filtered schools
  const uniqueDistricts = [...new Set(filteredSchools.map((school) => school.District))];

  return { districtList: uniqueDistricts };
};

/**
 * Get unique district list based on division name and masterProjectId
 * @param {String} masterProjectId - ID of the master project
 * @param {String} District - name of the division
 * @returns {Promise<{ districtList: string[] }>}
 */
const getBlockList = async (masterProjectId, District) => {
  const schools = await getSchoolDataBySurveyId(masterProjectId);

  // Filter schools based on the provided division
  const filteredSchools = schools.filter((school) => school.District === District);

  // Get unique district list from the filtered schools
  const uniqueBlocks = [...new Set(filteredSchools.map((school) => school.Block_Name))];

  return { blocksList: uniqueBlocks };
};

module.exports = {
  getLocationCounts,
  getDivisionList,
  getDistrictList,
  getBlockList,
};
