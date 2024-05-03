const httpStatus = require('http-status');
const { AuditAnswer } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create a AuditAnswer
 * @param {Object} auditAnswerBody
 * @returns {Promise<AuditAnswer>}
 */

const createAuditAnswer = async (auditAnswerBody) => {
  return AuditAnswer.create(auditAnswerBody);
};

/**
 * Query for AuditAnswer
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAuditAnswer = async (filter, options) => {
  const auditAnswers = await AuditAnswer.paginate(filter, options);
  return auditAnswers;
};

/**
 * Get AuditAnswer by id
 * @param {ObjectId} id
 * @returns {Promise<AuditAnswer>}
 */
const getAuditAnswerById = async (id) => {
  return AuditAnswer.findById(id);
};

/**
 * Update AuditAnswer by id
 * @param {ObjectId} auditAnswerId
 * @param {Object} updateBody
 * @returns {Promise<AuditAnswer>}
 */
const updateAuditAnswerById = async (auditAnswerId, updateBody) => {
  const auditAnswer = await getAuditAnswerById(auditAnswerId);
  if (!auditAnswer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'AuditAnswer not found');
  }
  Object.assign(auditAnswer, updateBody);
  await auditAnswer.save();
  return auditAnswer;
};

/**
 * Delete AuditAnswer by id
 * @param {ObjectId} AuditAnswerId
 * @returns {Promise<AuditAnswer>}
 */
const deleteAuditAnswerById = async (AuditAnswerId) => {
  const auditAnswer = await getAuditAnswerById(AuditAnswerId);
  if (!auditAnswer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'AuditAnswer not found');
  }
  await auditAnswer.remove();
  return auditAnswer;
};

module.exports = {
  createAuditAnswer,
  queryAuditAnswer,
  getAuditAnswerById,
  updateAuditAnswerById,
  deleteAuditAnswerById,
};
