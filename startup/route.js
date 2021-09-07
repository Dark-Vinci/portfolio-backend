const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const error = require('../middleware/error');
const route = require('../route/home');

const corsOptions = {
    exposedHeader: 'x-auth-token'
}

module.exports = function (app) {
    if (app.get('env') == 'development') {
        app.use(morgan('tiny'));
    }

    app.use(cors(corsOptions))
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(helmet());
    app.use('/api/main', route);
    app.use(error);
}    