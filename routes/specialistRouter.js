const express = require("express");
const specialistController = require('../controllers/specialistControllers.js');
const specialistRouter = express.Router();
const roleMiddleware = require('../middlewares/roleMiddleware.js');

specialistRouter.use(express.static('d:/Web/PAPS/views'));
specialistRouter.get('/', specialistController.specialist);
specialistRouter.get("/get/requests",roleMiddleware(['Плотник']), specialistController.getRequests);
specialistRouter.put('/put/request/:id', specialistController.putRequest);
specialistRouter.post('/generateCode',specialistController.submitRequest);

module.exports = specialistRouter;