const httpStatus = require('http-status');
const csv = require('csvtojson');
const { AuditParameter } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create a AuditParameter
 * @param {Object} AuditParameterBody
 * @returns {Promise<AuditParameter>}
 */
// const createAuditParameter = async (schoolArray, csvFilePath = null) => {
//   try {
//     let modifiedSchoolArray = schoolArray;
//     if (csvFilePath) {
//       modifiedSchoolArray = csvFilePath;
//     }
//     const batchSize = 1000;
//     if (!modifiedSchoolArray || !modifiedSchoolArray.length) {
//       throw new Error('Missing array');
//     }
//     const jsonArray = await csv().fromFile(modifiedSchoolArray);
// console.log(jsonArray);
//     // Split the array into batches
//     for (let i = 0; i < jsonArray.length; i += batchSize) {
//       const batch = jsonArray.slice(i, i + batchSize);

//       // Use bulk write for efficient insertion
//       // eslint-disable-next-line no-await-in-loop
//       await AuditParameter.bulkWrite(
//         batch.map((doc) => ({
//           insertOne: {
//             document: doc,
//           },
//         }))
//       );
//     }
//   } catch (error) {
//     // Handle any other errors
//     throw new Error(`Bulk upload failed: ${error.message}`);
//   }
// };

// const createAuditParameter = async (schoolArray, csvFilePath = null) => {
//   try {
//     let modifiedSchoolArray = schoolArray;
//     if (csvFilePath) {
//       modifiedSchoolArray = csvFilePath;
//     }
//     const batchSize = 1000;
//     if (!modifiedSchoolArray || !modifiedSchoolArray.length) {
//       throw new Error('Missing array');
//     }
//     const jsonArray = await csv().fromFile(modifiedSchoolArray);
    
//     const documents = [];

//     for (const row of jsonArray) {
//       const rolesData = [];
//       const roleCodes = row.RoleCode.split(','); // Assuming RoleCode is a comma-separated string
//       const roleDescriptions = row.RoleDescription.split(','); // Assuming RoleDescription is a comma-separated string
//       const frequencies = row.Frequency.split(','); // Assuming Frequency is a comma-separated string
//       const criticalities = row.Criticality.split(','); // Assuming Criticality is a comma-separated string
      
//       // Iterate over each role and create a roles object
//       // for (let i = 0; i < roleCodes.length; i++) {
//         const role = {
//           RoleCode: roleCodes,
//           RoleDescription: roleDescriptions,
//           Frequency: frequencies,
//           Criticality: criticalities,
//         };
//         // rolesData.push(role);
//       // }
// console.log(roleCodes)
//       // Extract question data
//       const questionData = {
//         Question: row.Question,
//         AllowedResponse: row.AllowedResponse,
//         DisplayOrder: row.DisplayOrder,
//         EvidenceRequired: row.EvidenceRequired,
//         DepartmentCode: row.DepartmentCode,
//         SubDepartmentCode: row.SubDepartmentCode,
//         SubSubDepartmentCode: row.SubSubDepartmentCode,
//         Category: row.Category,
//         SubCategory: row.SubCategory,
//         SubSubCategory: row.SubSubCategory,
//         OnsiteorOffsite: row.OnsiteorOffsite,
//         Roles: role,
//       };
//       // Extract roles data
 
//       console.log("questionData",questionData);
//       // Merge question and roles data
//       const document = {
//         ...questionData,
//         Roles: rolesData,
//       };
//       documents.push(document);
//     }
    
//     for (let i = 0; i < documents.length; i += batchSize) {
//       const batch = documents.slice(i, i + batchSize);
    
//       await AuditParameter.bulkWrite(
//         batch.map((doc) => ({
//           insertOne: {
//             document: doc,
//           },
//         }))
//       );
//     }
//   } catch (error) {
//     throw new Error(`Bulk upload failed: ${error.message}`);
//   }
// };
// (async function() {
//   const workbook = new Excel.Workbook();
//   await workbook.xlsx.readFile('data.xlsx');

//   const worksheet = workbook.getWorksheet(1);

//   worksheet.eachRow({ includeEmpty: true }, async function(row, rowNumber) {
//       if (rowNumber > 1) {
//           const roles = [];
//           let col = 21; // Starting column number for roles data

//           while (row.getCell(col).value !== undefined) {
//               const role = {
//                   RoleCode: row.getCell(col).value,
//                   RoleDescription: row.getCell(col + 1).value,
//                   Frequency: row.getCell(col + 2).value,
//                   Criticality: row.getCell(col + 3).value
//               };

//               roles.push(role);
//               col += 4; // Move to the next set of role data columns
//           }

//           const rowData = {
//               // Question: Is ${row.getCell(16).value} maintained,
//               AllowedResponse: 'YES_NO',
//               DisplayOrder: row.getCell(17).value,
//               EvidenceRequired: true,
//               DepartmentCode: row.getCell(2).value,
//               SubDepartmentCode: row.getCell(5).value,
//               SubSubDepartmentCode: row.getCell(8).value || '',
//               Category: row.getCell(12).value,
//               SubCategory: row.getCell(14).value,
//               IsOnsite: true,
//               Roles: roles
//           };

//           // Save the data to MongoDB
//           // const newData = new Data(rowData);
//           // await newData.save();
//       }
//   });

//   console.log('Data saved to MongoDB');
// })();
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
 * Get book by filter
 * @param {ObjectId} AuditParameterName
 * @returns {Promise<AuditParameter>}
 */

const getAuditParameterByName = async (AuditParameterName) => {
  return AuditParameter.find({ AuditParameterName });
};

module.exports = {
  // createAuditParameter,
  queryAuditParameter,
  getAuditParameterById,
  updateAuditParameterById,
  deleteAuditParameterById,
  getAuditParameterByName,
};
