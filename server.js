'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    https = require('https'),
    fs = require('fs'),
    logger = require('mean-logger');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
// Set the node enviornment variable if not set before
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Initializing system variables
var config = require('./config/config'),
    auth = require('./config/middlewares/authorization'),
    mongoose = require('mongoose');

// Bootstrap db connection
var db = mongoose.connect(config.db);

// Bootstrap models
var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

var app = express();

// Express settings
require('./config/express')(app, db);

// Bootstrap routes
require('./config/routes')(app, auth);

// Start the app by listening on <port>
var port = process.env.PORT || config.port;

if(config.ssl){
    https.createServer(config.ssl, app).listen(port);
} else {
    app.listen(port);
}

console.log('Express app started on port ' + port + ' using ' + (config.ssl ? 'HTTPS' : 'HTTP') + ' protocol');

// Initializing logger
// logger.init(app, mongoose);

// Expose app
exports = module.exports = app;
