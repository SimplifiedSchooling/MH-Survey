const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const coordinatorAssignmentSchema = new mongoose.Schema({
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
  blockCoordinatorEmails: [
    {
      type: String,
      trim: true,
    },
  ],
  districtCoordinatorEmails: [
    {
      type: String,
      trim: true,
    },
  ],
  divisionCoordinatorEmails: [
    {
      type: String,
      trim: true,
    },
  ],
  smeEmails: [
    {
      type: String,
      trim: true,
    },
  ],
});

// add plugin that converts mongoose to json
coordinatorAssignmentSchema.plugin(toJSON);
coordinatorAssignmentSchema.plugin(paginate);

const CoordinatorAssignment = mongoose.model('CoordinatorAssignment', coordinatorAssignmentSchema);

module.exports = CoordinatorAssignment;
