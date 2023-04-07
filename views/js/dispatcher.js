"use strict"

const requests_table = document.querySelector('.main_requests_table_content');

//Получение всех заявок
async function GetRequests() {
    const response = await fetch("/get/requests", {
        method: "GET",
        header: { "Accept" : "application/json" }
    });

    if(response.ok === true) {
        const requests = await response.json();
        requests.forEach(item => {
            CreateRequest(item);
        });
    }
    else {
        console.log('err by get request');
    } 
}
//Изменение заявки
async function EditRequest(requestId, requestExecutor, requestStatus) {
    const response = await fetch('/put/request/' + requestId,{
        method: "PUT",
        headers: {
            "Accept" : "application/json", "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            executor: requestExecutor,
            status: requestStatus
        })
    });
}

//Удаление заявки
async function DeleteRequest(id) {
    const response = await fetch('/delete/request/' + id, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
        }
    });
}

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
    items[0].setAttribute('style', 'width: 200px;height:100px;');
    items[1].setAttribute('style', 'width: 200px;height:100px;');
    items[2].setAttribute('style', 'width: 110px;height:100px;');
    items[3].setAttribute('style', 'width: 200px;height:100px;');
    items[4].setAttribute('style', 'width: 140px;height:100px;');
    items[5].setAttribute('style', 'width: 250px;height:100px;');
    
    //Номер заявки и дата
    items[0].innerHTML =`<span style="font-size:13px;">№${request._id}</span>` + '<br>' + request.date;
    
    //Адрес и заявитель
    items[1].append(request.city +', ' + request.street + ', ' + request.numHome + ', ' + request.numApart);

    //Вид заявки
    items[2].append(request.type);
    items[3].append(request.executor);
    items[4].append(request.status);
    items[5].append(request.descr);

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
    btn_block_edit_btn.addEventListener('click', () => {
        const combobox = document.createElement('select');
        combobox.classList.add('main_requests_table_content_row_item_combobox');
        combobox.innerHTML = '<option>Не назначен</option><option>2</option>'
        items[3].innerHTML = ``;
        items[3].append(combobox);

        const confirm_btn = document.createElement('button');
        confirm_btn.classList.add('main_requests_table_content_row_item_confirm_btn');
        confirm_btn.innerHTML = `<img src="images/confirm.png" alt="">`;
        confirm_btn.addEventListener('click', () => {
            if(!(combobox.value == 'Не назначен') && confirm("Изменить исполнителя у заявки?"))
            {
                combobox.replaceWith(combobox.value);
                const req = EditRequest(request._id, combobox.value, 'Передана');
                console.log(req);
                confirm_btn.replaceWith(btn_block_edit_btn);
                row.style.cssText = "background-color: rgb(255, 248, 117);";
                items[4].innerHTML = `Передана`;
            }
            else {
                confirm_btn.replaceWith(btn_block_edit_btn);
                items[3].innerHTML = `Не назначен`;
            }

        });
        btn_block_edit_btn.replaceWith(confirm_btn);
    });

    //Кнопка отмены заявки так же доступна лишь для новой заявки
    btn_block_remove_btn.addEventListener('click', () => {
        // const result = prompt("Причина отмены заявки: ");
        const req = EditRequest(request._id, request.executor, 'Отмена');
        row.style.cssText = "background-color: rgb(255, 117, 117);";
        items[4].innerHTML = `Отмена`;
        console.log(req);
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
    else if(request.status == "Выполена") {
        row.style.cssText = "background-color: rgb(135, 255, 117);";
    }
    else if(request.status == "Отмена") 
    {
        row.style.cssText = "background-color: rgb(255, 117, 117);";
        btn_block_edit_btn.setAttribute('disabled','');

        //Кнопка отмены заявки будет удалять её, если она уже отменена
        btn_block_remove_btn.addEventListener('click', () => {
            row.remove();
            DeleteRequest(request._id);
        });
    }



    btn_block_edit.append(btn_block_edit_btn);
    btn_block_remove.append(btn_block_remove_btn);

    btn_block.append(btn_block_edit);
    btn_block.append(btn_block_remove);
    row.append(btn_block);

    requests_table.append(row);
}

GetRequests();

//Модальное окно создания заявки
const modal_close_btn = document.querySelector('.modal_content_close'),
      modal_window = document.querySelector('.modal'),
      modal_open_btns = document.querySelectorAll('.modal_open_btn'),
      modal_form_request = document.forms["sendRequestForm"],
      modal_send_btn = document.querySelector('.modal_content_input_submit');

//Кнопка закрытия заявки
modal_close_btn.addEventListener('click', (event) => {
    CloseModal(modal_window);
});

//Кнопка создания заявки для открытия формы
modal_open_btns.forEach(item => {
    item.addEventListener('click', () => {
        ShowModal(modal_window);
    });
});

//Кнопка создания заявки для отправки на сервер
modal_send_btn.addEventListener('click', async () => {
    var date = new Date();

    if(!modal_form_request.checkValidity()) {return;}
    const request = {
        nameUser: modal_form_request.elements['name'].value,
        city: modal_form_request.elements['city'].value,
        street: modal_form_request.elements['street'].value,
        numHome: modal_form_request.elements['numHome'].value,
        numApart: modal_form_request.elements['numApart'].value,
        tel: modal_form_request.elements['tel'].value,
        email: modal_form_request.elements['email'].value,
        descr: modal_form_request.elements[7].value,
        type: 'Аварийная',
        status: 'Новая',
        executor: 'Не назначен',
        date: ("0" + (date.getDate())).slice(-2) + '.' + ("0" + (date.getMonth())).slice(-2) + '.' + date.getFullYear()
    }
    const response = await PostReq(request);
    console.log(response);
    CreateRequest(response);
    modal_form_request.reset();
    CloseModal(modal_window);
});

//Запрос на добавление новой заявки
async function PostReq(request) {
    const response = await fetch('/post/request', {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(request)
    });
    if (response.ok) {
        console.log(response.json());
        return response.json();
    }
    else {null;}
}

function CloseModal(window) {
    window.classList.add('hide');
    window.classList.remove('show');
    document.body.style.cssText = "overflow:auto;";
}
function ShowModal(window) {
    window.classList.add('show');
    window.classList.remove('hide');
    document.body.style.cssText = "overflow:hidden;";
}
    