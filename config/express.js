'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    mongoStore = require('connect-mongo')(express),
    flash = require('connect-flash'),
    exphbs  = require('express3-handlebars'),
    helpers = require('./helpers'),
    less = require('less-middleware'),
    os = require('os'),
    config = require('./config');

module.exports = function(app, db) {
    app.set('showStackError', true);

    // Expose development mode to all views
    var isDevelopment = app.locals.isDevelopment = process.env.NODE_ENV === 'development';

    // Compile LESS files to CSS
    var tmpDir = os.tmpDir();
    app.use(less({
        src: __dirname + '/../public/styles',
        dest: tmpDir,
        prefix: '/css',
        compress: true,
        once: !isDevelopment,
        sourceMap: isDevelopment
    }));

    //Should be placed before express.static
    app.use(express.compress({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        // Levels are specified in a range of 0 to 9, where-as 0 is
        // no compression and 9 is best compression, but slowest
        level: 9
    }));

    // Only use logger for development environment
    if (process.env.NODE_ENV === 'development') {
        app.use(express.logger('dev'));
    }

    // Set views path, template engine and default layout
    app.set('views', config.root + '/app/views');
    app.engine('.hbs', exphbs({
        layoutsDir: config.root + '/app/views/_layouts',
        partialsDir: config.root + '/app/views/_partials',
        defaultLayout: 'default',
        extname: '.hbs',
        helpers: helpers
    }));
    app.set('view engine', '.hbs');

    // Enable jsonp
    app.enable("jsonp callback");

    app.configure(function() {
        // The cookieParser should be above session
        app.use(express.cookieParser());

        // Request body parsing middleware should be above methodOverride
        app.use(express.urlencoded());
        app.use(express.json());
        app.use(express.methodOverride());

        // Express/Mongo session storage
        app.use(express.session({
            secret: config.sessionSecret,
            store: new mongoStore({
                db: db.connection.db,
                collection: config.sessionCollection
            })
        }));

        // Connect flash for flash messages
        app.use(flash());

        // Routes should be at the last
        app.use(app.router);

        // Setting the fav icon and static folder
        app.use(express.favicon());
        app.use(express.static(config.root + '/public'));
        app.use('/css', express.static(tmpDir));

        // Assume "not found" in the error msgs is a 404. this is somewhat
        // silly, but valid, you can do whatever you like, set properties,
        // use instanceof etc.
        app.use(function(err, req, res, next) {
            // Treat as 404
            if (~err.message.indexOf('not found')) return next();

            // Log it
            console.error(err.stack);

            // Error page
            res.status(500).render('500', {
                error: err.stack
            });
        });

        // Assume 404 since no middleware responded
        app.use(function(req, res, next) {
            res.status(404).render('404', {
                url: req.originalUrl,
                error: 'Not found'
            });
        });

    });
};
