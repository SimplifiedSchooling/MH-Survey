const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const newSurveySchema = new mongoose.Schema({
  masterProjectOwnerEmailId: {
    type: String,
    required: true,
    format: 'email',
  },
  masterProjectId: {
    type: String,
  },
  surveyName: {
    type: String,
  },
  surveyId: {
    type: String,
  },
  surveyPurpose: {
    type: String,
  },
  surveyStartDate: {
    type: Date,
  },
  surveyEndDate: {
    type: Date,
  },
  surveyFormId: {
    type: String,
    default: '',
  },
  actualStartDate: {
    type: Date,
    default: null,
  },
  actualEndDate: {
    type: Date,
    default: null,
  },
});

// add plugin that converts mongoose to json
newSurveySchema.plugin(toJSON);
newSurveySchema.plugin(paginate);

// pre-save middleware to generate unique surveyId

const NewSurvey = mongoose.model('NewSurvey', newSurveySchema);

module.exports = NewSurvey;
