const bluebird = require('bluebird');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// import libraries
const respond = require('./libraries/respond');
const logger = require('./libraries/logger');

// db start & configs
try {
    mongoose.Promise = bluebird;
    let isConnectedBefore = false;
    let connect = function () {
        mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
            useNewUrlParser: true,
        });
    };
    connect();
    mongoose.connection.on('error', function () {
        logger.info('Could not connect to MongoDB');
    });
    mongoose.connection.on('disconnected', function () {
        logger.info('Lost MongoDB connection...');
        if (!isConnectedBefore) connect();
    });
    mongoose.connection.on('connected', function () {
        isConnectedBefore = true;
        logger.info('Connection established to MongoDB');
    });
    mongoose.connection.on('reconnected', function () {
        logger.info('Reconnected to MongoDB');
    });

    // Close the Mongoose connection, when receiving SIGINT
    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            logger.info('Force to close the MongoDB conection');
            process.exit(0);
        });
    });
} catch (err) {
    throw err;
}

// routers
const router = express.Router();

// app
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// api routes
router.get('/hello', function (req, res, next) {
    respond.responseSuccess(res, 'Hello World!', {message: 'Hello World!'}, undefined);
});
app.use('/api', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    logger.info("NOT FOUND!");
    respond.responseNotFound(res);
});

// error handler
app.use(function (err, req, res, next) {
    logger.info(err);
    respond.responseError(res);
});

// finalize
module.exports = app;
