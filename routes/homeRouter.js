const express = require("express");
const homeControllers = require('../controllers/homeControllers.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const homeRouter = express.Router();

homeRouter.use(express.static('d:/Web/PAPS/views'));
homeRouter.use('/notifications' ,express.static('d:/Web/PAPS/views'));

homeRouter.get('/', homeControllers.index);
homeRouter.get('/notifications', homeControllers.notifications);
homeRouter.get('/get/user',authMiddleware,homeControllers.getUser);

module.exports = homeRouter;