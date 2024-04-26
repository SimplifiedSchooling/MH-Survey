// const mongoose = require('mongoose');
// const { toJSON, paginate } = require('../plugins');

// const auditParameterSchema = mongoose.Schema(
//   {
//     Question: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     AllowedResponse: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     DisplayOrder: {
//       type: Number,
//       required: true,
//       trim: true,
//     },
//     EvidenceRequired: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     DepartmentCode: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     SubDepartmentCode: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     SubSubDepartmentCode: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     Category: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     SubCategory: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     SubSubCategory: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     OnsiteorOffsite: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     // Roles:[
//     //   {
//     //     RoleCode:{
//     //       type: String,
//     //       required: true,
//     //       trim: true,
//     //     },
//     //     RoleDescription:{
//     //       type: String,
//     //       required: true,
//     //       trim: true,
//     //     },
//     //     Frequency:{
//     //       type: String,
//     //       required: true,
//     //       trim: true,
//     //     },
//     //     Criticality:{
//     //       type: String,
//     //       required: true,
//     //       trim: true,
//     //     },
//     //   }
//     // ]
//     Roles: []
//   },
//   {
//     timestamps: true,
//   }
// );

// // add plugin that converts mongoose to json
// auditParameterSchema.plugin(toJSON);
// auditParameterSchema.plugin(paginate);

// /**
//  * @typedef AuditParameter
//  */

// const AuditParameter = mongoose.model('AuditParameter', auditParameterSchema);

// module.exports = AuditParameter;
