const Request = require('../models/Request.js').Request;
const Type = require('../models/Type.js').Type;
const Status = require('../models/Status.js').Status;
const User = require('../models/User.js').User;

module.exports.requests = async function (request, response) {
    const new_requests = await Request.find({status: 'Новая'}),
    inwork_requests = await Request.find({status: 'В работе'}),
    done_requests = await Request.find({status: 'Выполнена'}),
    send_requests = await Request.find({status: 'Передана'}),
    cancel_requests = await Request.find({status: 'Отмена'});

    response.render("dispatcher.hbs", {
    request_new_count: new_requests.length,
    request_inwork_count: inwork_requests.length,
    request_done_count: done_requests.length,
    request_send_count: send_requests.length,
    request_cancel_count: cancel_requests.length
    });
}

module.exports.getRequests = async (_,response) => {
    
    try {
        const requests = await Request.find({});
        response.send(requests);
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при получении всех запросов'});
    }
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

module.exports.putRequest = async (request, response) => {
    if(!request.body) return response.status(400);
    try {
        const id = request.params.id;
        const {executor, status} = request.body;
        const executorRequest = await User.findOne({name: executor});
        const statusRequest = await Status.findOne({value: status});
        const result = await Request.updateOne({_id:id}, {executor: executorRequest.name, status: statusRequest.value});
        if(result) {
            console.log('Заявка успешно изменена');
            response.send(result);
        }
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при изменении запроса'});
    }
}

module.exports.deleteRequest = async (request,response) => {
    if(!request.body) return response.status(400);
    try {
        const id = request.params.id;
        const result = await Request.deleteOne({_id: id});
        if(result) {
            console.log('Заявка успешно удалена');
            response.send(result);
        }
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при удалении запроса'});
    }
}

module.exports.getExecutors = async (_,response) => {
    try {
        const executors = await User.find({roles: ['Специалист']});
        response.send(executors);
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при получении всех запросов'});
    }
}

// module.exports.getExecutor = async (request,response) => {
//     if(!request.body) return response.status(400);
//     try {
//         const id = request.params.id;
//         const result = await Request.findOne({_id: id});
//         if(result) {
//             console.log('Получен исполнитель');
//             response.send(result);
//         }
//     } catch(e) {
//         console.log(e);
//         response.status(400).json({message: 'Ошибка при получении исполнителя'});
//     }
// }


module.exports.users = function (_, response) {
    response.render('users.hbs');
}

