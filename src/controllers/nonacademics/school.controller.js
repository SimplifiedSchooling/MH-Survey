const httpStatus = require('http-status');

const catchAsync = require('../../utils/catchAsync');
const { getSchoolsList } = require('../../services/nonacademics/school.service');

const getSchoolList = catchAsync(async (req, res) => {
  try {
    if (req.query) {
      const { cluster, level } = req.query;
      const getList = await getSchoolsList(cluster, level);
      res.status(httpStatus.CREATED).send({ data: getList, length: getList.length });
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, 'Missing Data');
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
});

module.exports = {
  getSchoolList,
};
