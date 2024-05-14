const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      trim: true,
      required: true,
    },
    answer: {
      type: String,
      trim: true,
      required: true,
    },
    imageLink: {
      type: String,
      trim: true,
      // required: true,
    },
    criticality: {
      type: String,
      trim: true,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      // required: true,
    },
    OnsiteorOffsite: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      required: true,
    },
    subCategory: {
      type: String,
      trim: true,
      required: true,
    },
    DisplayOrder: {
      type: Number,
      trim: true,
      required: true,
    },
    
  },
  { timestamps: true }
);

const auditAnswers = new mongoose.Schema(
  {
    schoolId: {
      type: String,
      trim: true,
      required: true,
    },
    deptCode: {
      type: String,
      trim: true,
      required: true,
    },
    subDeptCode: {
      type: String,
      trim: true,
      required: true,
    },
    subSubDeptCode: {
      type: String,
      trim: true,
      required: true,
    },
    frequency: {
      type: String,
      trim: true,
      required: true,
    },
    roleCode: {
      type: String,
      trim: true,
      required: true,
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    finalSubmit: {
      type: Boolean,
      default: false,
    },
    answers: [answerSchema],
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
auditAnswers.plugin(toJSON);
auditAnswers.plugin(paginate);

/**
 * @typedef AuditAnswer
 */

const AuditAnswer = mongoose.model('auditAnswer', auditAnswers);

module.exports = AuditAnswer;
