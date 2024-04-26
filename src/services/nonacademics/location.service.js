const httpStatus = require('http-status');
const csv = require('csvtojson');
const { Location } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create a Location
 * @param {Object} LocationBody
 * @returns {Promise<Location>}
 */
const createLocation = async (schoolArray, csvFilePath = null) => {
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

    // Split the array into batches
    for (let i = 0; i < jsonArray.length; i += batchSize) {
      const batch = jsonArray.slice(i, i + batchSize);

      // Use bulk write for efficient insertion
      // eslint-disable-next-line no-await-in-loop
      await Location.bulkWrite(
        batch.map((doc) => ({
          insertOne: {
            document: doc,
          },
        }))
      );
    }
  } catch (error) {
    // Handle any other errors
    throw new Error(`Bulk upload failed: ${error.message}`);
  }
};
// const createLocation = async (LocationBody) => {
//   return Location.create(LocationBody);
// };

/**
 * Query for Location
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryLocation = async (filter, options) => {
  const Locations = await Location.paginate(filter, options);
  return Locations;
};

/**
 * Get Location by id
 * @param {ObjectId} id
 * @returns {Promise<Location>}
 */
const getLocationById = async (id) => {
  return Location.findById(id);
};

/**
 * Update Location by id
 * @param {ObjectId} locationId
 * @param {Object} updateBody
 * @returns {Promise<Location>}
 */
const updateLocationById = async (locationId, updateBody) => {
  const location = await getLocationById(locationId);
  if (!location) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
  }
  Object.assign(location, updateBody);
  await location.save();
  return location;
};

/**
 * Delete Location by id
 * @param {ObjectId} locationId
 * @returns {Promise<Location>}
 */
const deleteLocationById = async (locationId) => {
  const location = await getLocationById(locationId);
  if (!location) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
  }
  await location.remove();
  return location;
};

/**
 * Get book by filter
 * @param {ObjectId} LocationName
 * @returns {Promise<Location>}
 */

const getLocationByName = async (LocationName) => {
  return Location.find({ LocationName });
};

module.exports = {
  createLocation,
  queryLocation,
  getLocationById,
  updateLocationById,
  deleteLocationById,
  getLocationByName,
};
