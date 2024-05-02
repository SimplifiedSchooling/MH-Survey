const httpStatus = require('http-status');
const { AuditParameter, Category, Department, SubDepartment, SubSubDepartment } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Query for AuditParameter
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAuditParameter = async (filter, options) => {
  const auditParameters = await AuditParameter.paginate(filter, options);
  return auditParameters;
};

/**
 * Get AuditParameter by id
 * @param {ObjectId} id
 * @returns {Promise<AuditParameter>}
 */
const getAuditParameterById = async (id) => {
  return AuditParameter.findById(id);
};

/**
 * Update AuditParameter by id
 * @param {ObjectId} auditParameterId
 * @param {Object} updateBody
 * @returns {Promise<AuditParameter>}
 */
const updateAuditParameterById = async (auditParameterId, updateBody) => {
  const auditParameter = await getAuditParameterById(auditParameterId);
  if (!auditParameter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'AuditParameter not found');
  }
  Object.assign(auditParameter, updateBody);
  await auditParameter.save();
  return auditParameter;
};

/**
 * Delete AuditParameter by id
 * @param {ObjectId} auditParameterId
 * @returns {Promise<AuditParameter>}
 */
const deleteAuditParameterById = async (auditParameterId) => {
  const auditParameter = await getAuditParameterById(auditParameterId);
  if (!auditParameter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'AuditParameter not found');
  }
  await auditParameter.remove();
  return auditParameter;
};

/**
 * Get AuditParameter by filter
 * @param {ObjectId} AuditParameterName
 * @returns {Promise<AuditParameter>}
 */

const getAuditParameterByName = async (AuditParameterName) => {
  return AuditParameter.find({ AuditParameterName });
};

/**
 * Get QuestinList by filter
 * @param {ObjectId} AuditParameterName
 * @returns {Promise<AuditParameter>}
 */

// const getQuestionsByRoleCode = async (roleCode, departmentCode, subDepartmentCode, subSubDepartmentCode) => {
//   try {
//     // Find questions based on roleCode and other query parameters
//     const query = {
//       'roles.roleCode': roleCode,
//       DepartmentCode: departmentCode,
//       SubDepartmentCode: subDepartmentCode,
//       SubSubDepartmentCode: subSubDepartmentCode
//     };
//     const questions = await AuditParameter.find(query, 'Question AllowedResponse Category').lean();

//     // Retrieve category display order
//     const categories = await Category.find({}, 'CategoryDescription CategoryDisplayOrder').lean();
//     console.log(categories);
//     // Group questions by Category
//     const groupedQuestions = {};
//     questions.forEach(question => {
//       if (!groupedQuestions[question.Category]) {
//         groupedQuestions[question.Category] = [];
//       }
//       groupedQuestions[question.Category].push({
//         Question: question.Question,
//         AllowedResponse: question.AllowedResponse
//       });
//     });

//     // Order grouped questions based on CategoryDisplayOrder
//     Object.keys(groupedQuestions).forEach(category => {
//       const categoryOrder = categories.find(cat => cat.CategoryDescription === category)?.CategoryDisplayOrder || Infinity;
//       groupedQuestions[category].sort((a, b) => {
//         return categoryOrder - (categories.find(cat => cat.CategoryDescription === category)?.CategoryDisplayOrder || Infinity);
//       });
//     });

//     return groupedQuestions;
//   } catch (error) {
//     throw new Error('Error fetching questions by role code');
//   }
// };
// const getDepartmentByRoleCode = async (roleCode) => {
//   try {
//     // Fetch audit parameters matching the provided roleCode
//     const auditParameters = await AuditParameter.find({ "roles.roleCode": roleCode });

//     // Initialize an array to store formatted question objects
//     const formattedQuestions = [];

//     // Iterate through the audit parameters
//     for (const auditParam of auditParameters) {
//         // Fetch department details based on the DepartmentCode
//         const department = await Department.findOne({ DepartmentCode: auditParam.DepartmentCode });

//         // Fetch sub-department details based on the SubDepartmentCode
//         const subDepartment = await SubDepartment.findOne({ DepartmentCode: auditParam.DepartmentCode, SubDepartmentCode: auditParam.SubDepartmentCode });

//         // Fetch sub-sub-department details based on the SubSubDepartmentCode
//         const subSubDepartment = await SubSubDepartment.findOne({ DepartmentCode: auditParam.DepartmentCode, SubDepartmentCode: auditParam.SubDepartmentCode, SubSubDepartmentCode: auditParam.SubSubDepartmentCode });

//         // Format the question object
//         const formattedQuestion = {
//             question: auditParam.Question,
//             department: department ? department.toObject() : null,
//             subDepartment: subDepartment ? subDepartment.toObject() : null,
//             subSubDepartment: subSubDepartment ? subSubDepartment.toObject() : null,
//             roles: auditParam.roles.filter(role => role.roleCode === roleCode) // Filter roles by roleCode
//         };

//         // Push the formatted question object to the array
//         formattedQuestions.push(formattedQuestion);
//     }

//     return formattedQuestions;
// } catch (error) {
//     throw new Error(`Error fetching questions: ${error.message}`);
// }
// };
const getDepartmentByRoleCode = async (roleCode) => {
  try {
    // Fetch audit parameters matching the provided roleCode
    const auditParameters = await AuditParameter.find({ 'roles.roleCode': roleCode });

    // Initialize a Set to store unique formatted question objects
    const uniqueQuestions = new Set();

    // Iterate through the audit parameters
    for (const auditParam of auditParameters) {
      // Fetch department details based on the DepartmentCode
      const department = await Department.findOne({ DepartmentCode: auditParam.DepartmentCode });

      // Fetch sub-department details based on the SubDepartmentCode
      const subDepartment = await SubDepartment.findOne({
        DepartmentCode: auditParam.DepartmentCode,
        SubDepartmentCode: auditParam.SubDepartmentCode,
      });

      // Fetch sub-sub-department details based on the SubSubDepartmentCode
      const subSubDepartment = await SubSubDepartment.findOne({
        DepartmentCode: auditParam.DepartmentCode,
        SubDepartmentCode: auditParam.SubDepartmentCode,
        SubSubDepartmentCode: auditParam.SubSubDepartmentCode,
      });

      // Format the question object
      const formattedQuestion = {
        question: auditParam.Question,
        department: department ? department.toObject() : null,
        subDepartment: subDepartment ? subDepartment.toObject() : null,
        subSubDepartment: subSubDepartment ? subSubDepartment.toObject() : null,
        roles: auditParam.roles.filter((role) => role.roleCode === roleCode), // Filter roles by roleCode
      };

      // Add the formatted question object to the Set
      uniqueQuestions.add(JSON.stringify(formattedQuestion));
    }

    // Convert the Set back to an array of unique question objects
    const formattedQuestions = Array.from(uniqueQuestions).map((question) => JSON.parse(question));

    return formattedQuestions;
  } catch (error) {
    throw new Error(`Error fetching questions: ${error.message}`);
  }
};

const getQuestionsByRoleCode = async (roleCode, departmentCode, subDepartmentCode, subSubDepartmentCode) => {
  try {
    // Find questions based on roleCode and other query parameters
    const query = {
      'roles.roleCode': roleCode,
      DepartmentCode: departmentCode,
      SubDepartmentCode: subDepartmentCode,
      SubSubDepartmentCode: subSubDepartmentCode,
    };
    const questions = await AuditParameter.find(query, 'Question AllowedResponse Category').lean();
    // Retrieve category display order
    const categories = await Category.find({}, 'CategoryDescription CategoryDisplayOrder').lean();
    // Group questions by Category
    const groupedQuestions = {};
    questions.forEach((question) => {
      if (!groupedQuestions[question.Category]) {
        groupedQuestions[question.Category] = [];
      }
      groupedQuestions[question.Category].push({
        Question: question.Question,
        AllowedResponse: question.AllowedResponse,
      });
    });
    categories.sort((a, b) => a.CategoryDisplayOrder - b.CategoryDisplayOrder);
    const sortedGroupedQuestions = {};
    categories.forEach((category) => {
      if (groupedQuestions[category.CategoryDescription]) {
        sortedGroupedQuestions[category.CategoryDescription] = groupedQuestions[category.CategoryDescription];
      }
    });

    return sortedGroupedQuestions;
  } catch (error) {
    throw new Error('Error fetching questions by role code');
  }
};

module.exports = {
  queryAuditParameter,
  getAuditParameterById,
  updateAuditParameterById,
  deleteAuditParameterById,
  getAuditParameterByName,
  getQuestionsByRoleCode,
  getDepartmentByRoleCode,
};
