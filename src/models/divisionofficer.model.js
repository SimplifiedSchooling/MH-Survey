const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const divisionOfficerSchema = new mongoose.Schema({
  masterProjectId: {
    type: String,
    required: true,
    trim: true,
  },
  surveyAdmin: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  division_Coordinator_EmailId: {
    type: String,
    required: true,
  },
  division_code: {
    type: Number,
  },
});

// add plugin that converts mongoose to json
divisionOfficerSchema.plugin(toJSON);
divisionOfficerSchema.plugin(paginate);

const divisionOfficer = mongoose.model('divisionOfficer', divisionOfficerSchema);

module.exports = divisionOfficer;
