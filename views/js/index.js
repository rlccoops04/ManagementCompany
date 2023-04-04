"use strict"

const useful_links = document.querySelector('.page_useful_blocks');

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
