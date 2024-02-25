const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const surveyQuetionsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  questions: [{ type: mongoose.Schema.Types.Mixed }],
  createdById: {
    type: String,
  },
});

// add plugin that converts mongoose to json
surveyQuetionsSchema.plugin(toJSON);
surveyQuetionsSchema.plugin(paginate);

const surveyQuetions = mongoose.model('surveyQuetions', surveyQuetionsSchema);

module.exports = surveyQuetions;
