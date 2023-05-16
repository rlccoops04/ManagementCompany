import {getResidents, PostUser, GetUsers, GetEmployees, DeleteUser, PostEmployee, DeleteEmployee} from '../js/fetchs.js';

const modal_close_btn = document.querySelector('.modal_content_close'),
      modal_window = document.querySelector('.modal'),
      modal_create_user = document.querySelector('.modal_content'),
      modal_create_employee = document.querySelector('.modal_create_employee'),
      modal_select = document.querySelector('.modal_select'),
      modal_open_btn = document.querySelector('.main_create_user_btn'),
      modal_create_employee_btn = document.querySelector('.modal_select_btn_employee'),
      modal_create_user_btn = document.querySelector('.modal_select_btn_user'),
      modal_form_request = document.forms["createNewUser"],
      modal_form_employee = document.forms['createNewEmployee'],
      modal_send_btn = document.querySelector('.modal_content_input_submit'),
      modal_send_employee_btn = document.querySelector('.modal_employee_input_submit'),
      users_table = document.querySelector('.main_users_table_content'),
      token = localStorage.getItem('token'),
      select_role = document.querySelector('.select_role'),
      search_btns = document.querySelectorAll('.search_user'),
      search_input = document.querySelector('#search'),
      table_headers = document.querySelectorAll('.main_users_table_titles_item');
let users,employees, sortedList;
let counter = true;
let sortedBy;

select_role.addEventListener('change', () => {
    users_table.innerHTML = ``;
    if(select_role.value == 'Все') {
        sortedList.forEach(user => {
            CreateUser(user);
        });
    }
    else if(select_role.value == 'Пользователь') {
        users.forEach(user => {
            CreateUser(user);
        });
    }
    else {
        employees.forEach(employee => {
            if(employee.roles.includes(select_role.value)) {
                CreateUser(employee);
            }
        });
    }
});

search_btns.forEach(search_btn => {
    search_btn.addEventListener('click', () => {
        users_table.innerHTML = '';
        const search = search_input.value;
        if(search) {
            if(select_role.value == 'Все') {
                const s = sortedList.filter(user => user.roles[0] == 'Пользователь' ? user._id == search || 
                    user.resident.surname == search || 
                    user.resident.name == search || 
                    `${user.resident.surname} ${user.resident.name}` == search ||
                    `${user.resident.surname} ${user.resident.name} ${user.resident.patronymic}` == search || 
                    user.resident.tel == search ||
                    user.username == search || 
                    user.password == search || 
                    user.roles.includes(search) || 
                    user.resident.address.city == search || 
                    user.resident.address.street == search || 
                    user.resident.address.numHome == search|| 
                    user.resident.numApart == search || 
                    `${user.resident.address.city} ${user.resident.address.street}` == search ||
                    `${user.resident.address.city} ${user.resident.address.street} ${user.resident.address.numHome}` == search || 
                    `${user.resident.address.city} ${user.resident.address.street} ${user.resident.address.numHome} ${user.resident.numApart}` == search : user._id == search|| user.surname == search || user.name == search || `${user.surname} ${user.name}` == search ||user.tel == search ||user.username == search || user.password == search || user.roles.includes(search));
                console.log(s);
                s.forEach(user => {
                    CreateUser(user);
                });
            }
            else if(select_role.value == 'Пользователь') {
                const s = users.filter(user =>user._id == search || 
                    user.resident.surname == search || 
                    user.resident.name == search || 
                    `${user.resident.surname} ${user.resident.name}` == search ||
                    `${user.resident.surname} ${user.resident.name} ${user.resident.patronymic}` == search || 
                    user.resident.tel == search ||
                    user.username == search || 
                    user.password == search || 
                    user.roles.includes(search) || 
                    user.resident.address.city == search || 
                    user.resident.address.street == search || 
                    user.resident.address.numHome == search|| 
                    user.resident.numApart == search || 
                    `${user.resident.address.city} ${user.resident.address.street}` == search ||
                    `${user.resident.address.city} ${user.resident.address.street} ${user.resident.address.numHome}` == search || 
                    `${user.resident.address.city} ${user.resident.address.street} ${user.resident.address.numHome} ${user.resident.numApart}` == search);
                s.forEach(user => {
                console.log(user.surname);
                CreateUser(user);
                });
            }
            else {
                const e = employees.filter(user => (user._id == search|| user.surname == search || user.name == search || `${user.surname} ${user.name}` == search ||user.tel == search ||user.username == search || user.password == search) && user.roles.includes(select_role.value))
                e.forEach(employee => {
                    CreateUser(employee);
                });
            }
        }
        else {
            sortedList.forEach(user => {
                CreateUser(user);
            });
        }
    });
});

modal_create_employee_btn.addEventListener('click' , () => {
    CloseModal(modal_select);
    ShowModal(modal_create_employee);
});
modal_create_user_btn.addEventListener('click', () => {
    CloseModal(modal_select);
    ShowModalCreateUser(modal_create_user);
});
modal_close_btn.addEventListener('click', (event) => {
    CloseModal(modal_window);
    CloseModal(modal_create_user);
    CloseModal(modal_create_employee);
});

//Кнопка создания заявки для открытия формы
modal_open_btn.addEventListener('click', () => {
    ShowModal(modal_window);
    ShowModal(modal_select);
});

modal_send_btn.addEventListener('click', async (e) => {
    if(!modal_form_request.checkValidity()) {return;}
    const user = {
        resident: currResident,
        username: modal_form_request.elements['login'].value,
        password: modal_form_request.elements['password'].value,
        role: 'Пользователь'
    }
    const response = await PostUser(token, user);
    const newUser = await response.json();
    CreateUser(newUser);
    // modal_form_request.reset();
    // CloseModal(modal_window);
});

modal_send_employee_btn.addEventListener('click', async (e) => {
    if(!modal_form_employee.checkValidity()) {return;}
    let role;
    modal_form_employee.elements['role'].forEach(item => {
        if(item.checked) {
            role = item.value;
        }
    });
    const employee = {
        surname: modal_form_employee.elements['surname'].value,
        name: modal_form_employee.elements['name'].value,
        tel: modal_form_employee.elements['tel'].value,
        username: modal_form_employee.elements['login'].value,
        password: modal_form_employee.elements['password'].value,
        role
    }
    const empl = await PostEmployee(token, employee);
    if(empl) {
        CreateUser(empl);
    }
});

function CloseModal(window) {
    window.classList.add('hide');
    window.classList.remove('show');
    document.body.style.cssText = "overflow:auto;";
}
function ShowModal(window) {
    window.classList.add('show');
    window.classList.remove('hide');
    document.body.style.cssText = "overflow:auto;";
}
let currResident;
async function ShowModalCreateUser(window) {
    window.classList.add('show');
    window.classList.remove('hide');
    document.body.style.cssText = "overflow:hidden;";

    const residents = await getResidents();
    let addresses = [];
    residents.forEach(resident => {
        if(!addresses.includes(resident.address)) {
            resident.address.numApart = resident.numApart;
            addresses.push(resident.address);
        }
    });
    addresses.forEach(address => {
        const option = document.createElement('option');
        option.innerText = address.city;
        if(modal_form_request.elements['city'].innerHTML.includes(option.innerHTML)) {
            return;
        }
        modal_form_request.elements['city'].append(option);
        modal_form_request.elements['city'].value = '';

    });
    modal_form_request.elements['city'].addEventListener('change', () => {
        modal_form_request.elements['street'].innerHTML = '';
        modal_form_request.elements['numHome'].innerHTML = '';
        modal_form_request.elements['numApart'].innerHTML = '';
        modal_form_request.elements['resident'].setAttribute('value', ``);

        addresses.forEach(address => {
            if(address.city == modal_form_request.elements['city'].value) {
                const option = document.createElement('option');
                option.innerText = address.street;
                if(modal_form_request.elements['street'].innerHTML.includes(option.innerHTML)) {
                    return;
                }
                modal_form_request.elements['street'].append(option);
                modal_form_request.elements['street'].value = '';
            }
        });
    });
    modal_form_request.elements['street'].addEventListener('change', () => {
        modal_form_request.elements['numHome'].innerHTML = '';
        modal_form_request.elements['numApart'].innerHTML = '';
        modal_form_request.elements['resident'].setAttribute('value', ``);

        addresses.forEach(address => {
            if(address.city == modal_form_request.elements['city'].value &&
            address.street == modal_form_request.elements['street'].value) {
                const option = document.createElement('option');
                option.innerText = address.numHome;
                if(modal_form_request.elements['numHome'].innerHTML.includes(option.innerHTML)) {
                    return;
                }
                modal_form_request.elements['numHome'].append(option);
                modal_form_request.elements['numHome'].value = '';
            }
        });
    });
    modal_form_request.elements['numHome'].addEventListener('change', () => {
        modal_form_request.elements['numApart'].innerHTML = '';
        modal_form_request.elements['resident'].setAttribute('value', ``);

        addresses.forEach(address => {
            if(address.city == modal_form_request.elements['city'].value &&
            address.street == modal_form_request.elements['street'].value &&
            address.numHome == modal_form_request.elements['numHome'].value) {
                const option = document.createElement('option');
                option.innerText = address.numApart;
                modal_form_request.elements['numApart'].append(option);
                modal_form_request.elements['numApart'].value = '';
            }
        });
    });
    modal_form_request.elements['numApart'].addEventListener('change', () => {
        addresses.forEach(address => {
            if(address.city == modal_form_request.elements['city'].value &&
            address.street == modal_form_request.elements['street'].value &&
            address.numHome == modal_form_request.elements['numHome'].value&&
            address.numApart == modal_form_request.elements['numApart'].value) {
                residents.forEach(resident=>{
                    if(
                        resident.address.city == modal_form_request.elements['city'].value &&
                        resident.address.street == modal_form_request.elements['street'].value &&
                        resident.address.numHome == modal_form_request.elements['numHome'].value &&
                        resident.numApart == modal_form_request.elements['numApart'].value
                    )
                    {
                        modal_form_request.elements['resident'].setAttribute('value', `${resident.surname} ${resident.name}`);
                        currResident = resident;
                        console.log(currResident);
                    }
                });
            }
        });
    });

}

function CreateUser(user) {
    const row = document.createElement('div');
    row.classList.add('main_users_table_content_row');
    if(counter) {
        row.style.cssText = 'background-color: rgb(226, 226, 226)';
    }
    counter = !counter;
    const items = [];
    for(let i = 0; i < 8; i++) {
        const item = document.createElement('div');
        item.classList.add('main_users_table_content_row_item');
        items.push(item);
    }
    items[0].setAttribute('style', 'width:220px;');
    items[1].setAttribute('style', 'width:240px;;');
    items[2].setAttribute('style', 'width:150px;;');
    items[3].setAttribute('style', 'width:150px;;');
    items[4].setAttribute('style', 'width:150px;;');
    items[5].setAttribute('style', 'width:150px;;');

    items[0].innerHTML =`<span style="font-size:12px;">№${user._id}</span>`;
    if(user.roles[0] == 'Пользователь') {
        items[1].innerHTML = `<strong>ФИО: </strong><a style='color: blue;' href='residents/${user.resident._id}'>${user.resident.surname} ${user.resident.name} ${user.resident.patronymic}</a> <br><strong>Адрес: </strong>г.${user.resident.address.city}, ул.${user.resident.address.street}, д.${user.resident.address.numHome}, кв.${user.resident.numApart}`;  
        items[2].innerHTML = `${user.resident.tel}`;  
    } else {
        items[1].innerHTML = `<strong>ФИ: </strong>${user.surname} ${user.name}`;
        items[2].innerHTML = `${user.tel}`;  
    }
    items[3].innerHTML = `${user.username}`;
    items[4].innerHTML = `${user.password}`;
    items[5].innerHTML = `${user.roles[0]}`;
    items.forEach(item => {
        row.append(item);
    });

    const btn_block = document.createElement('div');
    btn_block.style.cssText='margin:10px 0';
    const remove_btn = document.createElement('button');
    remove_btn.style.cssText = 'width: 80px;height:30px;background-color:rgb(200, 0, 0);border: none;border-radius:5px;color:white;margin-top:5px;';
    remove_btn.innerText = 'Удалить';
    remove_btn.addEventListener('click' , () => {
        if(user.roles[0] == 'Пользователь') {
            DeleteUser(token,user._id);
        } else {
            DeleteEmployee(token, user._id);
        }
        row.remove();
    });

    btn_block.append(remove_btn);

    btn_block.style.cssText="display:flex;flex-direction: column;justify-content:center;align-items:center;";
    row.append(btn_block);
    users_table.append(row);
}
async function loadAll(token) {
    users = await GetUsers(token);
    users.forEach(user => {
        CreateUser(user);
    });
    employees = await GetEmployees(token);
    employees.forEach(employee => {
        CreateUser(employee);
    });
    sortedList = users.concat(employees);
}
loadAll(token);
const select_sort = document.querySelector('.select_sort');
select_sort.addEventListener('change', () => {
    users_table.innerHTML = ``;
    let sortBy = select_sort.value;
    if(sortBy == 'loginup') {
        sortedList.sort((first,second) => first.username > second.username ? 1 : -1);
    }
    else if(sortBy == 'logindown') {
        sortedList.sort((first,second) => first.username < second.username ? 1 : -1);
    }
    else if(sortBy == 'passup') {
        sortedList.sort((first,second) => first.password > second.password ? 1 : -1);
    }
    else if(sortBy == 'passdown') {
        sortedList.sort((first,second) => first.password < second.password ? 1 : -1);
    }
    else if(sortBy == 'roleup') {
        sortedList.sort((first,second) => first.roles[0] > second.roles[0] ? 1 : -1);
    }
    else if(sortBy == 'roledown') {
        sortedList.sort((first,second) => first.roles[0] < second.roles[0] ? 1 : -1);
    }
    sortedList.forEach(user => {
        CreateUser(user);
    });
});
