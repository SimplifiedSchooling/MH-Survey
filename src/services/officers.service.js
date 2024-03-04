const csv = require('csvtojson');
const { BlockOfficer, DistrictOfficer, DivisionOfficer, User, SMEOfficer } = require('../models');
// const smeOfficer = require('../models/smeofficer.model');

/**
 * Create a Master Survey Project with Sub Surveys
 * @param {Object} masterProjectData - Data for Master Project
 * @param {Array} subSurveyData - Data for Sub Survey Projects
 * @returns {Promise<{ masterProject: MasterProject, subSurveys: NewSurvey[] }>}
 */
const smeOfficerBulkUpload = async (csvFilePath, surveyAdmin, masterProjectId) => {
  const smeOfficers = csvFilePath

  if (!smeOfficers || !smeOfficers.length) {
    throw new Error('No valid SME Officers found in the CSV file');
  }

  const results = await Promise.all(
    smeOfficers.map(async (smeOfficer) => {
      try {
        const smeOfficerFound = await SMEOfficer.findOne({
          sme_EmailId: smeOfficer.sme_EmailId,
          masterProjectId,
        });

        // Check if the email exists in the User model
        const userFound = await User.findOne({
          email: smeOfficer.sme_EmailId,
          role: 'SME',
        });

        if (smeOfficerFound || !userFound) {
          // Email is either in SMEOfficer or User collection
          return { duplicate: true, data: smeOfficer };
        }

        // Email is not in both SMEOfficer and User collections
        const data = await new SMEOfficer({ ...smeOfficer, surveyAdmin, masterProjectId }).save();
        return { duplicate: false, data };
      } catch (error) {
        return { error: true, data: smeOfficer, errorMessage: error.message };
      }
    })
  );

  const duplicates = {
    totalDuplicates: results.filter((result) => result.duplicate).length,
    data: results.filter((result) => result.duplicate),
  };

  // Fetch non-duplicate SME Officer data from the User collection
  const nonDuplicates = await Promise.all(
    results
      .filter((result) => !result.duplicate)
      .map(async (result) => {
        const user = await User.findOne({ email: result.data.sme_EmailId, role: 'SME' });
        return { smeOfficer: result.data, user };
      })
  );

  const errors = results.filter((result) => result.error);
  if (errors.length > 0) {
    throw new Error(`Some SME Officers failed to process: ${JSON.stringify(errors)}`);
  }
  return { duplicates, nonDuplicates };
};

/**
 * Create a Master Survey Project with Sub Surveys
 * @param {Object} masterProjectData - Data for Master Project
 * @param {Array} subSurveyData - Data for Sub Survey Projects
 * @returns {Promise<{ masterProject: MasterProject, subSurveys: NewSurvey[] }>}
 */
const blockOfficerBulkUpload = async (csvFilePath, surveyAdmin, masterProjectId) => {
  const smeOfficers = csvFilePath
  console.log(smeOfficers);
  if (!smeOfficers || !smeOfficers.length) {
    throw new Error('No valid SME Officers found in the CSV file');
  }

  const results = await Promise.all(
    smeOfficers.map(async (smeOfficer) => {
      try {
        const smeOfficerFound = await BlockOfficer.findOne({
          block_Coordinator_EmailId: smeOfficer.block_Coordinator_EmailId,
          masterProjectId,
        });

        // Check if the email exists in the User model
        const userFound = await User.findOne({
          email: smeOfficer.block_Coordinator_EmailId,
          role: 'block',
        });

        if (smeOfficerFound || !userFound) {
          return { duplicate: true, data: smeOfficer };
        }

        const data = await new BlockOfficer({ ...smeOfficer, surveyAdmin, masterProjectId }).save();

        return { duplicate: false, data };
      } catch (error) {
        return { error: true, data: smeOfficer, errorMessage: error.message };
      }
    })
  );

  const duplicates = {
    totalDuplicates: results.filter((result) => result.duplicate).length,
    data: results.filter((result) => result.duplicate),
  };

  const nonDuplicates = await Promise.all(
    results
      .filter((result) => !result.duplicate)
      .map(async (result) => {
        const user = await User.findOne({ email: result.data.block_Coordinator_EmailId, role: 'block' });
        return { blockOfficer: result.data, user };
      })
  );

  const errors = results.filter((result) => result.error);
  if (errors.length > 0) {
    throw new Error(`Some SME Officers failed to process: ${JSON.stringify(errors)}`);
  }

  return { duplicates, nonDuplicates };
};

/**
 * Create a Master Survey Project with Sub Surveys
 * @param {Object} masterProjectData - Data for Master Project
 * @param {Array} subSurveyData - Data for Sub Survey Projects
 * @returns {Promise<{ masterProject: MasterProject, subSurveys: NewSurvey[] }>}
 */
const districtOfficerBulkUpload = async (csvFilePath, surveyAdmin, masterProjectId) => {
  const smeOfficers = csvFilePath

  if (!smeOfficers || !smeOfficers.length) {
    throw new Error('No valid SME Officers found in the CSV file');
  }

  const results = await Promise.all(
    smeOfficers.map(async (smeOfficer) => {
      try {
        const smeOfficerFound = await DistrictOfficer.findOne({
          district_Coordinator_EmailId: smeOfficer.district_Coordinator_EmailId,
          masterProjectId,
        });

        // Check if the email exists in the User model
        const userFound = await User.findOne({
          email: smeOfficer.district_Coordinator_EmailId,
          role: 'district',
        });

        if (smeOfficerFound || !userFound) {
          return { duplicate: true, data: smeOfficer };
        }

        const data = await new DistrictOfficer({ ...smeOfficer, surveyAdmin, masterProjectId }).save();

        return { duplicate: false, data };
      } catch (error) {
        return { error: true, data: smeOfficer, errorMessage: error.message };
      }
    })
  );

  const duplicates = {
    totalDuplicates: results.filter((result) => result.duplicate).length,
    data: results.filter((result) => result.duplicate),
  };

  const nonDuplicates = await Promise.all(
    results
      .filter((result) => !result.duplicate)
      .map(async (result) => {
        const user = await User.findOne({ email: result.data.district_Coordinator_EmailId, role: 'district' });
        return { districtOfficer: result.data, user };
      })
  );

  const errors = results.filter((result) => result.error);
  if (errors.length > 0) {
    throw new Error(`Some SME Officers failed to process: ${JSON.stringify(errors)}`);
  }

  return { duplicates, nonDuplicates };
};

/**
 * Create a Master Survey Project with Sub Surveys
 * @param {Object} masterProjectData - Data for Master Project
 * @param {Array} subSurveyData - Data for Sub Survey Projects
 * @returns {Promise<{ masterProject: MasterProject, subSurveys: NewSurvey[] }>}
 */
const divisinOfficerBulkUpload = async (csvFilePath, surveyAdmin, masterProjectId) => {
  const smeOfficers = csvFilePath

  if (!smeOfficers || !smeOfficers.length) {
    throw new Error('No valid SME Officers found in the CSV file');
  }

  const results = await Promise.all(
    smeOfficers.map(async (smeOfficer) => {
      try {
        const smeOfficerFound = await DivisionOfficer.findOne({
          division_Coordinator_EmailId: smeOfficer.division_Coordinator_EmailId,
          masterProjectId,
        });

        // Check if the email exists in the User model
        const userFound = await User.findOne({
          email: smeOfficer.division_Coordinator_EmailId,
          role: 'division',
        });

        if (smeOfficerFound || !userFound) {
          return { duplicate: true, data: smeOfficer };
        }

        const data = await new DivisionOfficer({ ...smeOfficer, surveyAdmin, masterProjectId }).save();

        return { duplicate: false, data };
      } catch (error) {
        return { error: true, data: smeOfficer, errorMessage: error.message };
      }
    })
  );

  const duplicates = {
    totalDuplicates: results.filter((result) => result.duplicate).length,
    data: results.filter((result) => result.duplicate),
  };

  const nonDuplicates = await Promise.all(
    results
      .filter((result) => !result.duplicate)
      .map(async (result) => {
        const user = await User.findOne({ email: result.data.division_Coordinator_EmailId, role: 'division' });
        return { divisionOfficer: result.data, user };
      })
  );

  const errors = results.filter((result) => result.error);
  if (errors.length > 0) {
    throw new Error(`Some SME Officers failed to process: ${JSON.stringify(errors)}`);
  }

  return { duplicates, nonDuplicates };
};

/**
 * get  a Userlist based on emails assigned to  Project
 * @param {Object} masterProjectId - Data for Master Project
 * @returns {Promise<User>}
 */

const getDivisionCoordinatorsDetails = async (masterProjectId) => {
  const divisionOfficers = await DivisionOfficer.find({ masterProjectId }).select('division_Coordinator_EmailId').lean();

  const coordinatorEmails = divisionOfficers.map((officer) => officer.division_Coordinator_EmailId);

  const coordinatorsDetails = await User.find({ email: { $in: coordinatorEmails } }).lean();

  return coordinatorsDetails;
};
/**
 * get  a Userlist based on emails assigned to  Project
 * @param {Object} masterProjectId - Data for Master Project
 * @returns {Promise<User>}
 */

const getDistrictCoordinatorsDetails = async (masterProjectId) => {
  const divisionOfficers = await DistrictOfficer.find({ masterProjectId }).select('district_Coordinator_EmailId').lean();

  const coordinatorEmails = divisionOfficers.map((officer) => officer.district_Coordinator_EmailId);

  const coordinatorsDetails = await User.find({ email: { $in: coordinatorEmails } }).lean();

  return coordinatorsDetails;
};
/**
 * get  a Userlist based on emails assigned to  Project
 * @param {Object} masterProjectId - Data for Master Project
 * @returns {Promise<User>}
 */

const getBlockCoordinatorsDetails = async (masterProjectId) => {
  const divisionOfficers = await BlockOfficer.find({ masterProjectId }).select('block_Coordinator_EmailId').lean();

  const coordinatorEmails = divisionOfficers.map((officer) => officer.block_Coordinator_EmailId);

  const coordinatorsDetails = await User.find({ email: { $in: coordinatorEmails } }).lean();

  return coordinatorsDetails;
};

/**
 * get  a Userlist based on emails assigned to  Project
 * @param {Object} masterProjectId - Data for Master Project
 * @returns {Promise<User>}
 */

const getSMECoordinatorsDetails = async (masterProjectId) => {
  const divisionOfficers = await SMEOfficer.find({ masterProjectId }).select('sme_EmailId').lean();

  const coordinatorEmails = divisionOfficers.map((officer) => officer.sme_EmailId);

  const coordinatorsDetails = await User.find({ email: { $in: coordinatorEmails } }).lean();

  return coordinatorsDetails;
};

/**
 * get  a Userlist based on emails assigned to  Project
 * @param {Object} masterProjectId - Data for Master Project
 * @param {String} email - Data for Master Project
 * @returns {Promise<BlockOfficer>}
 */
const getBlockCodeByEmailAndMasterProjectId = async (masterProjectId, email) => {
  const blockCode = await BlockOfficer.findOne({ masterProjectId, block_Coordinator_EmailId:email });
  return blockCode;
};

/**
 * get  a Userlist based on emails assigned to  Project
 * @param {Object} masterProjectId - Data for Master Project
 * @param {String} email - Data for Master Project
 * @returns {Promise<SMEOfficer>}
 */
const getSmeBlockCodeByEmailAndMasterProjectId = async (masterProjectId, email) => {
  const blockCode = await SMEOfficer.findOne({ masterProjectId, sme_EmailId:email });
  return blockCode;
};

/**
 * get  a Userlist based on emails assigned to  Project
 * @param {Object} masterProjectId - Data for Master Project
 * @param {String} email - Data for Master Project
 * @returns {Promise<SMEOfficer>}
 */
const getDivisionNameByEmailAndMasterProjectId = async (masterProjectId, email) => {
  const blockCode = await DivisionOfficer.findOne({ masterProjectId, division_Coordinator_EmailId:email });
  // const getDivisionName = await Division.findOne({blockCode.division_code});
  return blockCode;
};
/**
 * get  a Userlist based on emails assigned to  Project
 * @param {Object} masterProjectId - Data for Master Project
 * @param {String} email - Data for Master Project
 * @returns {Promise<DistrictOfficer>}
 */
const getDistrictCodeByEmailAndMasterProjectId = async (masterProjectId, email) => {
  const blockCode = await DistrictOfficer.findOne({ masterProjectId, district_Coordinator_EmailId:email });
  return blockCode;
};

module.exports = {
  smeOfficerBulkUpload,
  blockOfficerBulkUpload,
  districtOfficerBulkUpload,
  divisinOfficerBulkUpload,
  getDivisionCoordinatorsDetails,
  getDistrictCoordinatorsDetails,
  getBlockCoordinatorsDetails,
  getSMECoordinatorsDetails,
  getBlockCodeByEmailAndMasterProjectId,
  getDistrictCodeByEmailAndMasterProjectId,
  getSmeBlockCodeByEmailAndMasterProjectId,
  getDivisionNameByEmailAndMasterProjectId,
};
