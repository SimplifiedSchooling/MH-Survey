const Joi = require('joi');

const loginWithOtpParameter = {
    body: Joi.object().keys({
        mobNumber: Joi.number().required(),
    })
};

const loginWithOtpValidationParameter = {
    body: Joi.object().keys({
        mobNumber: Joi.number().required(),
        otp: Joi.number().required()
    })
};

module.exports = {
    loginWithOtpParameter,
    loginWithOtpValidationParameter
}