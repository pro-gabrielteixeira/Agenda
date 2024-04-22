const Login = require('../models/LoginModel');

exports.index = (req, res) => {
	console.log(req.session.user);
	if (req.session.user) return res.redirect('/');
	res.render('../views/login');
};

exports.register = async function (req, res) {
	try {
		const login = new Login(req.body);
		await login.register();

		if (login.errors.length > 0) {
			req.flash('errors', login.errors);
			return req.session.save(function () {
				return res.redirect('/login/');
			});
		}
		req.flash('success', 'Seu usuário foi criado com sucesso!');
			return req.session.save(function () {
				return res.redirect('/login/');
			});
	} catch (e) {
		console.log(e);
		return res.render('../views/includes/404')
	}
};

exports.login = async function (req, res) {
	try {
		const login = new Login(req.body);
		await login.login();

		if (login.errors.length > 0) {
			req.flash('errors', login.errors);
			return req.session.save(function () {
				return res.redirect('/login/');
			});
		}
		req.flash('success', 'Efetuado o login com sucesso!');
		req.session.user = login.user;
			return req.session.save(function () {
				return res.redirect('/');
			});
	} catch (e) {
		console.log(e);
		return res.render('../views/includes/404')
	}
};

exports.logout = function(req, res) {
	req.session.destroy();
	res.redirect('/');
};