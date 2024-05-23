const csv = require('csvtojson');
const { School } = require('../models');

const bulkUpload = async (schoolArray, csvFilePath = null) => {
  try {
    let modifiedSchoolArray = schoolArray;
    if (csvFilePath) {
      modifiedSchoolArray = csvFilePath;
    }
    const batchSize = 1000;
    if (!modifiedSchoolArray || !modifiedSchoolArray.length) {
      throw new Error('Missing array');
    }
    const jsonArray = await csv().fromFile(modifiedSchoolArray);

    // Arrays to store duplicate and non-duplicate school data
    const duplicateData = [];
    const nonDuplicateData = [];

    // Split the array into batches
    for (let i = 0; i < jsonArray.length; i += batchSize) {
      const batch = jsonArray.slice(i, i + batchSize);

      // Use bulk write for efficient insertion
      // eslint-disable-next-line no-await-in-loop
      const bulkOps = [];
      for (const doc of batch) {
        const existingSchool = await School.findOne({ udise_sch_code: doc.udise_sch_code });
        if (existingSchool) {
          // Collect duplicate school data
          duplicateData.push({ duplicate: true, data: doc });
        } else {
          // Collect non-duplicate school data and add to bulk operation
          nonDuplicateData.push({ duplicate: false, data: doc });
          bulkOps.push({
            insertOne: {
              document: doc,
            },
          });
        }
      }

      if (bulkOps.length > 0) {
        await School.bulkWrite(bulkOps);
      }
    }

    return {
      duplicates: {
        total: duplicateData.length,
        data: duplicateData,
      },
      nonDuplicates: {
        total: nonDuplicateData.length,
        data: nonDuplicateData,
      },
    };
  } catch (error) {
    // Handle any other errors
    throw new Error(`Bulk upload failed: ${error.message}`);
  }
};

/**
 * Query for school
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getAllSchools = async (filter, options) => {
  const schools = await School.paginate(filter, options);
  return schools;
};

module.exports = {
  bulkUpload,
  getAllSchools,
};
