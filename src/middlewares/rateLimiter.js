const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  skipSuccessfulRequests: true,
});

module.exports = {
  authLimiter,
};
