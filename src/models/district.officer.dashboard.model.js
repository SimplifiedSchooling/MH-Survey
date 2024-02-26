const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const distictOfficerAnswerSchema = new mongoose.Schema(
  {
    surveyId: {
      type: String,
    },
    masterProjectId: {
      type: String,
    },
    udise_sch_code: {
      type: Number,
    },
    surveyFormId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'surveyQuetions',
      required: true,
      trim: true,
    },
    surveyConductEmail: {
      type: String,
    },
    auditConductEmail: {
      type: String,
    },
    remark: {
      type: String,
    },
    status: {
      type: String,
    },
    Latitude: {
      type: String,
    },
    Longitude: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
distictOfficerAnswerSchema.plugin(toJSON);
distictOfficerAnswerSchema.plugin(paginate);
/* eslint-disable camelcase */
const DistrictOfficerSurveyAnswer = mongoose.model('DistrictOfficer-SurveyAnswer', distictOfficerAnswerSchema);

module.exports = DistrictOfficerSurveyAnswer;
/* eslint-enable camelcase */
