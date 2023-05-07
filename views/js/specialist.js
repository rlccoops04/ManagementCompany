"use strict"
import {getRequestByExecutor,EditRequestSpec} from '../js/fetchs.js';

const menu_btns = document.querySelectorAll('.menu_nav_item'),
      content = document.querySelector('.content'),
      title = document.querySelector('.main_title'),
      token = localStorage.getItem('token');
let requests;
let currRequest;
async function setRequests() {
    requests = await getRequestByExecutor(token);
    currRequest = requests.find(request => request.status == 'В работе');
    ShowNewRequests(requests);
}
setRequests();
menu_btns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        menu_btns.forEach(item => {
            item.classList.remove('active');
        });
        e.target.classList.add('active');
        if(e.target.innerText == 'Переданные') {
            ShowNewRequests(requests);
        }
        else if (e.target.innerText == 'Текущая') {
            ShowCurrentRequest(currRequest);
        }
    });
});

async function ShowNewRequests(requests) {
    content.innerHTML = ``;
    title.innerText = 'Переданные заявки';
    // requests = requests.sort((a,b) => a.priority == 'Высокий' ? 1: a.priority=='Обычный' ? 1 : -1 );
    const newRequests = requests.filter(request => request.status == 'Передана');
    newRequests.forEach(request => {
        CreateRequestRow(request);
    });
}

async function ShowCurrentRequest(request) {
    content.innerHTML = ``;
    title.innerText = 'Текущая заявка';
    if(currRequest) {
        const row = document.createElement('div');
        row.style.cssText = 'border: 1px solid gray;width: 80%;';
        const row_title = document.createElement('div');
        row_title.style.cssText = 'font-size: 15px;height: 30px;border-bottom: 1px solid gray;padding: 5px;background-color:rgb(80,80,80);color:white;';
        row_title.innerText = `Заявка №${request._id}`;
        row.append(row_title);
        const row_content = document.createElement('div');
        row_content.innerHTML = `
        <strong>Адрес: </strong>г.${request.resident.address.city}, ул.${request.resident.address.street}, д.${request.resident.address.numHome}, кв.${request.resident.numApart}<br>
        <strong>Заявитель: </strong>${request.resident.surname} ${request.resident.name} ${request.resident.patronymic}<br>
        <strong>Приоритет: </strong><span style='color:${request.priority == "Высокий" ? 'red' : request.priority == 'Обычный' ? 'green' : 'orange'}'>${request.priority}</span><br>
        <strong>Дата: </strong>${request.date} <br>
        <strong>Тип заявки: </strong>${request.type} <br>
        <strong>Вид работы: </strong>${request.typework.name} => ${request.typework.work}<br>
        <strong>Описание: </strong>${request.descr}`;
        row_content.style.cssText ='padding: 5px;';
        row.append(row_content);
    
        const btn_block = document.createElement('div');
        btn_block.style.cssText = 'position: relative;height: 50px;;width: 90%;margin: 15px auto;';
        const submit = document.createElement('button');
        submit.style.cssText = 'width: 100%;height:50px;border: none;background: green;color:white;';
        submit.innerText = 'Подтвердить выполнение';
        const code_input_block = document.createElement('div');
        const img_input = document.createElement('input');
        img_input.setAttribute('type', 'file');
        const code_input = document.createElement('input');
        code_input.style.cssText = `display: block;width: 90%;height: 50px;margin: 15px auto;`;
        code_input.setAttribute('placeholder', 'Введите код');
        code_input_block.append(code_input);
        code_input_block.append(img_input);
        code_input_block.style.cssText = 'display: none;';
        submit.addEventListener('click', async () => {
            let f = img_input.files[0],
                fr = new FileReader();
            if(f) {
                fr.onload = async e => {
                    const response = await fetch('/specialist/generateCode', {
                        method: 'POST',
                        headers: {
                            "Accept" : "application/json", "Content-Type" : "application/json",
                            "Authorization" : `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            request: request._id,
                            code: code_input.value,
                            img: e.target.result
                        })
                    });
                    if(!response.ok) {
                        const answer = await response.json();
                        answer_block.style.cssText = 'display: block;width: 90%;margin: 15px auto;color:red;text-align:center;';
                        answer_block.innerText = answer.message;
                        console.log(answer.message);
                    }
                    else if(response.status == 201) {
                        code_input_block.style.cssText = 'display: block;';
                    }
                    else if(response.status == 202) {
                        const answer = await response.json();
                        answer_block.style.cssText = 'display: block;width: 90%;margin: 15px auto;color:green;text-align:center;';
                        answer_block.innerText = answer.message;
                        console.log(answer.message);
                        window.location.reload();
                    }
                } 
                fr.readAsDataURL(f);
            }
            else {
                const response = await fetch('/specialist/generateCode', {
                    method: 'POST',
                    headers: {
                        "Accept" : "application/json", "Content-Type" : "application/json",
                        "Authorization" : `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        request: request._id,
                        code: code_input.value
                    })
                });
                if(!response.ok) {
                    const answer = await response.json();
                    answer_block.style.cssText = 'display: block;width: 90%;margin: 15px auto;color:red;text-align:center;';
                    answer_block.innerText = answer.message;
                    console.log(answer.message);
                }
                else if(response.status == 201) {
                    code_input_block.style.cssText = 'display: block;';
                }
                else if(response.status == 202) {
                    const answer = await response.json();
                    answer_block.style.cssText = 'display: block;width: 90%;margin: 15px auto;color:green;text-align:center;';
                    answer_block.innerText = answer.message;
                    console.log(answer.message);
                    window.location.reload();
                }
            }            
        });
        btn_block.append(submit);
        row.append(btn_block);
        btn_block.before(code_input_block);
        const answer_block = document.createElement('div');
        row.append(answer_block);
        content.append(row);    
    }
    else {
        const text = document.createElement('div');
        text.innerText = 'Текущей заявки не найдено';
        content.append(text);
    }
}
function CreateRequestRow(request) {
    const row = document.createElement('div');
    row.style.cssText = 'border: 2px solid gray;width: 90%;min-height: 100px;margin-top: 10px;border-radius: 5px;position: relative;';
    const row_title = document.createElement('div');
    row_title.style.cssText = 'font-size: 15px;height: 30px;border-bottom: 1px solid gray;padding: 5px;background-color:rgb(127,127,127);color:white;';
    row_title.innerText = `Заявка №${request._id}`;
    row.append(row_title);
    const row_content = document.createElement('div');
    row_content.innerHTML = `
    <strong>Адрес: </strong>г.${request.resident.address.city}, ул.${request.resident.address.street}, д.${request.resident.address.numHome}, кв.${request.resident.numApart}<br>
    <strong>Заявитель: </strong>${request.resident.surname} ${request.resident.name} ${request.resident.patronymic}<br>
    <strong>Приоритет: </strong><span style='color:${request.priority == "Высокий" ? 'red' : request.priority == 'Обычный' ? 'green' : 'orange'}'>${request.priority}</span><br>
    <strong>Дата: </strong>${request.date} <br>
    <strong>Тип заявки: </strong>${request.type} <br>
    <strong>Вид работы: </strong>${request.typework.name} => ${request.typework.work}<br>
    <strong>Описание: </strong>${request.descr}`;
    row_content.style.cssText ='padding: 5px;';
    row.append(row_content);

    const btn_block = document.createElement('div');
    btn_block.style.cssText = 'position: relative;height: 40px;';
    const submit = document.createElement('button');
    submit.style.cssText = 'width: 100px;height:30px;border: none;background: green;color:white;position: absolute;bottom: 5px;right:5px;';
    submit.innerText = 'В работу';
    submit.addEventListener('click', () => {
        EditRequestSpec(token,request._id, 'В работе');
    });
    if(currRequest) {
        submit.setAttribute('disabled', '');
    }
    btn_block.append(submit);
    row.append(btn_block);
    content.append(row);
}