import {getResidents,postResident, EditResident, DeleteResident} from '../js/fetchs.js';

const token = localStorage.getItem('token'),
      table = document.querySelector('.main_residents_table_content'),
      modal_close_btn = document.querySelector('.modal_content_close'),
      modal_open_btn = document.querySelector('.add_resident_btn'),
      modal_send_btn = document.querySelector('.modal_content_input_submit'),
      modal_edit_btn = document.querySelector('.modal_edit_input_submit'),
      form = document.forms['sendRequestForm'],
      form_edit = document.forms['edit_resident'],
      modal_create = document.querySelector('.modal_content'),
      modal_edit = document.querySelector('.modal_edit'),  
      modal_window = document.querySelector('.modal');
let residents = [];

async function start() {
    residents = await getResidents(token);
    residents.forEach(resident => {
        createRow(resident);
    });
}

function createRow(resident) {
    const row = document.createElement('div');
    row.classList.add('main_residents_table_content_row');
    row.style.cssText = "height: 100px;border-bottom: 1px solid gray;border-left: 1px solid gray;border-right: 1px solid gray;";
    const {_id,surname,name,patronymic,address,tel, numApart} = resident;
    
    const id_column = document.createElement('div');
    const name_column = document.createElement('div');
    const address_column = document.createElement('div');
    const contacts_column = document.createElement('div');

    id_column.style.cssText = 'width: 250px;';
    name_column.style.cssText = 'width: 300px;';
    address_column.style.cssText = 'width: 400px;';
    contacts_column.style.cssText = 'width: 220px;';

    id_column.innerText = _id;
    name_column.innerHTML = `<strong>Фамилия: </strong>${surname}<br><strong>Имя: </strong>${name}<br><strong>Отчество: </strong>${patronymic}`;
    address_column.innerHTML = `<strong>Город: </strong>${address.city}<br> <strong>Улица: </strong>${address.street}<br> <strong>Дом: </strong> ${address.numHome}<br> <strong>Квартира: </strong>${numApart}`;
    contacts_column.innerHTML = `<strong>Телефон: </strong>${tel}`;

    row.append(id_column);
    row.append(name_column);
    row.append(address_column);
    row.append(contacts_column);

    const btns_block = document.createElement('div');
    btns_block.style.cssText = 'display:flex;flex-direction:column;';
    const edit_btn = document.createElement('button');
    edit_btn.style.cssText = 'width: 30px;height: 30px; padding:0;background: none;border:none;position: relative;';
    const edit_img = document.createElement('img');
    edit_img.setAttribute('src', '../images/edit.png');
    edit_img.style.cssText = 'width: 30px;height: 30px;';
    edit_btn.append(edit_img);
    btns_block.append(edit_btn);

    edit_btn.addEventListener('click', (e) => {
        form_edit.elements['id'].value = resident._id;
        form_edit.elements['city'].value = resident.address.city;
        form_edit.elements['street'].value = resident.address.street;
        form_edit.elements['numHome'].value = resident.address.numHome;
        form_edit.elements['numApart'].value = resident.numApart;
        form_edit.elements['surname'].value = resident.surname;
        form_edit.elements['name'].value = resident.name;
        form_edit.elements['patronymic'].value = resident.patronymic,
        form_edit.elements['tel'].value = resident.tel;
        modal_edit_btn.value = 'Сохранить изменения';
        console.log(resident);
        ShowModal(modal_edit);
    });
    const remove_btn = document.createElement('button');
    remove_btn.style.cssText = 'width: 30px;height: 30px; padding:0;background: none;border:none;position: relative;margin-top:8px;';
    const remove_img = document.createElement('img');
    remove_img.setAttribute('src', '../images/remove.png');
    remove_img.style.cssText = 'width: 30px;height: 30px;';
    remove_btn.append(remove_img);    
    btns_block.append(remove_btn);
    remove_btn.addEventListener('click' , () => {
        DeleteResident(token, resident._id);
        row.remove();
    });

    row.append(btns_block);
    table.append(row);
}
start();

// sort_by_address_btn.addEventListener('click', () => {
//     table.innerHTML = '';
//     residents.sort((a,b) => a.surname > b.surname ? 1 : -1);
//     residents.forEach(resident => {
//         createRow(resident);
//     });
// });

//modal

modal_close_btn.addEventListener('click', () => {
    CloseModal(modal_create);
});

modal_open_btn.addEventListener('click', () => {
    ShowModal(modal_create);
});

modal_send_btn.addEventListener('click', async (e) => {
    if(form.checkValidity()) {
        const city = form.elements['city'].value,
              street = form.elements['street'].value,
              numHome = form.elements['numHome'].value,
              numApart = form.elements['numApart'].value,
              surname = form.elements['surname'].value,
              name = form.elements['name'].value,
              patronymic = form.elements['patronymic'].value,
              tel = form.elements['tel'].value;
        const resident = {
            surname,
            name,
            patronymic,
            tel,
            numApart: Number(numApart),
            city,
            street,
            numHome: numHome
        }
        const result = await postResident(token,resident);
    }
});
modal_edit_btn.addEventListener('click', async (e) => {
    const id = form_edit.elements['id'].value,
              city = form_edit.elements['city'].value,
              street = form_edit.elements['street'].value,
              numHome = form_edit.elements['numHome'].value,
              numApart = form_edit.elements['numApart'].value,
              surname = form_edit.elements['surname'].value,
              name = form_edit.elements['name'].value,
              tel = form_edit.elements['tel'].value;
    const resident = {id,city,street,numHome,numApart,surname,name,tel};
    const result = await EditResident(token,resident);
});

function CloseModal(window) {
    modal_window.classList.remove('show');
    modal_window.classList.add('hide');
    window.classList.remove('show');
    window.classList.add('hide');
}
function ShowModal(window) {
    modal_window.classList.remove('hide');
    modal_window.classList.add('show');
    window.classList.remove('hide');
    window.classList.add('show');
}