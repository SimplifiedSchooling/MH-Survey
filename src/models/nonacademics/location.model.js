const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const locationSchema = mongoose.Schema(
  {
    LocationCode: String,
    ClusterCode: String,
    LocationTypeCode: String,
    SchoolName: String,
    Address: String,
    City: String,
    District: String,
    State: String,
    PinCode: String,
    SPOCName: String,
    SPOCEmail: String,
    SPOCContact: String,
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
