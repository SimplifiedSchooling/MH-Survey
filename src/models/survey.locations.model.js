const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const surveyLocationSchema = new mongoose.Schema({
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
    // required: true,
  },
  masterProjectRequireAudit: {
    type: Boolean,
  },
  masterProjectAuditBy: {
    type: String,
  },
  masterProjectRequireApproval: {
    type: Boolean,
  },
  masterProjectApprovedBy: {
    type: String,
  },
  auditStartDate: {
    type: Date,
  },
  auditEndDate: {
    type: Date,
  },
  approvelStartDate: {
    type: Date,
  },
  approvelEndDate: {
    type: Date,
  },
  surveyLocations: [
    {
      udise_sch_code: {
        type: Number,
      },
    },
  ],
});

// add plugin that converts mongoose to json
surveyLocationSchema.plugin(toJSON);
surveyLocationSchema.plugin(paginate);

const SurveyLocation = mongoose.model('SurveyLocation', surveyLocationSchema);

module.exports = SurveyLocation;
