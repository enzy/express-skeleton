'use strict';

/**
 * IndexController
 */

exports.index = function(req, res) {
	res.render('index', {
		user: req.user
	});
};
