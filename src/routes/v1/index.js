const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const SchoolRoute = require('./school.route');
const newSurveyRoute = require('./add.new.survey.route');
const divisionRoute = require('./division.route');
const districtRoute = require('./districts.route');
const blockRoute = require('./blocks.route');
const surveyLocationRoute = require('./survey.locations.route');
const coordinatorAssignmentRoute = require('./survey.officers.route');
const masterProjectRoute = require('./master.project.route');
const surveyQuetionsRoute = require('./survey.quetions.route');
const surveyAnswersRoute = require('./survey.answer.route');
const officerRoute = require('./officer.route');
const smeAnswersRoute = require('./sme.survey.answer.route');
const dashboardRoute = require('./dashboard.route');
const filePathRoute = require('./file.path.route');
const smeFilePathRoute = require('./sme.file.path.route');
const districtofficerDashboardRoute = require('./district.officer.dashboard.route');

const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/school',
    route: SchoolRoute,
  },
  {
    path: '/newsurvey',
    route: newSurveyRoute,
  },
  {
    path: '/division',
    route: divisionRoute,
  },
  {
    path: '/district',
    route: districtRoute,
  },
  {
    path: '/block',
    route: blockRoute,
  },
  {
    path: '/surveylocation',
    route: surveyLocationRoute,
  },
  {
    path: '/assign-coordinators',
    route: coordinatorAssignmentRoute,
  },
  {
    path: '/master-project',
    route: masterProjectRoute,
  },
  {
    path: '/survey-questions',
    route: surveyQuetionsRoute,
  },
  {
    path: '/survey-answers',
    route: surveyAnswersRoute,
  },
  {
    path: '/officer',
    route: officerRoute,
  },
  {
    path: '/sme-answers',
    route: smeAnswersRoute,
  },
  {
    path: '/dashboard',
    route: dashboardRoute,
  },
  {
    path: '/file-path',
    route: filePathRoute,
  },
  {
    path: '/sme-file-path',
    route: smeFilePathRoute,
  },
  {
    path: '/districtofficer-dashboard',
    route: districtofficerDashboardRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
