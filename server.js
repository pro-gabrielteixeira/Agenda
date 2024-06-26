require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTIONSTRING)
	.then(() => {
		console.log('Connected to database');
		app.emit('online');
	})
	.catch(e => console.log(e));

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const routes = require('./routes')
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf')
const { checkCsrfError, csrfMiddlewate, middlewareErrors } = require('./src/middleware/middleware')
app.use(helmet());
app.use(
	express.urlencoded(
		{
			extended: true
		}
	)
)
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
	secret: 'Qualquer coisa',
	store: MongoStore.create({mongoUrl: process.env.CONNECTIONSTRING}),
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60* 24 * 7,
		httpOnly: true
	}
})

app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
app.use(csrf());
app.use(middlewareErrors)
app.use(checkCsrfError)
app.use(csrfMiddlewate)
app.use(routes)

app.on('online', () => {
		app.listen(3000, () => {
		console.log('http://localhost:3000/');
		console.log('Servidor executando na porta 3000');
	})
})

