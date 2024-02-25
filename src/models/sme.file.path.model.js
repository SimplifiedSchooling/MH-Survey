const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const smeFilePathSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'surveyQuetions',
    required: true,
  },
  questionName: { type: String, required: true },
  file: { type: String, required: true },
});

// add plugin that converts mongoose to json
smeFilePathSchema.plugin(toJSON);
smeFilePathSchema.plugin(paginate);

const SMEFilePath = mongoose.model('SMEFilePath', smeFilePathSchema);
module.exports = SMEFilePath;
