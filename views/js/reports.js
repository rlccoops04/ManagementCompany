import {getReports} from '../js/fetchs.js'
const content = document.querySelector('.main_table_content'),
      token = localStorage.getItem('token'),
      select_sort = document.querySelector('.select_sort'),
      search_input = document.querySelector('#search'),
      search_btns = document.querySelectorAll('.search_request');

let reports;
async function setReports() {
    reports = await getReports(token);
    console.log(reports);
    reports.forEach(report => {
        createReport(report);
    })
}
setReports();
function createReport(report) {
    const row = document.createElement('div'),
          numColumn = document.createElement('div'),
          aboutColumn = document.createElement('div'),
          resultColumn = document.createElement('div');
    numColumn.innerHTML = `№${report._id}<br><span style='font-size:12px;color:gray;'>от ${report.date}</span>`;
    aboutColumn.innerHTML = `
    <strong>Заявитель: </strong><a style='color: blue;' href='residents/${report.request.resident._id}'>${report.request.resident.surname} ${report.request.resident.name} ${report.request.resident.patronymic}</a> <span style='font-size:12px;color:gray'>${report.request.resident.tel}</span><br>
    <strong>Адрес: </strong>${report.request.resident.address.city} ${report.request.resident.address.street} ${report.request.resident.address.numHome} ${report.request.resident.numApart} <br>
    <strong>Дата: </strong>${report.request.date} <br>
    <strong>Тип заявки: </strong>${report.request.type} <br>
    <strong>Тип работы: </strong>${report.request.typework.name} -> ${report.request.typework.work} <br>
    <strong>Описание: </strong>${report.request.descr}<br>
    <strong>Приоритет: </strong>${report.request.priority} `;
    resultColumn.innerHTML = `<strong>Обработал: </strong> ${report.request.dispatcher.surname} + ${report.request.dispatcher.name}<br>
    <strong>Выполнил: </strong> ${report.request.executor.surname} ${report.request.executor.name}<br>
    <strong>Фото-отчёт: </strong>`;
    const button = document.createElement('a');
    button.style.cssText = 'cursor: pointer;color: blue;';
    button.innerText = 'Показать';
    button.addEventListener('click', (e) => {
        const window = document.createElement('div');
        window.style.cssText = 'width: 100%;height: 100vh;background-color: rgba(0,0,0,0.7);position: absolute;top:0;right:0;';
        const img = document.createElement('img');
        img.src = report.img;
        img.style.cssText = 'height: 80%;position: absolute;top: 10%;left:50%;transform: translateX(-50%)';
        window.append(img);
        window.addEventListener('click', (e) => {
            if(e.target != img) {
                window.remove();
            }
        });
        const body = document.querySelector('body');
        body.append(window);
    });
    resultColumn.append(button);
    numColumn.style.cssText = 'width: 380px;font-size: 14px;';
    aboutColumn.style.cssText = 'width: 500px;font-size: 14px;margin-left: 10px;';
    resultColumn.style.cssText = 'width: 250px;font-size: 14px;margin-left: 10px;';
    row.append(numColumn);
    row.append(aboutColumn);
    row.append(resultColumn);
    row.style.cssText = 'padding: 5px; display: flex;border-bottom: 1px solid gray;';
    content.append(row);

}

select_sort.addEventListener('change', () => {
    content.innerHTML = ``;
    let sortBy = select_sort.value;
    if(sortBy == 'dateup') {
        reports = reports.sort((a,b) => a.date > b.date ? 1 : -1);
    }
    else if(sortBy == 'datedown') {
        reports = reports.sort((a,b) => a.date < b.date ? 1 : -1);
    }
    else if(sortBy == 'adrup') {
        reports = reports.sort((a,b) => `${a.request.resident.address.city} ${a.request.resident.address.street} ${a.request.resident.address.numHome} ${a.request.resident.numApart}` > `${b.request.resident.address.city} ${b.request.resident.address.street} ${b.request.resident.address.numHome} ${b.request.resident.numApart}` ? 1 : -1);
    }
    else if(sortBy == 'adrdown') {
        reports = reports.sort((a,b) => `${a.request.resident.address.city} ${a.request.resident.address.street} ${a.request.resident.address.numHome} ${a.request.resident.numApart}` < `${b.request.resident.address.city} ${b.request.resident.address.street} ${b.request.resident.address.numHome} ${b.request.resident.numApart}` ? 1 : -1);
    }
    else if(sortBy == 'statusup') {
        reports = reports.sort((a,b) => `${a.request.resident.surname} ${a.request.resident.name} ${a.request.resident.patronymic}` > `${b.request.resident.surname} ${b.request.resident.name} ${b.request.resident.patronymic}` ? 1 : -1);
    }
    else if(sortBy == 'statusdown') {
        reports = reports.sort((a,b) => `${a.request.resident.surname} ${a.request.resident.name} ${a.request.resident.patronymic}` < `${b.request.resident.surname} ${b.request.resident.name} ${b.request.resident.patronymic}` ? 1 : -1);
    }
    else if(sortBy == 'priorityup') {
        reports = reports.sort((a,b) => a.request.priority > b.request.priority ? 1 : -1);
    }
    else if(sortBy == 'prioritydown') {
        reports = reports.sort((a,b) => a.request.priority < b.request.priority ? 1 : -1);
    }
    else if(sortBy == 'typeup') {
        reports = reports.sort((a,b) => a.request.type > b.request.type ? 1 : -1);
    }
    else if(sortBy == 'typedown') {
        reports = reports.sort((a,b) => a.request.type < b.request.type ? 1 : -1);
    }
    reports.forEach(report => {
        createReport(report);
    });
});

search_btns.forEach(btn => {
    btn.addEventListener('click', () => {
        content.innerHTML = ``;
        const search = search_input.value;
        if(search) {
            const s = reports.filter(report => report._id == search ||
                report.request.resident.address.city == search ||
                `${report.request.resident.address.city} ${report.request.resident.address.street}` == search ||
                `${report.request.resident.address.city} ${report.request.resident.address.street} ${report.request.resident.address.numHome}` == search ||
                `${report.request.resident.address.city} ${report.request.resident.address.street} ${report.request.resident.address.numHome} ${report.request.resident.numApart}` == search ||
                search.includes(report.request.resident.surname) ||
                search.includes(report.request.resident.name) ||
                search.includes(report.request.resident.patronymic) ||
                search.includes(report.request.status) ||
                search.includes(report.request.type) ||
                search.includes(report.request.status) ||
                search.includes(report.request.typework.name) ||
                search.includes(report.request.typework.work) ||
                report.request.descr.includes(search));
            s.forEach(req => {
                createReport(req);
            });
        } else {
            reports.forEach(request => {
                createReport(request);
            });
        }
    });
});
