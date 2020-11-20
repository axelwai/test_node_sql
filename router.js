const Router = require('express').Router;

module.exports = sequelize => {
	
	const router = new Router();
	router.post('/users', getUsers);

	return router;

	async function getUsers(req, res, next) {
		const users = await sequelize.models.user.findAll();
		res.json(users);
	}
}