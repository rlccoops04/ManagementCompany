const { PlanRequest } = require('../models/PlanRequest.js');

const Request = require('../models/Request.js').Request;
const Type = require('../models/Type.js').Type;
const Status = require('../models/Status.js').Status;
const User = require('../models/User.js').User;
const Employee = require('../models/Employee.js').Employee;
const Resident = require('../models/Resident.js').Resident;
const Address = require('../models/Address.js').Address;
const TypeWork = require('../models/TypeWork.js').TypeWork;
const Priority = require('../models/Priority.js').Priority;
const Report = require('../models/Report.js').Report;

module.exports.requests = async function (request, response) {
    const new_requests = await Request.find({status: 'Новая'}),
    inwork_requests = await Request.find({status: 'В работе'}),
    done_requests = await Request.find({status: 'Выполнена'}),
    send_requests = await Request.find({status: 'Передана'}),
    cancel_requests = await Request.find({status: 'Отмена'});
    const inwork_planrequests = await PlanRequest.find({status: 'В работе'}),
    done_planrequests = await PlanRequest.find({status: 'Выполнена'}),
    send_planrequests = await PlanRequest.find({status: 'Передана'}),
    cancel_planrequests = await PlanRequest.find({status: 'Отмена'});

    response.render("dispatcher.hbs", {
    request_new_count: new_requests.length,
    request_inwork_count: inwork_requests.length + inwork_planrequests.length,
    request_done_count: done_requests.length + done_planrequests.length,
    request_send_count: send_requests.length + send_planrequests.length,
    request_cancel_count: cancel_requests.length + cancel_planrequests.length
    });
}

module.exports.getRequests = async (_,response) => {
    try {
        let requests = await Request.find().populate({
            path: 'resident',
            populate: { path: 'address' }
        }).populate({
            path: 'dispatcher'
        }).populate({
            path: 'executor'
        });
        response.send(requests);
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при получении всех запросов'});
    }
}

module.exports.getPlanRequests = async (_,response) => {
    try {
        let requests = await PlanRequest.find().populate({
            path: 'address'
        }).populate({
            path: 'executors'
        }).populate({
            path: 'dispatcher'
        });
        response.send(requests);
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при получении всех запросов'});
    }
}

module.exports.postRequest = async (request, response) => {
    if(!request.body) return response.status(400);
    try {
        const {typework, descr, resident} = request.body;
        console.log(resident);
        const type = await Type.findOne({value: 'Аварийная'});
        const status = await Status.findOne({value: 'Новая'});
        const currDate = new Date();
        date = ("0" + (currDate.getDate())).slice(-2) + '.' + ("0" + (currDate.getMonth() + 1)).slice(-2) + '.' + currDate.getFullYear() + ' ' + currDate.getHours() + ':' + currDate.getMinutes();
        const result = await Request.create({
            resident,
            type: type.value,
            status: status.value,
            date,
            descr,
            typework
        });
        if(result) {
            console.log('Заявка успешно добавлена');
            response.send(result);
        }
        else {
            console.log('Ошибка при создании заявки');
            response.status(400).json({message: 'ошибка при создании заявки'});
        }
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при добавлении запроса'});
    }
}

module.exports.postPlanRequest = async (request, response) => {
    if(!request.body) return response.status(400);
    try {
        const {city,street,numHome,type_work_request,executors,date_start,date_end,descr,type_request} = request.body;
        console.log(request.body);
        const type = await Type.findOne({value: type_request});
        const status = await Status.findOne({value: 'Передана'});
        const currDate = new Date();
        const dispatcher = request.user.id;
        date = ("0" + (currDate.getDate())).slice(-2) + '.' + ("0" + (currDate.getMonth() + 1)).slice(-2) + '.' + currDate.getFullYear() + ' ' + currDate.getHours() + ':' + currDate.getMinutes();
        const address = await Address.findOne({city,street,numHome});
        const type_work = await TypeWork.findOne({name: type_work_request})
        if(!address || !type || !status || !type_work) {
            console.log('Ошибка при создании заявки');
            response.status(400).json({message: 'ошибка при создании заявки'});
            return;
        }
        const result = await PlanRequest.create({
            address,
            type: type.value,
            type_work: type_work.name,
            executors,
            descr,
            status: status.value,
            date,
            date_start,
            date_end,
            dispatcher
        });
        if(result) {
            console.log('Заявка успешно добавлена');
            response.send(result);
        }
        else {
            console.log('Ошибка при создании заявки');
            response.status(400).json({message: 'ошибка при создании заявки'});
        }
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при добавлении запроса'});
    }
}

async function putRequestPriority(request, response) {
    try {
        const id = request.params.id;
        const {priority} = request.body;
        console.log(priority);
        let priorityRequest = await Priority.findOne({value: priority});
        if(!priorityRequest) {
            priorityRequest = 'Не назначен';
        }
        const result = await Request.updateOne({_id: id}, {priority: priorityRequest.value});
        if(result) {
            console.log(`У заявки №${id} изменен приоритет на ${priorityRequest.value}`);
        }
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при изменении приоритета заявки'});
    }
}
async function putRequestStatus(request, response) {
    try {
        const id = request.params.id;
        const {status} = request.body;
        const statusRequest = await Status.findOne({value: status});
        const result = await Request.updateOne({_id:id}, { status: statusRequest.value});
        if(result) {
            console.log(`У заявки №${id} изменен статус на ${statusRequest.value}`);
            response.send(result);
        }
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при изменении статуса заявки'});
    }
}

module.exports.putRequest = async (request, response) => {
    if(!request.body) return response.status(400);
    try {
        const id = request.params.id;
        const { executor } = request.body;
        if(executor) {
            const executorRequest = await Employee.findOne({name: executor});
            const dispatcher = await Employee.findOne({_id: request.user.id});
            const result = await Request.updateOne({_id:id}, {executor: executorRequest, dispatcher});
            if(result) {
                console.log(`У заявки №${id} изменен исполнитель на ${executorRequest.name}`);
                putRequestPriority(request,response)
                putRequestStatus(request,response);
            }
        }
        else {
            putRequestStatus(request,response);
        }
        

    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при изменении исполнителя заявки'});
    }
}

module.exports.deleteRequest = async (request,response) => {
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

module.exports.getExecutors = async (request,response) => {
    try {
        const type_work = request.params.type_work;
        let executors;
        switch(type_work) {
            case 'Подъезд':
                executors = await Employee.find({roles: ['Плотник']});
                break;
            case 'Крыша и водосточная система':
                executors = await Employee.find({roles: ['Плотник']});
                break;
            case 'Лифт':
                executors = await Employee.find({roles: ['Электрик']});
                break;
            case 'Холодное водоснабжение':
                executors = await Employee.find({roles: ['Слесарь-сантехник']});
                break;
            case 'Горячее водоснабжение':
                executors = await Employee.find({roles: ['Слесарь-сантехник']});
                break;
            case 'Канализация':
                executors = await Employee.find({roles: ['Слесарь-сантехник']});
                break;
            case 'Электроснабжения':
                executors = await Employee.find({roles: ['Электрик']});
                break;
            case 'Отопление':
                executors = await Employee.find({roles: ['Слесарь-сантехник']});
                break;
            default:
                executors = await Employee.find();
                break;
        }
        response.send(executors);
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при получении исполнителей'});
    }
}

module.exports.getExecutor = async (request,response) => {
    if(!request.body) return response.status(400);
    try {
        const id = request.params.id;
        const result = await Employee.findOne({_id: id});
        if(result) {
            console.log('Получен исполнитель');
            response.send(result);
        }
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при получении исполнителя'});
    }
}

module.exports.getResidents = async function (_,response) {
    try {
        const residents = await Resident.find().populate('address');
        response.send(residents);
    } catch(e) {
        console.log(e);
        response.status(400).json({message: "Ошибка при получении жильцов"});
    }
    
}


module.exports.users = function (_, response) {
    response.render('users.hbs');
}



module.exports.getUsers = async function (_, response) {
    try {
        let users = await User.find({}).populate({
            path: 'resident',
            populate: {
                path: 'address'
            }
        });
        response.send(users);
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при получении всех пользователей'});
    }
}
module.exports.getEmployees = async function (_, response) {
    try {
        const specialists = await Employee.find({roles: ['Плотник']});
        specialists.push(...await Employee.find({roles: ['Электрик']}));
        specialists.push(...await Employee.find({roles: ['Слесарь-сантехник']}));
        specialists.push(...await Employee.find({roles: ['Уборщик']}));
        specialists.push(...await Employee.find({roles: ['Дворник']}));
        specialists.push(...await Employee.find({roles: ['Диспетчер']}));
        response.send(specialists);
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при получении всех специалистов'});
    }
}

module.exports.deleteUser = async function (request, response) {
    try {
        const id = request.params.id;
        const result = await User.deleteOne({_id: id});
        if(result) {
            console.log('Пользователь успешно удален');
            response.send(result);
        }
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при удалении пользователя'});
    }
}

module.exports.deleteEmployee = async function (request, response) {
    try {
        const id = request.params.id;
        const result = await Employee.deleteOne({_id: id});
        if(result) {
            console.log('Работник успешно удален');
            response.send(result);
        }
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при удалении Работника'});
    }
}

module.exports.residents = function (_,response) {
    response.render('residents.hbs');
}

module.exports.postResident = async function (request,response) {
    const {name, surname,patronymic, tel, numApart, city, street, numHome} = request.body;
        const address = await Address.findOne({
        city,
        street,
        numHome
    });
    if(address) {
        const checkResident = await Resident.findOne({
            address,
            numApart
        });
        if(!checkResident) {
            const resident = await Resident.create({
                surname,
                name,
                patronymic,
                address,
                tel,
                numApart
            });
            console.log('Жилец успешно создан');
            response.send(resident);
        }
        else {
            console.log('Жилец уже существует');
            response.json({message: 'Уже существует'});
        }
    }   
    else {
        const address = await Address.create({
            city,
            street,
            numHome
        });
        const resident = await Resident.create({
            surname,
            name,
            patronymic,
            address,
            tel,
            numApart
        });
        console.log('Жилец и адрес успешно создан');
        response.send(resident);
    }
}

module.exports.editResident = async function (request, response) {
    if(!request.body) return response.status(400);
    const {id,city,street,numHome,numApart,surname,name,patronymic,tel} = request.body;
    const address = await Address.findOne({
        city,
        street,
        numHome
    });
    if(address) {
        const checkResident = await Resident.findOne({address,numApart,surname,name,patronymic,tel});
        if(!checkResident) {
            const resident = await Resident.updateOne({_id: id}, {address,numApart,surname,name,patronymic,tel})
            console.log('Жилец успешно изменен');
            response.send(resident);
        }
        else {
            console.log('Жилец уже существует');
            response.json({message: 'Уже существует'});
        }
    }   
    else {
        const address = await Address.create({
            city,
            street,
            numHome
        });
        const resident = await Resident.updateOne({_id: id}, {address,numApart,surname,name,patronymic,tel})
        console.log('Жилец изменен, создан новый адрес');
        response.send(resident);
    }
}

module.exports.deleteResident = async function (request, response) {
    if(!request.body) return response.status(400);
    try {
        const id = request.params.id;
        const requests = await Request.deleteMany({resident: id});
        if(requests.deletedCount) {console.log('Заявки жильца удалены');}
        const user = await User.deleteOne({resident: id});
        if(user.deletedCount) {console.log('Пользователь для жильца удален');}
        const result = await Resident.deleteOne({_id: id});
        if(result) {
            console.log('Жилец успешно удален');
            response.send(result);
        }
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при удалении жильца'});
    }
}

module.exports.resident = async function (request, response) {
    response.render('resident.hbs');
}
module.exports.reports = function (_,response) {
    response.render('reports.hbs');
}
module.exports.getResident = async function (request,response) {
    const id = request.params.id;
    const resident = await Resident.findOne({_id: id}).populate({
        path: 'address'
    });
    response.send(resident);
}
module.exports.getUser = async function (request, response) {
    const id = request.params.id;
    const user = await User.findOne({resident: id});
    if(user) {response.send(user)}
    else {
        response.status(404).json({message: 'Пользователь не найден'});
    }
}

module.exports.getReports = async function (request, response) {
    const reports = await Report.find().populate({
        path: 'request',
        populate: {
            path: 'resident',
            populate: {
                path: 'address'
            }
        }
    }).populate({
        path: 'request',
        populate: {
            path: 'executor'
        }
    }).populate({
        path: 'request',
        populate: {
            path: 'dispatcher'
        }
    });
    response.send(reports);
}
module.exports.getRequestsByResident = async function (request, response) {
    const residentId = request.params.id;
    try {
        let requests = await Request.find({resident: residentId}).populate({
            path: 'resident',
            populate: { path: 'address' }
        }).populate({
            path: 'dispatcher'
        }).populate({
            path: 'executor'
        });
        response.send(requests);
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при получении всех запросов'});
    }
}
module.exports.getReportsByResident = async function (request, response) {
    const residentId = request.params.id;
    try {
        let reports = await Report.find().populate({
            path: 'request',
            populate: {
                path: 'resident',
                populate: {
                    path: 'address'
                }
            }
        }).populate({
            path: 'request',
            populate: {
                path: 'executor'
            }
        }).populate({
            path: 'request',
            populate: {
                path: 'dispatcher'
            }
        });
        reports = reports.filter(report => report.request.resident._id == residentId);
        response.send(reports);
    } catch(e) {
        console.log(e);
        response.status(400).json({message: 'Ошибка при получении всех запросов'});
    }
}

module.exports.getAddresses = async function (req,res) {
    const addresses = await Address.find();
    res.send(addresses)
}

module.exports.address = function (_,res) {
    res.render('address.hbs');
}