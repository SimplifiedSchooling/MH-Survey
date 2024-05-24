const { plivoVar } = require('../config/config');
const plivo = require('plivo');

const authId = plivoVar.authId;
const authToken = plivoVar.authToken;

const plivoClient = new plivo.Client(authId, authToken);


module.exports = {
    plivoClient
}