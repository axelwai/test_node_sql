// import

require('dotenv').config();

// export

// const

const {
	DB_HOSTNAME,
	DB_DATABASE,
	DB_USERNAME,
	DB_PASSWORD,

	PORT,
} = process.env;

// state

let sequelize = null;

// init

init();

async function init() {
	sequelize = await initDatabase(DB_HOSTNAME, DB_DATABASE, DB_USERNAME, DB_PASSWORD);
	await initServer(sequelize, PORT);
}

async function initDatabase(hostname, database, username, passwword) {

	const { Sequelize, Model, DataTypes } = require('sequelize');
	const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
		'host': DB_HOSTNAME,
		'dialect': 'mysql',
		'logging': (...msg) => console.log('[sequelize]', ...msg),
	});

	sequelize.define('user', {
		'firstName': DataTypes.STRING,
		'lastName': DataTypes.STRING,
	});

	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
	}
	catch(error) {
		return console.error('Unable to connect to the database:', error);
	}

	try {
		await sequelize.sync();
		console.log('All models were synchronized successfully.');
	}
	catch(err) {
		return console.error('Unable to synchronize the database:', error);
	}

	const usersCount = await sequelize.models.user.count();
	console.log(`found ${usersCount} user${usersCount?'s':''} in database`);

	if(!usersCount) {
		const newUser = await sequelize.models.user.create({
			'firstName': 'Axel',
			'lastName': 'Wainmann',
		});
		console.log(`created user: ${newUser.firstName} ${newUser.lastName}`);
	}

	return sequelize;
}

async function initServer(sequelize, port) {
	const express = require('express');
	const router = require('./router');
	const app = express();

	app.use(express.static('public'));
	app.use('/api', router(sequelize));

	app.listen(port, err => {
		if(err) {
			return console.error(`Unable to listen to port ${port}:`, error);
		}
		return console.log(`app listening at http://localhost:${port}`);
	});
}

process.on('uncaughtException', (...msg) => {
	console.error('[uncaughtException]', ...msg);
});