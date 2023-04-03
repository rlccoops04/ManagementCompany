"use strict"

const useful_links = document.querySelector('.page_useful_blocks'),
      modal_close_btn = document.querySelector('.modal_content_close'),
      modal_window = document.querySelector('.modal'),
      modal_open_btns = document.querySelectorAll('.modal_open_btn'),
      modal_form_request = document.forms["sendRequestForm"],
      modal_send_btn = document.querySelector('.modal_content_input_submit');


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

modal_close_btn.addEventListener('click', (event) => {
    CloseModal(modal_window);
});

modal_open_btns.forEach(item => {
    item.addEventListener('click', () => {
        ShowModal(modal_window);
    });
});

modal_send_btn.addEventListener('click', () => {
    if (modal_form_request.elements['name'].value == "" || 
        modal_form_request.elements['city'].value == "" || 
        modal_form_request.elements['street'].value == "" ||
        modal_form_request.elements['numHome'].value == "" ||
        modal_form_request.elements['numApart'].value == "" ||
        modal_form_request.elements['tel'].value == "" ||
        modal_form_request.elements['email'].value == "" ||
        modal_form_request.elements[7].value == ""
    ) { return; }
    const nameUser = modal_form_request.elements['name'].value;
    const city = modal_form_request.elements['city'].value;
    const street = modal_form_request.elements['street'].value;
    const numHome = modal_form_request.elements['numHome'].value;
    const numApart = modal_form_request.elements['numApart'].value;
    const tel = modal_form_request.elements['tel'].value;
    const email = modal_form_request.elements['email'].value;
    const req_descr = modal_form_request.elements[7].value;
    PostReq(nameUser,city,street,numHome,numApart,tel,email,req_descr);
    modal_form_request.reset();
    CloseModal(modal_window);
});

async function PostReq(nameUser, cityUser, streetUser, numHomeUser, numApartUser, telUser, emailUser, req_descr) {
    const response = await fetch('/send/req', {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            name: nameUser,
            city: cityUser,
            street: streetUser,
            numHome: numHomeUser,
            numApart: numApartUser,
            tel: telUser,
            email: emailUser,
            descr: req_descr
        })
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
    