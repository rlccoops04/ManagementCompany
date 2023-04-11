const modal_close_btn = document.querySelector('.modal_content_close'),
      modal_window = document.querySelector('.modal'),
      modal_open_btn = document.querySelector('.main_create_user_btn'),
      modal_form_request = document.forms["createNewUser"],
      modal_send_btn = document.querySelector('.modal_content_input_submit');


modal_close_btn.addEventListener('click', (event) => {
    CloseModal(modal_window);
});

//Кнопка создания заявки для открытия формы
modal_open_btn.addEventListener('click', () => {
    ShowModal(modal_window);
});

//Кнопка создания заявки для отправки на сервер
modal_send_btn.addEventListener('click', async () => {
    if(!modal_form_request.checkValidity()) {return;}
    const user = {
        name: modal_form_request.elements['name'].value,
        address: {
            city: modal_form_request.elements['city'].value,
            street: modal_form_request.elements['street'].value,
            numHome: modal_form_request.elements['numHome'].value,
            numApart: modal_form_request.elements['numApart'].value
        },
        tel: modal_form_request.elements['tel'].value,
        email: modal_form_request.elements['email'].value,
        username: modal_form_request.elements['login'].value,
        password: modal_form_request.elements['password'].value,
        role: modal_form_request['role'].value
    }
    const response = await PostUser(user);
    console.log(response);
    // CreateRequest(response);
    // modal_form_request.reset();
    // CloseModal(modal_window);
});

//Запрос на добавление новой заявки
async function PostUser(user) {
    const response = await fetch('/auth/registration', {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(user)
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

const users_table = document.querySelector('.main_users_table_content'),
      token = localStorage.getItem('token');


async function GetUsers() {
    const response = await fetch("/dispatcher/get/users", {
        method: "GET",
        headers: { 
            "Accept" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });

    if(response.ok) {
        const users = await response.json();
        console.log('Получены все пользователи');
        users.forEach(item => {
            CreateUser(item);
        });
    }
    else {
        if(response.status == 403) {
            console.log('Не уполномочен');
            window.location.replace("/");
        }
        else if(response.status == 401){
            console.log('Не авторизован');
            window.location.replace("/login");
        }
        else {
            console.log('Ошибка при получении запроса');
        }
        console.log(response.status);
    } 
}
function CreateUser(user) {
    const row = document.createElement('div');
    row.classList.add('main_users_table_content_row');
    if(user.roles[0] == 'Диспетчер') {
        row.style.cssText = 'background-color: orange;';
    }
    else if(user.roles[0] == 'Специалист') {
        row.style.cssText = 'background-color: yellow;';
    }

    const items = [];
    for(let i = 0; i < 8; i++) {
        const item = document.createElement('div');
        item.classList.add('main_users_table_content_row_item');
        items.push(item);
    }
    items[0].setAttribute('style', 'width:200px;');
    items[1].setAttribute('style', 'width:160px;;');
    items[2].setAttribute('style', 'width:160px;;');
    items[3].setAttribute('style', 'width:100px;;');
    items[4].setAttribute('style', 'width:160px;;');
    items[5].setAttribute('style', 'width:140px;;');
    items[6].setAttribute('style', 'width:140px;;');
    items[7].setAttribute('style', 'width:100px;;');

    items[0].innerHTML =`<span style="font-size:12px;">№${user._id}</span>`;
    items[1].innerHTML = `${user.name}`;
    items[2].innerHTML = user.address.city +', ' + user.address.street + ', ' + user.address.numHome + ', ' + user.address.numApart;
    items[3].innerHTML = `${user.tel}`;
    items[4].innerHTML = `${user.email}`;
    items[5].innerHTML = `${user.username}`;
    items[6].innerHTML = `${user.password}`;
    items[7].innerHTML = `${user.roles[0]}`;

    items.forEach(item => {
        row.append(item);
    });
    users_table.append(row);
}
GetUsers();