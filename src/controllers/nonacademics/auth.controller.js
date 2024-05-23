const authService = require('../../services/nonacademics/auth.service');
const catchAsync = require('../../utils/catchAsync');
const tokenService = require('../../services/token.service');

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

module.exports = {
  login,
};
