const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const locationSchema = mongoose.Schema(
  {
    centreCode: { type: String },
    cluster: { type: String },
    locationTypeCode: { type: String },
    displayName: { type: String },
    schoolName: { type: String },
    address: { type: String },
    city: { type: String },
    district: { type: String },
    state: { type: String },
    pinCode: { type: String },
    spocName: { type: String },
    spocEmail: { type: String },
    spocContact: { type: String },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
locationSchema.plugin(toJSON);
locationSchema.plugin(paginate);

/**
 * @typedef Location
 */

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
