import {getReports} from '../js/fetchs.js'
const content = document.querySelector('.main_table_content'),
      token = localStorage.getItem('token');

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
    numColumn.innerHTML = `№${report._id} <span style='font-size:13px;color:gray;'>${report.date}</span>`;
    aboutColumn.innerHTML = `<strong>Id: </strong>№${report.request._id}<br>
    <strong>Заявитель: </strong>${report.request.resident.surname} ${report.request.resident.name} ${report.request.resident.patronymic}<br>
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
    numColumn.style.cssText = 'width: 450px;';
    aboutColumn.style.cssText = 'width: 500px;font-size: 15px;';
    row.append(numColumn);
    row.append(aboutColumn);
    row.append(resultColumn);
    row.style.cssText = 'padding: 5px; display: flex;border-bottom: 1px solid gray;';
    content.append(row);

}