"use strict"

const form = document.forms['loginForm'],
      login_btn = document.querySelector('.form_login_btn');

async function auth(loginUser,passwordUser) {
    const response = await fetch('/auth/login', {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            username: loginUser,
            password: passwordUser
        })
    });
    if (response.ok) {
        const token = await response.json();
        console.log(token);
        localStorage.setItem('token', `${token}`);
        location = '/'
    }
    else {
        console.log('ошибка');
    }
}

login_btn.addEventListener('click', (event) => {
    event.preventDefault();
    console.log(form['login'].value, form['password'].value);
    auth(form['login'].value, form['password'].value);
});
