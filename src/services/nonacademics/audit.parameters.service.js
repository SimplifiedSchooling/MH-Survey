const httpStatus = require('http-status');
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
      const key = `${auditParam.DepartmentCode}-${auditParam.SubDepartmentCode}-${auditParam.SubSubDepartmentCode}-${auditParam.roles[0].freq}`;
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
        if(auditParam.roles[0].freq === "DAILY") {
          dueDate = moment().format("DD/MM/YYYY")
        } else if(auditParam.roles[0].freq === "Monthly") {
          const firstDayOfNextMonth = currentDate.clone().add(1, 'month').startOf('month');
          const lastDayOfCurrentMonth = firstDayOfNextMonth.clone().subtract(1, 'day');
          dueDate = lastDayOfCurrentMonth.format('DD/MM/YYYY');
        } else if(auditParam.roles[0].freq === "Annual") {
          const yearForEnd = currentDate.month() < 3 ? currentDate.year() : currentDate.year() + 1;
          dueDate = moment(`${yearForEnd}-03-31`).endOf('day').format('DD/MM/YYYY');
        } else if(auditParam.roles[0].freq === "Quaterly") {
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
        } else if(auditParam.roles[0].freq === "Weekly") {
          const startOfWeek = currentDate.clone().startOf('week');
          const endOfWeek = startOfWeek.clone().endOf('week');
          dueDate = endOfWeek.format('DD/MM/YYYY');
        }
        const formattedQuestion = {
          question: auditParam.Question,
          department: department ? department.toObject() : null,
          subDepartment: subDepartment ? subDepartment.toObject() : null,
          subSubDepartment: subSubDepartment ? subSubDepartment.toObject() : null,
          freq: auditParam.roles[0].freq,
          date: dueDate
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

const getQuestionsByRoleCode = async (roleCode, freq, departmentCode, subDepartmentCode, subSubDepartmentCode) => {
  try {
    const query = {
      'roles.roleCode': roleCode,
      'roles.freq': freq,
      DepartmentCode: departmentCode,
      SubDepartmentCode: subDepartmentCode,
      SubSubDepartmentCode: subSubDepartmentCode,
    };
    const questions = await AuditParameter.find(
      query,
      'Question AllowedResponse Category SubCategory DisplayOrder OnsiteorOffsite roles.crit'
    ).lean();
    const categories = await Category.find({}, 'CategoryDescription CategoryDisplayOrder').lean();
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
    const auditParameters = await AuditParameter.find(filterObj);
    const uniqueQuestions = new Map();
    for (const auditParam of auditParameters) {
      const key = `${auditParam.DepartmentCode}-${auditParam.SubDepartmentCode}-${auditParam.SubSubDepartmentCode}-${auditParam.roles[0].freq}`;
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
        const formattedQuestion = {
          question: auditParam.Question,
          department: department ? department.toObject() : null,
          subDepartment: subDepartment ? subDepartment.toObject() : null,
          subSubDepartment: subSubDepartment ? subSubDepartment.toObject() : null,
          freq: auditParam.roles[0].freq,
        };
        uniqueQuestions.set(key, formattedQuestion);
      }
    }

    const formattedQuestions = Array.from(uniqueQuestions.values());
    return formattedQuestions;
  } catch (error) {
    throw new Error(`Error filtering questions: ${error.message}`);
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
