const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const newMasterSurveySchema = new mongoose.Schema({
  masterProjectName: {
    type: String,
    required: true,
  },
  masterProjectId: {
    type: String,
    unique: true,
  },
  masterProjectPurpose: {
    type: String,
    required: true,
  },
  masterProjectStartDate: {
    type: Date,
    required: true,
  },
  masterProjectEndDate: {
    type: Date,
    required: true,
  },
  masterProjectOwnerName: {
    type: String,
    required: true,
  },
  masterProjectOwnerEmailId: {
    type: String,
    required: true,
  },
  masterProjectOwnerMoNumber: {
    type: Number,
    required: true,
  },
  masterProjectConductBy: {
    type: String,
    default: '',
  },
  masterProjectRequireAudit: {
    type: Boolean,
    default: false,
  },
  masterProjectAuditBy: {
    type: String,
    default: '',
  },
  masterProjectRequireApproval: {
    type: Boolean,
    default: false,
  },
  masterProjectApprovedBy: {
    type: String,
    default: '',
  },
  auditStartDate: {
    type: Date,
    default: null,
  },
  auditEndDate: {
    type: Date,
    default: null,
  },
  approvelStartDate: {
    type: Date,
    default: null,
  },
  approvelEndDate: {
    type: Date,
    default: null,
  },
  finalSubmit: {
    type: Boolean,
    default: false,
  },
  projectDetailsSubmit: {
    type: Boolean,
    default: false,
  },
  projectStatus: {
    type: String,
    enum: ['Not-Started', 'Started', 'In-progress', 'Completed'],
    default: 'Not-Started',
  },
});

// add plugin that converts mongoose to json
newMasterSurveySchema.plugin(toJSON);
newMasterSurveySchema.plugin(paginate);

const MasterProject = mongoose.model('MasterProject', newMasterSurveySchema);

module.exports = MasterProject;
