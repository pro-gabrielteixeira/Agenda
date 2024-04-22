const Contato = require('../models/ContatoModel')

exports.index = (req, res) => {
	res.render('../views/contato', { contato: {}});
}

exports.register = async (req, res) => {
	try {
		const contato = new Contato(req.body);
		await contato.register();
		if (contato.errors.length > 0) {
			req.flash('errors', contato.errors);
			req.session.save(() => res.redirect('/contato'))
			return;
		}
		req.flash('success', 'Contato registrado com sucesso!');
		req.session.save(() => res.redirect('/contato/' + contato.contato._id))
		return;
	} catch (e) {
		console.log(e);
	}
}

exports.editContato = async (req, res) => {
	if (!req.params.id) return res.render('../views/includes/404');
	
	try {
		const contato = await Contato.buscaPorId(req.params.id);
		res.render('contato', { contato });
	} catch (e) {
		console.log(e);
		return res.render('../views/includes/404');
	}
	
}

exports.edit = async (req, res) => {
	if (!req.params.id) return res.render('../views/includes/404');

	try {
		const contato = new Contato(req.body);
		await contato.edit(req.params.id);
		if (contato.errors.length > 0) {
			req.flash('errors', contato.errors);
			return req.session.save(() => res.redirect('/contato/' +  req.params.id))
		}
		req.flash('success', 'Contato atualizado com sucesso!');
		return req.session.save(() => res.redirect('/contato/' + contato.contato._id))
	} catch (e) {
		console.log(e);
		return res.render('../views/includes/404');
	}
}

exports.delete = async (req, res) => {
	if (!req.params.id) return res.render('../views/includes/404');
	
	try {
		const contato = await Contato.delete(req.params.id);
		if (!contato) return res.render('../views/includes/404');
		req.flash('success', 'Contato apagado com sucesso!');
		return req.session.save(() => res.redirect('/'))
	} catch (e) {
		console.log(e);
		return res.render('../views/includes/404');
	}
}