const Type = require('../models/Type.js').Type;
const Status = require('../models/Status.js').Status;
const Request = require('../models/Request.js').Request;

module.exports.index = (_,response) => {
    response.render("index.hbs");
}
module.exports.getUser = (request,response) => {
    response.json(request.user);
}

module.exports.notifications = (_,response) => {
    response.render("notifications.hbs");
}

module.exports.postRequest = async (request, response) => {
    if(!request.body) return response.status(400);
    try {
        const {name, address, tel, email, descr, type, status, executor, date} = request.body;
        const typeRequest = await Type.findOne({value: type}); 
        const statusRequest = await Status.findOne({value: status});
        const result = await Request.create({name, address, tel, email, descr, type: typeRequest.value, status: statusRequest.value, executor, date});
        if(result) {
            console.log('Заявка успешно добавлена');
            response.send(result);
        }
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при добавлении запроса'});
    }
}