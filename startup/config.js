const config = require('config');

module.exports = function () {
    if (!config.get('jwtPassword')) {
        throw new Error('[FATAL ERROR]: go define jwt key')
    }
}