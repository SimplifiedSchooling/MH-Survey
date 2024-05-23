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
  },
  masterProjectStartDate: {
    type: Date,
  },
  masterProjectEndDate: {
    type: Date,
  },
  masterProjectOwnerName: {
    type: String,
  },
  masterProjectOwnerEmailId: {
    type: String,
  },
  masterProjectOwnerMoNumber: {
    type: Number,
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
