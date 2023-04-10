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