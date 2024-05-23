const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const districtOfficerSchema = new mongoose.Schema({
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
  district_Coordinator_EmailId: {
    type: String,
    required: true,
  },
  district_code: {
    type: Number,
  },
});

// add plugin that converts mongoose to json
districtOfficerSchema.plugin(toJSON);
districtOfficerSchema.plugin(paginate);

const districtOfficer = mongoose.model('districtOfficer', districtOfficerSchema);

module.exports = districtOfficer;
