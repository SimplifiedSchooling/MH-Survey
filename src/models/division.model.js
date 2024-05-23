/* eslint-disable object-shorthand */
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const divisionSchema = new mongoose.Schema({
  divisionName: {
    type: String,
    required: true,
  },
  divisionCode: {
    type: String,
    unique: true,
  },
});

// add plugin that converts mongoose to json
divisionSchema.plugin(toJSON);
divisionSchema.plugin(paginate);

// pre-save middleware to generate unique 5-digit divisionCode
divisionSchema.pre('save', async function (next) {
  if (!this.divisionCode) {
    // If divisionCode is not provided, generate a unique 5-digit number
    const randomNumbers = Math.floor(10000 + Math.random() * 90000); // generate random 5-digit number
    this.divisionCode = `${randomNumbers}`;
  }
  next();
});

const Division = mongoose.model('Division', divisionSchema);

module.exports = Division;
