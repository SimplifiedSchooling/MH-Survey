const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    mobNumber: Joi.number().required(),
    role: Joi.string(),
    // .required()
    // .valid('user', 'surveyadmin', 'superadmin', 'state', 'district', 'division', 'block', 'SME'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const checkUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      mobNumber: Joi.number(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      roleAssingedTo: Joi.string(),
      role: Joi.string().required().valid('user', 'surveyadmin', 'district', 'division', 'block', 'SME', 'superadmin'),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  checkUser,
  updateUser,
  deleteUser,
};
