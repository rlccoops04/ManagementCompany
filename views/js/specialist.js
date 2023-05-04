"use strict"
import {getRequestByExecutor} from '../js/fetchs.js';

const menu_btns = document.querySelectorAll('.menu_nav_item'),
      content = document.querySelector('.content'),
      title = document.querySelector('.main_title'),
      token = localStorage.getItem('token');
let requests;
async function setRequests() {
    requests = await getRequestByExecutor(token);
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
    });
});

async function ShowNewRequests(requests) {
    title.innerText = 'Переданные заявки';
    requests.forEach(request => {
        CreateRequestRow(request);
    });
}
function CreateRequestRow(request) {
    const row = document.createElement('div');
    row.style.cssText = 'border: 2px solid gray;width: 90%;min-height: 100px;margin-top: 10px;border-radius: 5px;padding: 5px;';
    const row_title = document.createElement('div');
    row_title.style.cssText = 'font-size: 15px;height: 25px;border-bottom: 1px solid black;';
    row_title.innerText = `Заявка №${request._id}`;
    row.append(row_title);
    const row_content = document.createElement('div');
    row_content.innerHTML = `
    <strong>Адрес: </strong>г.${request.resident.address.city}, ул.${request.resident.address.street}, д.${request.resident.address.numHome}, кв.${request.resident.numApart}
    <strong>Заявитель: </strong>${request.resident.surname} ${request.resident.name} ${request.resident.patronymic}
    <strong>Приоритет: </strong><span style='color:${request.priority == "Высокий" ? 'red' : request.priority == 'Обычный' ? 'green' : 'orange'}'>${request.priority}</span>`;
    row_content.style.cssText ='';
    row.append(row_content);
    console.log(request);
    content.append(row);
}