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
            login_redirect.setAttribute('href','/profile');
            login_redirect.classList.add('header_top_menu_login');
            login_redirect.innerText = user.roles[0];
            menu.append(login_redirect);

            const logout = document.createElement('button');
            logout.style.cssText = 'position: absolute;top: 10px;right: 120px;background:none;border:none;color:white;';
            logout.innerText = 'Выход';
            logout.addEventListener('click', () => {
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