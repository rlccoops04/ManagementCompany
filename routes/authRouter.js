const express = require("express");
const authController = require('../controllers/authControllers.js');
const authRouter = express.Router();
const authMiddleware = require('../middlewares/authMiddleware.js');
const roleMiddleware = require('../middlewares/roleMiddleware.js');

authRouter.post('/registration', authController.registration);
authRouter.post('/login', authController.login);
authRouter.get('/users', roleMiddleware(['Admin']), authController.getUsers);
 
module.exports = authRouter;