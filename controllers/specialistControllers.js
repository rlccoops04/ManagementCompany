const Request = require('../models/Request.js').Request;
const Status = require('../models/Status.js').Status;
const Report = require('../models/Report.js').Report;
let secrets = [];
module.exports.specialist = async function (request, response) {
    response.render('specialist.hbs');
}

module.exports.getRequests =  async (request, response) => {
    let requests = await Request.find({executor: request.user.id}).populate({
        path: 'resident',
        populate: { path: 'address' }
    });
    requests.forEach(request=> {
        delete request.dispatcher;
    });
    response.send(requests);
}

module.exports.putRequest = async (request, response) => {
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

function generateCode() {
    let code = '';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for(let i = 0; i < 6; i++) {
        const choiceNumOrSymb = Math.round(Math.random());
        if(choiceNumOrSymb) {
            const pos = Math.round(Math.random() * 25);
            code = code.concat(alphabet[pos]);
        }
        else {
            const num = Math.round(Math.random() * 9);
            code = code.concat(num);
        }
    }
    return code;
}

module.exports.submitRequest = async (request, response) => {
    const id = request.body.request;
    const currRequest = await Request.findOne({_id: id}).populate({
        path: 'resident',
    });
    let generate = true;
    if(request.body.code) {
        secrets.forEach(async secret => {
            if(secret.request == id) {
                if(secret.code == request.body.code) {
                    secrets = secrets.filter(item => item != secret);
                    console.log('Код принят');
                    const statusRequest = await Status.findOne({value: 'Выполнена'});
                    console.log(statusRequest);
                    const result = await Request.updateOne({_id:id}, { status: statusRequest.value});
                    console.log(`У заявки №${currRequest._id} изменен статус на ${statusRequest.value}`);
                    //генерация отчета
                    const currDate = new Date();
                    date = ("0" + (currDate.getDate())).slice(-2) + '.' + ("0" + (currDate.getMonth() + 1)).slice(-2) + '.' + currDate.getFullYear() + ' ' + currDate.getHours() + ':' + currDate.getMinutes();
            
                    const report = await Report.create({
                        request: id,
                        img: request.body.img,
                        date
                    });
                    response.status(202).json({message: 'Код принят'});
                }
                else {
                    console.log('Введен неверный код');
                    response.status(404).json({message: 'Введен неверный код'});
                }
            }
        });
    }
    else {
        secrets.forEach(secret => {
            if(secret.request == id) {
                console.log("Код уже создан, ожидается ввод");
                generate = false;
                response.status(404).json({message: 'Код уже создан, ожидается ввод'});
            }
        });
        if(generate) {
            const code = generateCode();
            const element = {
                request: id,
                code
            };
            console.log(`Секретный код сгенерирован: ${code} для заявки №${id}. Отправка на номер: ${currRequest.resident.tel}`);
            secrets.push(element);
            response.status(201).json({message:`Секретный код сгенерирован: ${code} для заявки №${id}. Отправка на номер: ${currRequest.resident.tel}`});
        }
    }
}