const Router = require('express').Router;

module.exports = sequelize => {
	
	const router = new Router();
	router.post('/users', getUsers);

	return router;

	async function getUsers() {
		return await sequelize.models.user.findAll();
	}
}