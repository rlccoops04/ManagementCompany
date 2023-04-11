const express = require("express");
const dispatcherController = require('../controllers/dispatcherControllers.js');
const dispatcherRouter = express.Router();
const roleMiddleware = require('../middlewares/roleMiddleware.js');


dispatcherRouter.use(express.static('d:/Web/PAPS/views'));
dispatcherRouter.get('/',dispatcherController.requests);
dispatcherRouter.get('/users', dispatcherController.users);

dispatcherRouter.get("/get/requests", roleMiddleware(['Диспетчер']), dispatcherController.getRequests);
dispatcherRouter.put('/put/request/:id', roleMiddleware(['Диспетчер']), dispatcherController.putRequest);
dispatcherRouter.post('/post/request', roleMiddleware(['Диспетчер']), dispatcherController.postRequest);
dispatcherRouter.delete('/delete/request/:id', roleMiddleware(['Диспетчер']), dispatcherController.deleteRequest);

dispatcherRouter.get('/get/executors', dispatcherController.getExecutors);

dispatcherRouter.get('/get/users', dispatcherController.getUsers);
// dispatcherRouter.get('/get/executor:id', dispatcherController.getExecutor);
// dispatcherRouter.post('/post/user', authController.registration);

module.exports = dispatcherRouter;