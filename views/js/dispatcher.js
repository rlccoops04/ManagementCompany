"use strict"
import {getRequests,getTypesWork,getResidents,EditRequest,DeleteRequest,GetExecutors,PostRequest,getAddresses,getPlantRequests} from '../js/fetchs.js';
const requests_table = document.querySelector('.main_requests_table_content'),
      token = localStorage.getItem('token'),
      search_btns = document.querySelectorAll('.search_request'),
      search_input = document.querySelector('#search'),
      statuses_btn = document.querySelectorAll('.main_requests_status_item'),
      titles = document.querySelectorAll('.main_requests_table_titles_item'),
      select_sort = document.querySelector('.select_sort');

let requests,addresses,planrequests;
// Получение всех заявок
async function setRequests() {
    requests = await getRequests(token);
    planrequests = await getPlantRequests(token);
    console.log(planrequests[0]);
    requests.forEach(request => {
        CreateRequest(request);
    });
    planrequests.forEach(request => {
        CreateRequest(request);
    })
}
setRequests();
async function setAddresses() {
    addresses = await getAddresses(token);
}
setAddresses();
statuses_btn.forEach(btn => {
    btn.style.cssText += 'cursor: pointer;';
    btn.addEventListener('click', (e) => {
        requests_table.innerHTML = ``;
        requests.forEach(request => {
            console.log(btn.innerText.split('\n')[0]);
            if(request.status == btn.innerText.split('\n')[0]) {
                CreateRequest(request);
            }
        });
        planrequests.forEach(request => {
            console.log(btn.innerText.split('\n')[0]);
            if(request.status == btn.innerText.split('\n')[0]) {
                CreateRequest(request);
            }
        });
    });
});
let sortedBy;
select_sort.addEventListener('change', () => {
    requests_table.innerHTML = ``;
    let sortBy = select_sort.value;
    let sortedList = requests.concat(planrequests);
    if(sortBy == 'dateup') {
        sortedList = sortedList.sort((a,b) => a.date > b.date ? 1 : -1);
    }
    else if(sortBy == 'datedown') {
        sortedList = sortedList.sort((a,b) => a.date < b.date ? 1 : -1);
    }
    else if(sortBy == 'adrup') {
        requests = requests.sort((a,b) => `${a.resident.address.city} ${a.resident.address.street} ${a.resident.address.numHome} ${a.resident.numApart}` > `${b.resident.address.city} ${b.resident.address.street} ${b.resident.address.numHome} ${b.resident.numApart}` ? 1 : -1);
        planrequests = planrequests.sort((a,b) => `${a.address.city} ${a.address.street} ${a.address.numHome}` > `${b.address.city} ${b.address.street} ${b.address.numHome}`);
        sortedList = requests.concat(planrequests);
    }
    else if(sortBy == 'adrdown') {
        requests = requests.sort((a,b) => `${a.resident.address.city} ${a.resident.address.street} ${a.resident.address.numHome} ${a.resident.numApart}` < `${b.resident.address.city} ${b.resident.address.street} ${b.resident.address.numHome} ${b.resident.numApart}` ? 1 : -1);
        planrequests = planrequests.sort((a,b) => `${a.address.city} ${a.address.street} ${a.address.numHome}` < `${b.address.city} ${b.address.street} ${b.address.numHome}`);
        sortedList = requests.concat(planrequests);
    }
    else if(sortBy == 'statusup') {
        sortedList = sortedList.sort((a,b) => a.status > b.status ? 1 : -1);
    }
    else if(sortBy == 'statusdown') {
        sortedList = sortedList.sort((a,b) => a.status < b.status ? 1 : -1);
    }
    sortedList.forEach(request => {
        CreateRequest(request);
    });
});

search_btns.forEach(btn => {
    btn.addEventListener('click', () => {
        requests_table.innerHTML = ``;
        const search = search_input.value;
        if(search) {
            const s = requests.filter(request => request._id == search ||
                  request.resident.address.city == search ||
                  `${request.resident.address.city} ${request.resident.address.street}` == search ||
                  `${request.resident.address.city} ${request.resident.address.street} ${request.resident.address.numHome}` == search ||
                  `${request.resident.address.city} ${request.resident.address.street} ${request.resident.address.numHome} ${request.resident.numApart}` == search ||
                  search.includes(request.resident.surname) ||
                  search.includes(request.resident.name) ||
                  search.includes(request.resident.patronymic) ||
                  search.includes(request.status) ||
                  search.includes(request.type) ||
                  search.includes(request.status) ||
                  search.includes(request.typework.name) ||
                  search.includes(request.typework.work) ||
                  request.descr.includes(search));
            s.forEach(req => {
                CreateRequest(req);
            });
            const l = planrequests.filter(request => request._id == search ||
                request.address.city == search ||
                `${request.address.city} ${request.address.street}` == search ||
                `${request.address.city} ${request.address.street} ${request.address.numHome}` == search ||
                `${request.address.city} ${request.address.street} ${request.address.numHome} ${request.numApart}` == search ||
                search.includes(request.status) ||
                search.includes(request.type) ||
                search.includes(request.typework) ||
                search.includes(request.typework) ||
                request.descr.includes(search));
            l.forEach(req => {
                CreateRequest(req);
            });
        } else {
            requests.forEach(request => {
                CreateRequest(request);
            });
        }
    });
});

//Изменение заявки


//Создание заявки на сайте
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
    if(request.type != 'Аварийная') {
        console.log(request);
        const a = document.createElement('a');
        a.href = 'addresses/' + request.address._id;
        a.style.cssText = 'color: black;';
        a.innerHTML = ' <span style="font-weight: 700">Адрес: </span>' +request.address.city +', ' + request.address.street + ', ' + request.address.numHome;
        items[1].append(a);
        for(let i = 0;i<request.executors.length;i++){
            items[2].innerHTML += `${i+1}) ${request.executors[i].surname} ${request.executors[i].name}<br>`;
        }
        items[3].append(request.status);
        items[4].innerHTML = `Дата проведения: ${request.date_start}<br>Дата окончания: ${request.date_end ? request.date_end : request.date_start}`
        items[5].innerHTML = `<b>Вид заявки: </b>${request.type}<br><b>Тип работы: </b> ${request.type_work}<br><b>Описание: </b> ${request.descr}`;

    }
    else {
        const a = document.createElement('a');
        a.href = 'addresses/' + request.resident.address._id;
        a.style.cssText = 'color: black;';
        a.innerHTML = '<span style="font-weight: 700">Адрес: </span>' +request.resident.address.city +', ' + request.resident.address.street + ', ' + request.resident.address.numHome + ', ' + request.resident.numApart + '<br><br>' + `<span style='font-weight: 700'>Заявитель: </span><a style='color: blue;' href='residents/${request.resident._id}'>${request.resident.surname} ${request.resident.name} ${request.resident.patronymic}</a>`;
        items[1].append(a); 
        if(!request.executor) {
            items[2].append('Не назначен');
        }
        else {
            items[2].append(request.executor.surname +' ' + request.executor.name);
        }
        items[3].append(request.status);
        items[4].append(`Приоритет: ${request.priority ? request.priority : 'Не назначен'}`);
        items[5].innerHTML = `<b>Вид заявки: </b>${request.type}<br><b>Тип проблемы: </b> ${request.typework.name} <br><b>Проблема: </b> ${request.typework.work} <br><b>Описание проблемы: </b> ${request.descr}`;
    }

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

    requests_table.append(row);
}


//Модальное окно создания заявки
const modal_close_btn = document.querySelector('.modal_content_close'),
      modal_window = document.querySelector('.modal'),
      modal_emerg = document.querySelector('.modal_content'),
      modal_cap = document.querySelector('.modal_cap'),
      modal_dis = document.querySelector('.modal_dis'),
      modal_choice = document.querySelector('.modal_choice'),
      modal_subchoice = document.querySelector('.modal_subchoice'),
      modal_open_btns = document.querySelectorAll('.modal_open_btn'),
      modal_form_request = document.forms["sendRequestForm"],
      modal_send_btn = document.querySelector('.modal_content_input_submit'),
      btn_open_plan_form = document.querySelector('.btn_open_plan_form'),
      btn_open_emerg_form = document.querySelector('.btn_open_emerg_form'),
      btn_open_cap_form = document.querySelector('.btn_open_cap_form'),
      btn_open_dis_form = document.querySelector('.btn_open_dis_form'),
      inp_cap_city = document.querySelector('.cap_city'),
      inp_cap_street = document.querySelector('.cap_street'),
      inp_cap_numHome = document.querySelector('.cap_numHome'),
      modal_cap_executors = document.querySelector('.modal_cap_executors'),
      select_work = document.querySelector('.select_work'),
      send_cap_request = document.querySelector('.send_cap_request'),
      inp_cap_date = document.querySelector('.cap_date');
function CreateChoiceExec(executors) {
    const select_exec = document.createElement('select');
    select_exec.classList.add('select_exec');
    executors.forEach(executor => {
        const opt = document.createElement('option');
        opt.value = `${executor._id}`;
        opt.innerText = `${executor.surname} ${executor.name}`;
        select_exec.append(opt);
    });
    modal_cap_executors.append(select_exec);
}
select_work.selectedIndex = -1;
select_work.addEventListener('change', async () => {
    modal_cap_executors.innerHTML = ``;
    const executors = select_work.value == 'Водоснабжение' ? await GetExecutors(token,'Холодное водоснабжение') : await GetExecutors(token,select_work.value);
    const label = document.createElement('label');
    label.innerText = 'Выберите исполнителя:';
    modal_cap_executors.append(label);
    CreateChoiceExec(executors);
    if(executors.length > 1) {
        const button = document.createElement('button');
        button.style.cssText = 'width: 20px;height:20px;background:none;padding: 0;border-radius:0;position:absolute;top:240px;left:35px;margin:0;color:gray;display:flex;justify-content:center;align-items:center;font-size:40px;font-weight:100;';
        button.addEventListener('click', () => {
            CreateChoiceExec(executors);
        });
        button.innerText = '+';
        modal_cap_executors.append(button);
    }
});
inp_cap_city.addEventListener('blur', () => {
    if(addresses.filter(address => address.city == inp_cap_city.value).length) {
        inp_cap_city.style.cssText = 'border: 1px solid green';
    } else {
        inp_cap_city.style.cssText = 'border: 1px solid red';
    }
});
inp_cap_street.addEventListener('blur', () => {
    if(addresses.filter(address => address.city == inp_cap_city.value && address.street == inp_cap_street.value).length) {
        inp_cap_street.style.cssText = 'border: 1px solid green';
    } else {
        inp_cap_street.style.cssText = 'border: 1px solid red';
    }
});
inp_cap_numHome.addEventListener('blur', () => {
    if(addresses.filter(address => address.city == inp_cap_city.value && address.street == inp_cap_street.value && address.numHome == inp_cap_numHome.value).length) {
        inp_cap_numHome.style.cssText = 'border: 1px solid green';
    } else {
        inp_cap_numHome.style.cssText = 'border: 1px solid red';
    }
});
send_cap_request.addEventListener('click', async () => {
    if(inp_cap_city.value.length && inp_cap_street.value.length && inp_cap_numHome.value.length && select_work.value.length && inp_cap_date.value.length) {
        const cap_descr = document.querySelector('.cap_descr');
        const select_type = document.querySelector('.select_type');
        let work;
        select_work.value == 'Водоснабжение' ? work = 'Холодное водоснабжение' : work = select_work.value;
        const city = inp_cap_city.value,
              street = inp_cap_street.value,
              numHome = inp_cap_numHome.value,
              type_work_request = work,
              date_start = inp_cap_date.value,
              descr = cap_descr.value,
              type_request = select_type.value;
        const executorsSelect = document.querySelectorAll('.select_exec');
        let executors = [];
        executorsSelect.forEach(select => {
            executors.push(select.value);
        });
        const response = await fetch('/dispatcher/post/planrequest', {
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${token}`,
                'Content-Type' : 'application/json',
                'Accept-Type' : 'application/json'
            },
            body: JSON.stringify({city,street,numHome,type_work_request,date_start,descr,executors,type_request})
        });
        console.log(response.ok);
        if(response.ok) {
            location.reload();
        }
    }
});

const inp_dis_city = document.querySelector('.dis_city'),
      inp_dis_street = document.querySelector('.dis_street'),
      inp_dis_numHome = document.querySelector('.dis_numHome'),
      select_dis = document.querySelector('.select_dis'),
      select_executor_dis = document.querySelector('.select_executor_dis'),
      send_dis_request = document.querySelector('.send_dis_request'),
      inp_dis_date_start = document.querySelector('.dis_date_start'),
      inp_dis_date_end = document.querySelector('.dis_date_end');
select_dis.selectedIndex = -1;
select_dis.addEventListener('change', async () => {
    const executors = await GetExecutors(token, select_dis.value);
    select_executor_dis.innerHTML = ``;
    executors.forEach(executor => {
        const opt = document.createElement('option');
        opt.innerText = `${executor.surname} ${executor.name}`;
        opt.value = executor._id;
        select_executor_dis.append(opt);
    });
});
inp_dis_city.addEventListener('blur', () => {
    console.log(addresses);
    if(addresses.filter(address => address.city == inp_dis_city.value).length) {
        inp_dis_city.style.cssText = 'border: 1px solid green';
    } else {
        inp_dis_city.style.cssText = 'border: 1px solid red';
    }
});
inp_dis_street.addEventListener('blur', () => {
    if(addresses.filter(address => address.city == inp_dis_city.value && address.street == inp_dis_street.value).length) {
        inp_dis_street.style.cssText = 'border: 1px solid green';
    } else {
        inp_dis_street.style.cssText = 'border: 1px solid red';
    }
});
inp_dis_numHome.addEventListener('blur', () => {
    if(addresses.filter(address => address.city == inp_dis_city.value && address.street == inp_dis_street.value && address.numHome == inp_dis_numHome.value).length) {
        inp_dis_numHome.style.cssText = 'border: 1px solid green';
    } else {
        inp_dis_numHome.style.cssText = 'border: 1px solid red';
    }
});
send_dis_request.addEventListener('click', async () => {
    if(inp_dis_city.value.length && inp_dis_street.value.length && inp_dis_numHome.value.length && select_dis.value.length) {
        const dis_descr = document.querySelector('.dis_descr');
        const executorSelect = document.querySelector('.select_executor_dis');
        const city = inp_dis_city.value,
              street = inp_dis_street.value,
              numHome = inp_dis_numHome.value,
              type_work_request = select_dis.value,
              date_start = inp_dis_date_start.value,
              date_end = inp_dis_date_end.value,
              executors = [executorSelect.value],
              descr = dis_descr.value,
              type_request = 'Отключение';
        const response = await fetch('/dispatcher/post/planrequest', {
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${token}`,
                'Content-Type' : 'application/json',
                'Accept-Type' : 'application/json'
            },
            body: JSON.stringify({city,street,numHome,type_work_request,date_start,date_end,descr,executors,type_request})
        });
        console.log(response.ok);
        if(response.ok) {
            location.reload();
        }
    }
});
let currResident;
modal_window.addEventListener('click' , (e) => {
    if(e.target == modal_window) {
        CloseModal(modal_window);
        CloseModal(modal_emerg);
        CloseModal(modal_subchoice);
        CloseModal(modal_cap);
        CloseModal(modal_dis);
        ShowModal(modal_choice);
    }
});
modal_close_btn.addEventListener('click', (event) => {
    CloseModal(modal_window);
    CloseModal(modal_emerg);
    CloseModal(modal_subchoice);
    CloseModal(modal_cap);
    CloseModal(modal_dis);
    ShowModal(modal_choice);
});
btn_open_plan_form.addEventListener('click', () => {
    CloseModal(modal_choice);
    ShowModal(modal_subchoice);
});
btn_open_emerg_form.addEventListener('click', () => {
    ShowModal(modal_emerg);
    CloseModal(modal_choice);
});
btn_open_cap_form.addEventListener('click', async () => {
    CloseModal(modal_subchoice);
    ShowModal(modal_cap);
});
btn_open_dis_form.addEventListener('click', () => {
    CloseModal(modal_subchoice);
    ShowModal(modal_dis);
});
modal_open_btns.forEach(item => {
    item.addEventListener('click', () => {
        ShowModal(modal_window);
        ShowModal(modal_choice);
    });
});
modal_send_btn.addEventListener('click', async (event) => {
    // event.preventDefauwlt();
    if(!modal_form_request.checkValidity()) {return;}
    const request = {
        resident: currResident,
        typework: {
            name: modal_form_request.elements['typeproblem'].value,
            work: modal_form_request.elements['select_problem'].value
        },
        descr: modal_form_request.elements['problem_descr'].value,
    }
    const response = await PostRequest(token,request);
    CloseModal(modal_window);
    modal_form_request.reset();
    setRequests();
});

function CloseModal(window) {
    window.classList.add('hide');
    window.classList.remove('show');
    document.body.style.cssText = "overflow:auto;";
}


async function ShowModal(window) {
    window.classList.add('show');
    window.classList.remove('hide');
    document.body.style.cssText = "overflow:hidden;";

    const residents = await getResidents();
    let addresses = [];
    residents.forEach(resident => {
        if(!addresses.includes(resident.address)) {
            resident.address.numApart = resident.numApart;
            addresses.push(resident.address);
        }
    });
    addresses.forEach(address => {
        const option = document.createElement('option');
        option.innerText = address.city;
        if(modal_form_request.elements['city'].innerHTML.includes(option.innerHTML)) {
            return;
        }
        modal_form_request.elements['city'].append(option);
        modal_form_request.elements['city'].value = '';

    });
    modal_form_request.elements['city'].addEventListener('change', () => {
        modal_form_request.elements['street'].innerHTML = '';
        modal_form_request.elements['numHome'].innerHTML = '';
        modal_form_request.elements['numApart'].innerHTML = '';
        modal_form_request.elements['resident'].setAttribute('value', ``);

        addresses.forEach(address => {
            if(address.city == modal_form_request.elements['city'].value) {
                const option = document.createElement('option');
                option.innerText = address.street;
                if(modal_form_request.elements['street'].innerHTML.includes(option.innerHTML)) {
                    return;
                }
                modal_form_request.elements['street'].append(option);
                modal_form_request.elements['street'].value = '';
            }
        });
    });
    modal_form_request.elements['street'].addEventListener('change', () => {
        modal_form_request.elements['numHome'].innerHTML = '';
        modal_form_request.elements['numApart'].innerHTML = '';
        modal_form_request.elements['resident'].setAttribute('value', ``);

        addresses.forEach(address => {
            if(address.city == modal_form_request.elements['city'].value &&
            address.street == modal_form_request.elements['street'].value) {
                const option = document.createElement('option');
                option.innerText = address.numHome;
                if(modal_form_request.elements['numHome'].innerHTML.includes(option.innerHTML)) {
                    return;
                }
                modal_form_request.elements['numHome'].append(option);
                modal_form_request.elements['numHome'].value = '';
            }
        });
    });
    modal_form_request.elements['numHome'].addEventListener('change', () => {
        modal_form_request.elements['numApart'].innerHTML = '';
        modal_form_request.elements['resident'].setAttribute('value', ``);

        addresses.forEach(address => {
            if(address.city == modal_form_request.elements['city'].value &&
            address.street == modal_form_request.elements['street'].value &&
            address.numHome == modal_form_request.elements['numHome'].value) {
                const option = document.createElement('option');
                option.innerText = address.numApart;
                modal_form_request.elements['numApart'].append(option);
                modal_form_request.elements['numApart'].value = '';
            }
        });
    });
    modal_form_request.elements['numApart'].addEventListener('change', () => {
        addresses.forEach(address => {
            if(address.city == modal_form_request.elements['city'].value &&
            address.street == modal_form_request.elements['street'].value &&
            address.numHome == modal_form_request.elements['numHome'].value&&
            address.numApart == modal_form_request.elements['numApart'].value) {
                residents.forEach(resident=>{
                    if(
                        resident.address.city == modal_form_request.elements['city'].value &&
                        resident.address.street == modal_form_request.elements['street'].value &&
                        resident.address.numHome == modal_form_request.elements['numHome'].value &&
                        resident.numApart == modal_form_request.elements['numApart'].value
                    )
                    {
                        modal_form_request.elements['resident'].setAttribute('value', `${resident.surname} ${resident.name} ${resident.patronymic}`);
                        currResident = resident;
                        console.log(currResident);
                    }
                });
            }
        });
    });
    const typeworks = await getTypesWork();
    typeworks.forEach(typework => {
        const option = document.createElement('option');
        option.innerText = typework.name;
        modal_form_request.elements['typeproblem'].append(option);
    });
    typeworks[0].works.forEach(work => {
        const option = document.createElement('option');
        option.innerText = work;
        modal_form_request.elements['select_problem'].append(option);
    });
    modal_form_request.elements['typeproblem'].addEventListener('change', () => {
        modal_form_request.elements['select_problem'].innerHTML = '';
        const works = typeworks.find(work => work.name === modal_form_request.elements['typeproblem'].value).works;
        works.forEach(work => {
            const option = document.createElement('option');
            option.innerText = work;
            modal_form_request.elements['select_problem'].append(option);
        });
    });
}