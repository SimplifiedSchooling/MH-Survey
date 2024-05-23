const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const blockOfficerSchema = new mongoose.Schema({
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
  block_Coordinator_EmailId: {
    type: String,
    required: true,
  },
  block_code: {
    type: Number,
  },
});

// add plugin that converts mongoose to json
blockOfficerSchema.plugin(toJSON);
blockOfficerSchema.plugin(paginate);

const blockOfficer = mongoose.model('blockOfficer', blockOfficerSchema);

module.exports = blockOfficer;
