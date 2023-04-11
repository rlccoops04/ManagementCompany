"use strict"

const useful_links = document.querySelector('.page_useful_blocks'),
      menu = document.querySelector('.header_top_menu'),
      token = localStorage.getItem('token');


useful_links.addEventListener('click', (event) => {
if(event.target == document.querySelector('[data-uslugirf]')) {
    window.open('https://www.gosuslugi.ru/');
}
else if(event.target == document.querySelector('[data-tatenergo]')) {
    window.open('https://tatenergosbyt.ru/');
}
else if(event.target == document.querySelector('[data-uslugirt]')) {
    window.open('https://uslugi.tatarstan.ru/');
}
});

async function getUser(token) {
    const response = await fetch('/get/user', {
        method: "GET",
        headers: { 
            "Accept" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });
    if(response.ok) {
        const user = await response.json();
        return user;
    }
    return null;
}

async function LogStatus() {
    if(token){
        const user = await getUser(token);
        if(user) {
            const login_redirect = document.createElement('a');
            // login_redirect.setAttribute('href','/profile');
            login_redirect.classList.add('header_top_menu_login');
            login_redirect.innerText = user.roles[0];
            menu.append(login_redirect);

            // const logout = document.createElement('button');
            // logout.style.cssText = 'position: absolute;top: 10px;right: 120px;background:none;border:none;   font-weight: 300;color:white;';
            // logout.innerText = 'Выход';
            login_redirect.addEventListener('click', () => {
                localStorage.removeItem('token');
                location.reload();
            });
            menu.append(logout);
        }
        else {
            console.log('login')
            const login_redirect = document.createElement('a');
            login_redirect.setAttribute('href','/login');
            login_redirect.classList.add('header_top_menu_login');
            login_redirect.innerText = 'Вход';
            menu.append(login_redirect);
        }
    }
    else {
        console.log('login')
        const login_redirect = document.createElement('a');
        login_redirect.setAttribute('href','/login');
        login_redirect.classList.add('header_top_menu_login');
        login_redirect.innerText = 'Вход';
        menu.append(login_redirect);
    }

}

LogStatus();



const modal_close_btn = document.querySelector('.modal_content_close'),
      modal_window = document.querySelector('.modal'),
      modal_content = document.querySelector('.modal_content'),
      modal_answer = document.querySelector('.modal_answer'),
      modal_answer_content = document.querySelector('.modal_answer_content'),
      modal_answer_content_text = document.querySelector('.modal_answer_content_text'),
      modal_open_btns = document.querySelectorAll('.modal_open_btn'),
      modal_form_request = document.forms["sendRequestForm"],
      modal_send_btn = document.querySelector('.modal_content_input_submit');

modal_close_btn.addEventListener('click', (event) => {
    CloseModal(modal_window);
});

modal_open_btns.forEach(item => {
    item.addEventListener('click', () => {
        ShowModal(modal_window);
    });
});

modal_send_btn.addEventListener('click', async (event) => {
    event.preventDefault();
    var date = new Date();

    if(!modal_form_request.checkValidity()) {return;}
    const request = {
        name: modal_form_request.elements['name'].value,
        address: {
            city: modal_form_request.elements['city'].value,
            street: modal_form_request.elements['street'].value,
            numHome: modal_form_request.elements['numHome'].value,
            numApart: modal_form_request.elements['numApart'].value
        },
        tel: modal_form_request.elements['tel'].value,
        email: modal_form_request.elements['email'].value,
        descr: modal_form_request.elements[7].value,
        type: 'Аварийный ремонт',
        status: 'Новая',
        executor: 'Не назначен',
        date: ("0" + (date.getDate())).slice(-2) + '.' + ("0" + (date.getMonth())).slice(-2) + '.' + date.getFullYear()
    }
    const response = await PostReq(request);
    CloseModal(modal_content);
    ShowModal(modal_answer);
    if(response.ok) {
        modal_answer_content_text.innerText = 'Заявка успешно отправлена!';
    }
    else {
        modal_answer_content_text.innerText = 'Возникла ошибка, попробуйте позже!';
    }
    modal_form_request.reset();
});

document.querySelector('.modal_answer_content_btn').addEventListener('click', () => {
    CloseModal(modal_window);
    CloseModal(modal_answer);
    ShowModal(modal_content);
});

async function PostReq(request) {
    const response = await fetch('/post/request', {
        method: "POST",
        headers: { 
            "Accept": "application/json", "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
        },
        body: JSON.stringify(request)
    });
    return response;
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