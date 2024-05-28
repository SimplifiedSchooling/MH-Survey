const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 200,
  skipSuccessfulRequests: true,
});

module.exports = {
  authLimiter,
};
