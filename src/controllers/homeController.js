const Contato = require('../models/ContatoModel');

exports.index = async (req, res) => {

	const contatos = await Contato.buscaPorContatos();

	res.render('index', { contatos });
}
