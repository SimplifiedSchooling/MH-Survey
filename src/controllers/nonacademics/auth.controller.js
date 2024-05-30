const httpStatus = require('http-status');
const authService = require('../../services/nonacademics/auth.service');
const catchAsync = require('../../utils/catchAsync');
const tokenService = require('../../services/token.service');

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const loginWithOtp = catchAsync(async (req, res) => {
  const otpDetails = await authService.loginWithNumber(req.body);
  if (otpDetails.success) {
    res.status(200).send({ data: otpDetails.data, status: 200 });
  } else {
    res.status(400).send({ message: otpDetails.message });
  }
});

const validateOtp = catchAsync(async (req, res) => {
  try {
    const validatedOtp = await authService.validateOtp(req.body);
    if (validatedOtp.success) {
      const tokens = await tokenService.generateAuthTokens(validatedOtp.user);
      res
        .status(httpStatus.CREATED)
        .send({ message: 'OTP verified successfully', success: 200, result: { user: validatedOtp.user, tokens } });
    } else {
      res.status(400).send({ data: validatedOtp });
    }
  } catch (error) {
    throw new Error(`OTP Validation Failed: ${error.message}`);
  }
});

module.exports = {
  login,
  loginWithOtp,
  validateOtp,
};
