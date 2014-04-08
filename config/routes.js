'use strict';

module.exports = function(app, authPolicy) {

    /**
     * Index routes
     */
    var index = require('../app/controllers/index');
    app.get('/', index.index);

};
