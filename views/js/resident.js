const currentUrl = window.location.pathname,
      title = document.querySelector('.main_title'),
      id = currentUrl.split('/')[3],
      inputs = document.querySelectorAll('.main_content input'),
      user_block = document.querySelector('.main_content_user'),
      token = localStorage.getItem('token'),
      table = document.querySelector('.main_content_table'),
      tabs = document.querySelectorAll('.main_content_table_tab');
title.innerText += id;
import {getResident, getResidentUser,getRequestsByResident, getReportsByResident} from '../js/fetchs.js'
async function run() {
    const resident = await getResident(token, id);
    inputs[0].value = resident.surname;
    inputs[1].value = resident.name;
    inputs[2].value = resident.patronymic;
    inputs[3].value = resident.address.city;
    inputs[4].value = resident.address.street;
    inputs[5].value = resident.address.numHome;
    inputs[6].value = resident.numApart;
    inputs[7].value = resident.tel;
    const user = await getResidentUser(token,id);
    if(user) {
        user_block.innerHTML += `<input style='width:300px;' value='${user._id}'><input value='Логин: ${user.username}'><input value='Пароль: ${user.password}'>`;
        console.log(user);
    } else {
        user_block.innerHTML += '<div>Пользователь не найден</div>';
    }
    tabs.forEach(tab => {
        tab.style.cssText += 'cursor: pointer';
        tab.addEventListener('click', (e) => {
            tabs.forEach(item => {
                item.classList.remove('active');
            });
            e.target.classList.add('active');
            if(e.target.innerText == 'Заявки') {
                ShowRequests();
            }
            else if(e.target.innerText == 'Отчеты') {
                ShowReports()
            }
            else if(e.target.innerText == 'Платежи') {

            }
        });
    });
}
async function ShowRequests() {
    table.innerHTML = ``;
    const requests = await getRequestsByResident(token,id);
    if(requests) {
        requests.forEach(request => {
            CreateRequest(request);
        });
    }
    else {
        table.innerText = 'Отчеты не найдены';
    }
}
async function ShowReports() {
    table.innerHTML = ``;
    const reports = await getReportsByResident(token,id);
    console.log(reports.length);
    if(reports.length) {
        reports.forEach(report => {
            CreateReport(report);
        });
    }
    else {
        table.innerText = 'Отчеты не найдены';
    }
}
function CreateReport(report) {
    const row = document.createElement('div'),
          numColumn = document.createElement('div'),
          aboutColumn = document.createElement('div'),
          resultColumn = document.createElement('div');
    numColumn.innerHTML = `№${report._id}<br><span style='font-size:12px;color:gray;'>от ${report.date}</span>`;
    aboutColumn.innerHTML = `
    <strong>Заявитель: </strong>${report.request.resident.surname} ${report.request.resident.name} ${report.request.resident.patronymic} <span style='font-size:12px;color:gray'>${report.request.resident.tel}</span><br>
    <strong>Адрес: </strong>${report.request.resident.address.city} ${report.request.resident.address.street} ${report.request.resident.address.numHome} ${report.request.resident.numApart} <br>
    <strong>Дата: </strong>${report.request.date} <br>
    <strong>Тип заявки: </strong>${report.request.type} <br>
    <strong>Тип работы: </strong>${report.request.typework.name} -> ${report.request.typework.work} <br>
    <strong>Описание: </strong>${report.request.descr}<br>
    <strong>Приоритет: </strong>${report.request.priority} `;
    resultColumn.innerHTML = `<strong>Обработал: </strong> ${report.request.dispatcher.surname} + ${report.request.dispatcher.name}<br>
    <strong>Выполнил: </strong> ${report.request.executor.surname} ${report.request.executor.name}<br>
    <strong>Фото-отчёт: </strong>`;
    const button = document.createElement('a');
    button.style.cssText = 'cursor: pointer;color: blue;';
    button.innerText = 'Показать';
    button.addEventListener('click', (e) => {
        const window = document.createElement('div');
        window.style.cssText = 'width: 100%;height: 100vh;background-color: rgba(0,0,0,0.7);position: fixed;top:0;right:0;';
        const img = document.createElement('img');
        img.src = report.img;
        img.style.cssText = 'height: 80%;position: absolute;top: 10%;left:50%;transform: translateX(-50%)';
        window.append(img);
        window.addEventListener('click', (e) => {
            if(e.target != img) {
                window.remove();
            }
        });
        const body = document.querySelector('body');
        body.append(window);
    });
    resultColumn.append(button);
    numColumn.style.cssText = 'width: 380px;font-size: 14px;';
    aboutColumn.style.cssText = 'width: 500px;font-size: 14px;margin-left: 10px;';
    resultColumn.style.cssText = 'width: 250px;font-size: 14px;margin-left: 10px;';
    row.append(numColumn);
    row.append(aboutColumn);
    row.append(resultColumn);
    row.style.cssText = 'padding: 5px; display: flex;border-bottom: 1px solid gray;';
    table.append(row);

}

ShowRequests();
function CreateRequest(request) {
    //Создаем строку для новой заявки
    const row = document.createElement('div');
    row.classList.add('main_requests_table_content_row');

    //Обозначаем строку id заявки
    row.setAttribute('data-rowid', request._id);

    //Создаем 6 столбцов
    const items = [];
    for(let i = 0; i < 6; i++){
        const item = document.createElement('div');
        item.classList.add('main_requests_table_content_row_item');
        items.push(item);
    }
    items[0].setAttribute('style', 'width: 200px;min-height:100px;');
    items[1].setAttribute('style', 'width: 240px;min-height:100px;');
    items[2].setAttribute('style', 'width: 160px;min-height:100px;');
    items[3].setAttribute('style', 'width: 120px;min-height:100px;');
    items[4].setAttribute('style', 'width: 140px;min-height:100px;');
    items[5].setAttribute('style', 'width: 250px;min-height:100px;');
        items[0].innerHTML =`<span style="font-size:12px;">№${request._id}</span>` + '<br>' + request.date + '<br>' ;
    if(request.dispatcher) {
        items[0].innerHTML += request.dispatcher.surname + ' ' +request.dispatcher.name;
    }
    //Адрес и заявитель
    items[1].innerHTML = '<span style="font-weight: 700">Адрес: </span>' +request.resident.address.city +', ' + request.resident.address.street + ', ' + request.resident.address.numHome + ', ' + request.resident.numApart + '<br><br>' + '<span style="font-weight: 700">Заявитель: </span>' + request.resident.surname + ' ' + request.resident.name + ' ' + request.resident.patronymic;

    //Вид заявки
    if(!request.executor) {
        items[2].append('Не назначен');
    }
    else {
        items[2].append(request.executor.surname +' ' + request.executor.name);
    }
    items[3].append(request.status);
    items[4].append(request.priority ? request.priority : 'Не назначен');
    items[5].innerHTML = `<b>Вид заявки: </b>${request.type}<br><b>Тип проблемы: </b> ${request.typework.name} <br><b>Проблема: </b> ${request.typework.work} <br><b>Описание проблемы: </b> ${request.descr}`;

    items.forEach(item => {
        row.append(item);
    });
    const btn_block = document.createElement('div'),
          btn_block_edit = document.createElement('div'),
          btn_block_remove = document.createElement('div'),
          btn_block_edit_btn = document.createElement('button'),
          btn_block_remove_btn = document.createElement('button');
    btn_block.classList.add('main_requests_table_content_row_item');
    btn_block.setAttribute('style', 'width: 49px;height: 100px;');
    btn_block_edit.classList.add('main_requests_table_content_row_item_edit');
    btn_block_remove.classList.add('main_requests_table_content_row_item_remove');

    btn_block_edit_btn.classList.add('main_requests_table_content_row_item_edit_btn');
    btn_block_edit_btn.innerHTML = `<img src="images/edit.png" alt="">`;
    btn_block_edit_btn.setAttribute('data-rowid', request._id);
    btn_block_remove_btn.classList.add('main_requests_table_content_row_item_remove_btn');
    btn_block_remove_btn.innerHTML = `<img src="images/remove.png" alt="">`;
    
    if(request.status != 'Новая') {
        btn_block_edit_btn.setAttribute('disabled','');
    }
    if(request.status != 'Отмена' && request.status != 'Новая') {
        btn_block_remove_btn.setAttribute('disabled','');
    }

    if(request.status == "Новая") {
    //Кнопка изменения заявки доступна только у новой заявки
        row.style.cssText = "background-color: rgb(255, 255, 255);";
        btn_block_edit_btn.addEventListener('click', async () => {
            const executors = await GetExecutors(token,request.typework.name);
            const combobox = document.createElement('select');
            combobox.classList.add('main_requests_table_content_row_item_combobox');
            executors.forEach(executor => {
                const option = document.createElement('option');
                option.innerText = executor.name;
                combobox.append(option);
            });
            items[2].innerHTML = ``;
            items[2].append(combobox);

            const select_priority = document.createElement('select');
            select_priority.classList.add('main_requests_table_content_row_item_combobox');
            const option1 = document.createElement('option'),
                  option2 = document.createElement('option'),
                  option3 = document.createElement('option');
            option1.innerText = 'Высокий';
            option1.style.cssText = 'color: red;';
            option2.innerText = 'Обычный';
            option2.style.cssText = 'color: green;';
            option3.innerText = 'Низкий';
            option3.style.cssText = 'color: yellow;';
            select_priority.append(option1);
            select_priority.append(option2);
            select_priority.append(option3);
            items[4].innerHTML = ``;
            items[4].append(select_priority);

            const confirm_btn = document.createElement('button');
            confirm_btn.classList.add('main_requests_table_content_row_item_confirm_btn');
            confirm_btn.innerHTML = `<img src="images/confirm.png" alt="">`;
            confirm_btn.addEventListener('click', () => {
                if(!(combobox.value == 'Не назначен') && !(select_priority.value == 'Не назначен') && confirm("Изменить заявку?"))
                {
                    combobox.replaceWith(combobox.value);
                    select_priority.replaceWith(select_priority.value);
                    const req = EditRequest(token,request._id, combobox.value, 'Передана', select_priority.value);
                    confirm_btn.replaceWith(btn_block_edit_btn);
                    row.style.cssText = "background-color: rgb(255, 248, 117);";
                    items[3].innerHTML = `Передана`;
                }
                else {
                    confirm_btn.replaceWith(btn_block_edit_btn);
                    items[2].innerHTML = `Не назначен`;
                }

            });
            btn_block_edit_btn.replaceWith(confirm_btn);
        });

        //Кнопка отмены заявки так же доступна лишь для новой заявки
        btn_block_remove_btn.addEventListener('click', () => {
            // const result = prompt("Причина отмены заявки: ");
            const req = EditRequest(token,request._id, request.executor, 'Отмена');
            row.style.cssText = "background-color: rgb(255, 117, 117);";
            items[3].innerHTML = `Отмена`;
            // DeleteRequest(request._id);
    });
    }
    if(request.status == "Передана") 
    {
        row.style.cssText = "background-color: rgb(255, 248, 117);";
        btn_block_edit_btn.setAttribute('disabled','');
    }
    else if(request.status == "В работе") {
        row.style.cssText = "background-color: rgb(255, 207, 117);";
    }
    else if(request.status == "Выполнена") {
        row.style.cssText = "background-color: rgb(135, 255, 117);";
    }
    else if(request.status == "Отмена") 
    {
        row.style.cssText = "background-color: rgb(255, 117, 117);";
        btn_block_edit_btn.setAttribute('disabled','');

        //Кнопка отмены заявки будет удалять её, если она уже отменена
        btn_block_remove_btn.addEventListener('click', () => {
            row.remove();
            DeleteRequest(token, request._id);
        });
    }



    btn_block_edit.append(btn_block_edit_btn);
    btn_block_remove.append(btn_block_remove_btn);

    btn_block.append(btn_block_edit);
    btn_block.append(btn_block_remove);
    row.append(btn_block);

    table.append(row);
}


run();