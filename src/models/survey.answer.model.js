const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const surveyAnswerSchema = new mongoose.Schema(
  {
    surveyQuetions: [
      {
        quetion: {
          type: String,
        },
        answer: Array,
        isVisible : Boolean,
      },
    ],
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
    status: {
      type: String,
      default: 'Surveyed',
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
surveyAnswerSchema.plugin(toJSON);
surveyAnswerSchema.plugin(paginate);

const surveyAnswer = mongoose.model('surveyAnswer', surveyAnswerSchema);

module.exports = surveyAnswer;
