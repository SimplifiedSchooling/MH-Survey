const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const smeOfficerSchema = new mongoose.Schema({
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
  sme_EmailId: {
    type: String,
    required: true,
  },
  block_code: {
    type: Number,
  },
  // email: {
  //   type: String,
  //   required: true,
  // },
});

// add plugin that converts mongoose to json
smeOfficerSchema.plugin(toJSON);
smeOfficerSchema.plugin(paginate);

const smeOfficer = mongoose.model('smeOfficer', smeOfficerSchema);

module.exports = smeOfficer;
