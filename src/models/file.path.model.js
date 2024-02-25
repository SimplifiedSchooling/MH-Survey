const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const filePathSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'surveyQuetions',
    required: true,
  },
  questionName: { type: String, required: true },
  file: { type: String, required: true },
});

// add plugin that converts mongoose to json
filePathSchema.plugin(toJSON);
filePathSchema.plugin(paginate);

const FilePath = mongoose.model('FilePath', filePathSchema);
module.exports = FilePath;
