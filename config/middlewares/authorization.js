'use strict';

/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.url; // Store this originally requested URL in the session so we know where to return the user later.
        return res.redirect('/auth/login');
    }
    next();
};
