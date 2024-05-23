const httpStatus = require('http-status');
const { Blocks } = require('../models');
const ApiError = require('../utils/ApiError');

const bulkUpload = async (schoolArray, csvFilePath = null) => {
  let modifiedSchoolArray = schoolArray;
  if (csvFilePath) {
    modifiedSchoolArray = csvFilePath;
  }

  if (!modifiedSchoolArray || !modifiedSchoolArray.length) {
    throw new Error('Missing array');
  }

  const promises = modifiedSchoolArray.map(async (block) => {
    const schoolFound = await Blocks.findOne({
      block_cd_1: block.block_cd_1,
    });
    if (schoolFound) {
      return { duplicate: true, data: block };
    }

    let data = new Blocks(block);
    // eslint-disable-next-line no-unused-vars
    data = await data.save();

    return { duplicate: false, data: block };
  });
  const results = await Promise.all(promises);

  const duplicates = {
    totalDuplicates: results.filter((result) => result.duplicate).length,
    data: results.filter((result) => result.duplicate),
  };

  const nonDuplicates = {
    totalNonDuplicates: results.filter((result) => !result.duplicate).length,
    data: results.filter((result) => !result.duplicate),
  };

  return {
    duplicates,
    nonDuplicates,
  };
};

/**
 * Create a District
 * @param {Object} blockBody
 * @returns {Promise<Blocks>}
 */
const createBlock = async (blockBody) => {
  return Blocks.create(blockBody);
};

/**
 * Query for Block
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBlock = async (filter, options) => {
  const blocks = await Blocks.paginate(filter, options);
  return blocks;
};

/**
 * Get Block by id
 * @param {ObjectId} id
 * @returns {Promise<Blocks>}
 */
const getBlockById = async (id) => {
  return Blocks.findById(id);
};

/**
 * Update Block by id
 * @param {ObjectId} blockId
 * @param {Object} updateBody
 * @returns {Promise<Blocks>}
 */
const updateBlockById = async (blockId, updateBody) => {
  const Block = await getBlockById(blockId);
  if (!Block) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Block not found');
  }
  Object.assign(Block, updateBody);
  await Block.save();
  return Block;
};

/**
 * Delete Block by id
 * @param {ObjectId} blockId
 * @returns {Promise<Blocks>}
 */
const deleteBlockById = async (blockId) => {
  const Block = await getBlockById(blockId);
  if (!Block) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Block not found');
  }
  await Block.remove();
  return Block;
};

/**
 * Get book by filter
 * @param {ObjectId} District
 * @returns {Promise<Blocks>}
 */

const getBlocksByDistricts = async (District) => {
  return Blocks.find({ District });
};

module.exports = {
  createBlock,
  bulkUpload,
  queryBlock,
  getBlockById,
  updateBlockById,
  deleteBlockById,
  getBlocksByDistricts,
};
