"use strict"

const modal_close_btn = document.querySelector('.modal_content_close'),
      modal_window = document.querySelector('.modal'),
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
    console.log(request);
    const response = await PostReq(request);
    console.log(response);
    CreateRequest(response);
    modal_form_request.reset();
    CloseModal(modal_window);
});

async function PostReq(request) {
    const response = await fetch('/post/request', {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(request)
    });
    if (response.ok) {
        console.log('yes');
    }
    else {console.log('no');}
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
    