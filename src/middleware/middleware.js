const { rawListeners } = require("../models/HomeModel");

exports.checkCsrfError = (err, req, res, next) => {
	if (err) {
		return res.render('./includes/404');
	}
	next();
}

exports.csrfMiddlewate = (req, res, next) => {
	res.locals.csrfToken = req.csrfToken();
	next();
}

exports.middlewareErrors = (req, res, next) => {
	res.locals.errors = req.flash('errors');
	res.locals.success = req.flash('success');
	res.locals.user = req.session.user;
	next();
}

exports.loginRequired = (req, res, next) => {
	if (!res.locals.user) {
		req.flash('errors', 'É preciso estar logado para efetuar alterações!');
		return req.session.save(() => res.redirect('/'));
	} 
	next();
}