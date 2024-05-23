const httpStatus = require('http-status');
const mongoose = require('mongoose');
const moment = require('moment');
const { AuditParameter, AuditAnswer, Category, Department, SubDepartment, SubSubDepartment } = require('../../models');
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

const getQuestionsByRoleCode = async (roleCode, freq, departmentCode, subDepartmentCode, subSubDepartmentCode) => {
  try {
    const query = {
      roles: { $elemMatch: { roleCode, freq } },
      DepartmentCode: departmentCode,
      SubDepartmentCode: subDepartmentCode,
      SubSubDepartmentCode: subSubDepartmentCode,
    };
    const query2 = {
      DepartmentCode: departmentCode,
      SubDepartmentCode: subDepartmentCode,
      SubSubDepartmentCode: subSubDepartmentCode,
    };
    const questions = await AuditParameter.find(
      query,
      'Question AllowedResponse Category SubCategory DisplayOrder OnsiteorOffsite roles.crit'
    ).lean();

    const categories = await Category.find(query2, 'CategoryDescription CategoryDisplayOrder').lean();
    const groupedQuestions = {};
    questions.forEach((question) => {
      if (!groupedQuestions[question.Category]) {
        groupedQuestions[question.Category] = {};
      }
      if (!groupedQuestions[question.Category][question.SubCategory]) {
        groupedQuestions[question.Category][question.SubCategory] = [];
      }
      groupedQuestions[question.Category][question.SubCategory].push({
        Question: question.Question,
        AllowedResponse: question.AllowedResponse,
        DisplayOrder: question.DisplayOrder,
        Crit: question.roles[0].crit,
        OnsiteorOffsite: question.OnsiteorOffsite,
      });
    });
    categories.sort((a, b) => a.CategoryDisplayOrder - b.CategoryDisplayOrder);
    const sortedGroupedQuestions = [];
    categories.forEach((category) => {
      if (groupedQuestions[category.CategoryDescription]) {
        const sortedSubCategories = [];
        Object.keys(groupedQuestions[category.CategoryDescription])
          .sort((a, b) => a - b)
          .forEach((subCategory) => {
            sortedSubCategories.push({
              SubCategory: subCategory,
              Questions: groupedQuestions[category.CategoryDescription][subCategory].sort(
                (a, b) => a.DisplayOrder - b.DisplayOrder
              ),
            });
          });

        sortedGroupedQuestions.push({
          Category: category.CategoryDescription,
          CategoryDisplayOrder: category.CategoryDisplayOrder,
          SubCategories: sortedSubCategories,
        });
      }
    });

    return sortedGroupedQuestions;
  } catch (error) {
    throw new Error('Error fetching questions by role code');
  }
};

// const getQuestionsByRoleCode = async (roleCode, freq, departmentCode, subDepartmentCode, subSubDepartmentCode) => {
//   try {
//     const query = {
//       roles: { $elemMatch: { roleCode, freq } },
//       DepartmentCode: departmentCode,
//       SubDepartmentCode: subDepartmentCode,
//       SubSubDepartmentCode: subSubDepartmentCode,
//     };
//     const query2 = {
//       DepartmentCode: departmentCode,
//       SubDepartmentCode: subDepartmentCode,
//       SubSubDepartmentCode: subSubDepartmentCode,
//     };
//     const questions = await AuditParameter.find(
//       query,
//       'Question AllowedResponse Category SubCategory DisplayOrder OnsiteorOffsite roles.crit'
//     ).lean();

//     const categories = await Category.find(query2, 'CategoryDescription CategoryDisplayOrder').lean();
//     const groupedQuestions = {};
//     questions.forEach((question) => {
//       if (!groupedQuestions[question.Category]) {
//         groupedQuestions[question.Category] = {};
//       }
//       if (!groupedQuestions[question.Category][question.SubCategory]) {
//         groupedQuestions[question.Category][question.SubCategory] = [];
//       }
//       groupedQuestions[question.Category][question.SubCategory].push({
//         Question: question.Question,
//         AllowedResponse: question.AllowedResponse,
//         DisplayOrder: question.DisplayOrder,
//         Crit: question.roles[0].crit,
//         OnsiteorOffsite: question.OnsiteorOffsite,
//       });
//     });
//     categories.sort((a, b) => a.CategoryDisplayOrder - b.CategoryDisplayOrder);
//     const sortedGroupedQuestions = [];
//     categories.forEach((category) => {
//       if (groupedQuestions[category.CategoryDescription]) {
//         const sortedSubCategories = [];
//         Object.keys(groupedQuestions[category.CategoryDescription])
//           .sort((a, b) => a - b)
//           .forEach((subCategory) => {
//             sortedSubCategories.push({
//               SubCategory: subCategory,
//               Questions: groupedQuestions[category.CategoryDescription][subCategory].sort(
//                 (a, b) => a.DisplayOrder - b.DisplayOrder
//               ),
//             });
//           });

//         sortedGroupedQuestions.push({
//           Category: category.CategoryDescription,
//           CategoryDisplayOrder: category.CategoryDisplayOrder,
//           SubCategories: sortedSubCategories,
//         });
//       }
//     });

//     return sortedGroupedQuestions;
//   } catch (error) {
//     throw new Error('Error fetching questions by role code');
//   }
// };

// const getDepartmentByRoleCode = async (roleCode, schoolId) => {
//   try {
//     const auditParameters = await AuditParameter.find({ 'roles.roleCode': roleCode });
//     const uniqueQuestions = new Map();
//     for (const auditParam of auditParameters) {
//       let frequency = null;
//       for (const role of auditParam.roles) {
//         if (role.roleCode === roleCode) {
//           frequency = role.freq;
//           break;
//         }
//       }
//       const key = `${auditParam.DepartmentCode}-${auditParam.SubDepartmentCode}-${auditParam.SubSubDepartmentCode}-${frequency}`;
//       if (!uniqueQuestions.has(key)) {
//         const department = await Department.findOne({ DepartmentCode: auditParam.DepartmentCode });
//         const subDepartment = await SubDepartment.findOne({
//           DepartmentCode: auditParam.DepartmentCode,
//           SubDepartmentCode: auditParam.SubDepartmentCode,
//         });
//         const subSubDepartment = await SubSubDepartment.findOne({
//           DepartmentCode: auditParam.DepartmentCode,
//           SubDepartmentCode: auditParam.SubDepartmentCode,
//           SubSubDepartmentCode: auditParam.SubSubDepartmentCode,
//         });

//         let dueDate = '';
//         let startDate = '';
//         let endDate = '';
//         const currentDate = moment();

//         if (frequency) {
//           if (frequency.toUpperCase() === 'DAILY') {
//             startDate = currentDate.clone().startOf('day').format('DD/MM/YYYY');
//             endDate = currentDate.clone().endOf('day').format('DD/MM/YYYY');
//             dueDate = endDate;
//           } else if (frequency.toUpperCase() === 'MONTHLY') {
//             const firstDayOfMonth = currentDate.clone().startOf('month');
//             const lastDayOfMonth = currentDate.clone().endOf('month');
//             startDate = firstDayOfMonth.format('DD/MM/YYYY');
//             endDate = lastDayOfMonth.format('DD/MM/YYYY');
//             dueDate = endDate;
//           } else if (frequency.toUpperCase() === 'YEARLY') {
//             const startOfYear = currentDate.clone().startOf('year');
//             const endOfYear = currentDate.clone().endOf('year');
//             startDate = startOfYear.format('DD/MM/YYYY');
//             endDate = endOfYear.format('DD/MM/YYYY');
//             dueDate = endDate;
//           } else if (frequency.toUpperCase() === 'QUARTERLY') {
//             const quarterlyConstant = [
//               { start: '04-01', end: '06-30' },
//               { start: '07-01', end: '09-30' },
//               { start: '10-01', end: '12-31' },
//               { start: '01-01', end: '03-31' },
//             ];
//             const currentQuarter = quarterlyConstant.find((quarter) => {
//               const start = moment(quarter.start, 'MM-DD').year(currentDate.year());
//               const end = moment(quarter.end, 'MM-DD').year(currentDate.year());
//               return currentDate.isBetween(start, end, null, '[)');
//             });
//             startDate = moment(currentQuarter.start, 'MM-DD').year(currentDate.year()).format('DD/MM/YYYY');
//             endDate = moment(currentQuarter.end, 'MM-DD').year(currentDate.year()).format('DD/MM/YYYY');
//             dueDate = endDate;
//           } else if (frequency.toUpperCase() === 'WEEKLY') {
//             const startOfWeek = currentDate.clone().startOf('week');
//             const endOfWeek = startOfWeek.clone().endOf('week');
//             startDate = startOfWeek.format('DD/MM/YYYY');
//             endDate = endOfWeek.format('DD/MM/YYYY');
//             dueDate = endDate;
//           }
//         }

//         const auditAnswers = await AuditAnswer.findOne({
//           schoolId,
//           deptCode: auditParam.DepartmentCode,
//           subDeptCode: auditParam.SubDepartmentCode,
//           subSubDeptCode: auditParam.SubSubDepartmentCode,
//           frequency,
//           roleCode,
//           createdAt: { $gte: moment(startDate, 'DD/MM/YYYY').toDate(), $lte: moment(endDate, 'DD/MM/YYYY').toDate() },
//         });
//         let status = 'To Do';
//         if (auditAnswers) {
//           if (auditAnswers.finalSubmit) {
//             status = 'Submitted';
//           } else {
//             status = 'In Progress';
//           }
//         }

//         const formattedQuestion = {
//           question: auditParam.Question,
//           department: department ? department.toObject() : null,
//           subDepartment: subDepartment ? subDepartment.toObject() : null,
//           subSubDepartment: subSubDepartment ? subSubDepartment.toObject() : null,
//           freq: frequency,
//           date: dueDate,
//           finalSubmit: auditAnswers ? auditAnswers.finalSubmit : false,
//           status: status,
//         };

//         uniqueQuestions.set(key, formattedQuestion);
//       }
//     }

//     const formattedQuestions = Array.from(uniqueQuestions.values());
//     return formattedQuestions;
//   } catch (error) {
//     throw new Error(`Error fetching questions: ${error.message}`);
//   }
// };

/**
 * Get questions by role code with pagination
 * @param {string} roleCode - Role code
 * @param {string} schoolId - School ID
 * @param {Object} options - Pagination options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getDepartmentByRoleCode = async (roleCode, schoolId, options) => {
  try {
    const auditParameters = await AuditParameter.find({ 'roles.roleCode': roleCode });

    const uniqueQuestions = new Map();
    for (const auditParam of auditParameters) {
      let frequency = null;
      for (const role of auditParam.roles) {
        if (role.roleCode === roleCode) {
          frequency = role.freq;
          break;
        }
      }
      const key = `${auditParam.DepartmentCode}-${auditParam.SubDepartmentCode}-${auditParam.SubSubDepartmentCode}-${frequency}`;
      if (!uniqueQuestions.has(key)) {
        const department = await Department.findOne({ DepartmentCode: auditParam.DepartmentCode });
        const subDepartment = await SubDepartment.findOne({
          DepartmentCode: auditParam.DepartmentCode,
          SubDepartmentCode: auditParam.SubDepartmentCode,
        });
        const subSubDepartment = await SubSubDepartment.findOne({
          DepartmentCode: auditParam.DepartmentCode,
          SubDepartmentCode: auditParam.SubDepartmentCode,
          SubSubDepartmentCode: auditParam.SubSubDepartmentCode,
        });

        let dueDate = '';
        let startDate = '';
        let endDate = '';
        const currentDate = moment();

        if (frequency) {
          if (frequency.toUpperCase() === 'DAILY') {
            startDate = currentDate.clone().startOf('day').format('DD/MM/YYYY');
            endDate = currentDate.clone().endOf('day').format('DD/MM/YYYY');
            dueDate = endDate;
          } else if (frequency.toUpperCase() === 'MONTHLY') {
            const firstDayOfMonth = currentDate.clone().startOf('month');
            const lastDayOfMonth = currentDate.clone().endOf('month');
            startDate = firstDayOfMonth.format('DD/MM/YYYY');
            endDate = lastDayOfMonth.format('DD/MM/YYYY');
            dueDate = endDate;
          } else if (frequency.toUpperCase() === 'YEARLY') {
            const startOfYear = currentDate.clone().startOf('year');
            const endOfYear = currentDate.clone().endOf('year');
            startDate = startOfYear.format('DD/MM/YYYY');
            endDate = endOfYear.format('DD/MM/YYYY');
            dueDate = endDate;
          } else if (frequency.toUpperCase() === 'QUARTERLY') {
            const quarterlyConstant = [
              { start: '04-01', end: '06-30' },
              { start: '07-01', end: '09-30' },
              { start: '10-01', end: '12-31' },
              { start: '01-01', end: '03-31' },
            ];
            const currentQuarter = quarterlyConstant.find((quarter) => {
              const start = moment(quarter.start, 'MM-DD').year(currentDate.year());
              const end = moment(quarter.end, 'MM-DD').year(currentDate.year());
              return currentDate.isBetween(start, end, null, '[)');
            });
            startDate = moment(currentQuarter.start, 'MM-DD').year(currentDate.year()).format('DD/MM/YYYY');
            endDate = moment(currentQuarter.end, 'MM-DD').year(currentDate.year()).format('DD/MM/YYYY');
            dueDate = endDate;
          } else if (frequency.toUpperCase() === 'WEEKLY') {
            const startOfWeek = currentDate.clone().startOf('week');
            const endOfWeek = startOfWeek.clone().endOf('week');
            startDate = startOfWeek.format('DD/MM/YYYY');
            endDate = endOfWeek.format('DD/MM/YYYY');
            dueDate = endDate;
          }
        }

        const auditAnswers = await AuditAnswer.findOne({
          schoolId,
          deptCode: auditParam.DepartmentCode,
          subDeptCode: auditParam.SubDepartmentCode,
          subSubDeptCode: auditParam.SubSubDepartmentCode,
          frequency,
          roleCode,
          createdAt: { $gte: moment(startDate, 'DD/MM/YYYY').toDate(), $lte: moment(endDate, 'DD/MM/YYYY').toDate() },
        });
        let status = 'To Do';
        if (auditAnswers) {
          if (auditAnswers.finalSubmit) {
            status = 'Submitted';
          } else {
            status = 'In Progress';
          }
        }

        const formattedQuestion = {
          question: auditParam.Question,
          department: department ? department.toObject() : null,
          subDepartment: subDepartment ? subDepartment.toObject() : null,
          subSubDepartment: subSubDepartment ? subSubDepartment.toObject() : null,
          freq: frequency,
          date: dueDate,
          finalSubmit: auditAnswers ? auditAnswers.finalSubmit : false,
          status,
        };

        uniqueQuestions.set(key, formattedQuestion);
      }
    }

    const formattedQuestions = Array.from(uniqueQuestions.values());

    const { sortBy = 'createdAt:desc', limit, page } = options;
    const sort = {};
    if (sortBy) {
      const [key, order] = sortBy.split(':');
      sort[key] = order === 'desc' ? -1 : 1;
    }

    let paginatedQuestions;
    if (limit === undefined || page === undefined) {
      paginatedQuestions = formattedQuestions;
    } else {
      const limitValue = limit || formattedQuestions.length;
      const pageValue = page || 1;
      paginatedQuestions = formattedQuestions.slice((pageValue - 1) * limitValue, pageValue * limitValue);
    }

    const totalResults = formattedQuestions.length;
    const totalPages = limit ? Math.ceil(totalResults / limit) : 1;

    const result = {
      results: paginatedQuestions,
      page: page || 1,
      limit: limit || totalResults,
      totalPages,
      totalResults,
    };

    return result;
  } catch (error) {
    throw new Error(`Error fetching questions: ${error.message}`);
  }
};

/**
 * Get filterData by filters
 * @param {String} roleCode
 * @param {Object} filters
 * @returns {Promise<AuditParameter>}
 */

const filterDataByParameters = async (roleCode, filters) => {
  try {
    const filterObj = { 'roles.roleCode': roleCode };
    if (filters.DepartmentCode) {
      filterObj.DepartmentCode = filters.DepartmentCode;
    }
    if (filters.SubDepartmentCode) {
      filterObj.SubDepartmentCode = filters.SubDepartmentCode;
    }
    if (filters.SubSubDepartmentCode) {
      filterObj.SubSubDepartmentCode = filters.SubSubDepartmentCode;
    }
    if (filters.freq) {
      filterObj['roles.freq'] = filters.freq;
    }
    const auditParameters = await AuditParameter.aggregate([
      { $match: filterObj },
      {
        $lookup: {
          from: 'departments',
          localField: 'DepartmentCode',
          foreignField: 'DepartmentCode',
          as: 'department',
        },
      },
      {
        $lookup: {
          from: 'subdepartments',
          let: { departmentCode: '$DepartmentCode', subDepartmentCode: '$SubDepartmentCode' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$DepartmentCode', '$$departmentCode'] },
                    { $eq: ['$SubDepartmentCode', '$$subDepartmentCode'] },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: 'subDepartment',
        },
      },
      {
        $lookup: {
          from: 'subsubdepartments',
          let: {
            departmentCode: '$DepartmentCode',
            subDepartmentCode: '$SubDepartmentCode',
            subSubDepartmentCode: '$SubSubDepartmentCode',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$DepartmentCode', '$$departmentCode'] },
                    { $eq: ['$SubDepartmentCode', '$$subDepartmentCode'] },
                    { $eq: ['$SubSubDepartmentCode', '$$subSubDepartmentCode'] },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: 'subSubDepartment',
        },
      },
      {
        $project: {
          Question: 1,
          department: { $arrayElemAt: ['$department', 0] },
          subDepartment: { $arrayElemAt: ['$subDepartment', 0] },
          subSubDepartment: { $arrayElemAt: ['$subSubDepartment', 0] },
          freq: '$roles.freq',
        },
      },
    ]);
    const uniqueQuestions = new Map();
    for (const auditParam of auditParameters) {
      const key = `${auditParam.department.DepartmentCode}-${auditParam.subDepartment.SubDepartmentCode}-${auditParam.subSubDepartment.SubSubDepartmentCode}-${auditParam.freq}`;
      if (!uniqueQuestions.has(key)) {
        uniqueQuestions.set(key, {
          question: auditParam.Question,
          department:
            auditParam.department instanceof mongoose.Document ? auditParam.department.toObject() : auditParam.department,
          subDepartment:
            auditParam.subDepartment instanceof mongoose.Document
              ? auditParam.subDepartment.toObject()
              : auditParam.subDepartment,
          subSubDepartment:
            auditParam.subSubDepartment instanceof mongoose.Document
              ? auditParam.subSubDepartment.toObject()
              : auditParam.subSubDepartment,
          freq: auditParam.freq,
        });
      }
    }
    return Array.from(uniqueQuestions.values());
  } catch (error) {
    throw new Error(Error`filtering questions: ${error.message}`);
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
  filterDataByParameters,
};
