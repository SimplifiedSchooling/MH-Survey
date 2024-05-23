const { Location } = require('../../models');

const getSchoolsList = async (cluster, level) => {
  try {
    let schoolsArray = [];
    if (level === 'Cluster') {
      const locations = await Location.find({ cluster });
      schoolsArray = locations.map((location) => ({
        schoolName: location.schoolName,
        displayName: location.displayName,
        centreCode: location.centreCode,
      }));
    } else if (level === 'Vertex') {
      const locations = await Location.find({});
      schoolsArray = locations.map((location) => ({
        schoolName: location.schoolName,
        displayName: location.displayName,
        centreCode: location.centreCode,
      }));
    }
    return schoolsArray;
  } catch (error) {
    throw new Error(`Failed: ${error.message}`);
  }
};

module.exports = {
  getSchoolsList,
};
