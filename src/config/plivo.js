const plivo = require('plivo');
const { plivoVar } = require('./config');

const { authId } = plivoVar;
const { authToken } = plivoVar;

const plivoClient = new plivo.Client(authId, authToken);

module.exports = {
  plivoClient,
};
