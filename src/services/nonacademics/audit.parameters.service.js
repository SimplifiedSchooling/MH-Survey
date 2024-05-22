const httpStatus = require('http-status');
const mongoose = require('mongoose');
const moment = require('moment');
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

const getDepartmentByRoleCode = async (roleCode) => {
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
        let dueDate = ""
        const currentDate = moment();
        if(frequency === "DAILY") {
          dueDate = moment().format("DD/MM/YYYY")
        } else if(frequency === "Monthly") {
          const firstDayOfNextMonth = currentDate.clone().add(1, 'month').startOf('month');
          const lastDayOfCurrentMonth = firstDayOfNextMonth.clone().subtract(1, 'day');
          dueDate = lastDayOfCurrentMonth.format('DD/MM/YYYY');
        } else if(frequency === "Annual") {
          const yearForEnd = currentDate.month() < 3 ? currentDate.year() : currentDate.year() + 1;
          dueDate = moment(`${yearForEnd}-03-31`).endOf('day').format('DD/MM/YYYY');
        } else if(frequency === "Quaterly") {
          const quarterlyConstant = [
            { start: '04-01', end: '06-30' },
            { start: '07-01', end: '09-30' },
            { start: '10-01', end: '12-31' },
            { start: '01-01', end: '03-31' }
          ]
          const currentQuarter = quarterlyConstant.find(quarter => {
            const start = moment(quarter.start, 'MM-DD').year(currentDate.year());
            const end = moment(quarter.end, 'MM-DD').year(currentDate.year());
            return currentDate.isBetween(start, end, null, '[)');
          });
          dueDate = moment(currentQuarter.end, 'MM-DD' + 'T23:59:59.999').format('DD/MM/YYYY');
        } else if(frequency === "Weekly") {
          const startOfWeek = currentDate.clone().startOf('week');
          const endOfWeek = startOfWeek.clone().endOf('week');
          dueDate = endOfWeek.format('DD/MM/YYYY');
        }
        const formattedQuestion = {
          question: auditParam.Question,
          department: department ? department.toObject() : null,
          subDepartment: subDepartment ? subDepartment.toObject() : null,
          subSubDepartment: subSubDepartment ? subSubDepartment.toObject() : null,
          freq: frequency,
        };
        uniqueQuestions.set(key, formattedQuestion);
      }
    }
    const formattedQuestions = Array.from(uniqueQuestions.values());
    return formattedQuestions;
  } catch (error) {
    throw new Error(`Error fetching questions: ${error.message}`);
  }
};

const getAuditList = async (query) => {
  try {

    console.log("reeee",query)
    const filterObj = { 'roles.roleCode': query.roleCode };
    if (query.DepartmentCode) {
      filterObj.DepartmentCode = query.DepartmentCode;
    }
    if (query.SubDepartmentCode) {
      filterObj.SubDepartmentCode = query.SubDepartmentCode;
    }
    if (query.SubSubDepartmentCode) {
      filterObj.SubSubDepartmentCode = query.SubSubDepartmentCode;
    }
    if (query.freq) {
      filterObj['roles.freq'] = query.freq;
    }
    console.log("FILTER",filterObj);

    const auditParameters = await AuditParameter.aggregate([
      { $match: filterObj },
      // {
      //   $lookup: {
      //     from: 'departments',
      //     localField: 'DepartmentCode',
      //     foreignField: 'DepartmentCode',
      //     as: 'department',
      //   },
      // },
    ])
    .skip(Number(query.page)*8)
    .limit(Number(query.perPage))
    // .limit(Number(query.perPage)).skip(Number(query.page)*8);
    console.log("auditParameters",auditParameters)

    return auditParameters;
  } catch (error) {
    throw new Error(`Error fetching questions: ${error.message}`);
  }
};

const getQuestionsByRoleCode = async (roleCode, freq, departmentCode, subDepartmentCode, subSubDepartmentCode) => {
  try {
    const query = {
      roles: { $elemMatch: { roleCode: roleCode, freq: freq } },
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

    console.log(questions);
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
          department: auditParam.department instanceof mongoose.Document ? auditParam.department.toObject() : auditParam.department,
          subDepartment: auditParam.subDepartment instanceof mongoose.Document ? auditParam.subDepartment.toObject() : auditParam.subDepartment,
          subSubDepartment: auditParam.subSubDepartment instanceof mongoose.Document ? auditParam.subSubDepartment.toObject() : auditParam.subSubDepartment,
          freq: auditParam.freq,
        });
      }
    }
    return Array.from(uniqueQuestions.values());
  } catch (error) {
    throw new Error(`Error filtering questions: ${error.message}`);
  }
};

const deleteAuditParmeterforDepartmentCode= async (DepartmentCode) => {
  return AuditParameter.deleteMany({DepartmentCode:DepartmentCode});
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
  deleteAuditParmeterforDepartmentCode,
  getAuditList
};
