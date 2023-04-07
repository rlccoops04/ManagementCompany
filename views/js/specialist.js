"use strict"

const requests_table = document.querySelector(".main_requests_table"),
      header = document.querySelector("header"),
      menu_close_btn = document.querySelector('.menu_close'),
      menu = document.querySelector('.menu'),
      menu_open_btn = document.querySelector(".hamburger");

menu_open_btn.addEventListener('click', () => {
    menu.classList.add('show');
    menu.classList.remove('hide');
});
menu.classList.add('hide');

menu_close_btn.addEventListener('click', ()=> {
    menu.classList.add('hide');
    menu.classList.remove('show');
});
async function GetRequests() {
    const response = await fetch("/get/requests", {
        method: "GET",
        header: { "Accept" : "application/json" }
    });

    if(response.ok === true) {
        const requests = await response.json();
        requests.forEach(item => {
            CreateRequest(item);
        });
    }
    else {
        console.log('err by get request');
    } 
}

async function GetRequestsByExecutor(executor) {
    const response = await fetch("/get/requests/" + executor, {
        method: "GET",
        header: { "Accept" : "application/json" }
    });

    if(response.ok === true) {
        const requests = await response.json();
        requests.forEach(item => {
            CreateRequest(item);
        });
    }
    else {
        console.log('err by get request');
    } 
}

function CreateRequest(request) {
    const request_block = document.createElement('div'),
          request_block_numreq = document.createElement('div'),
          request_block_address = document.createElement('div'),
          request_block_type = document.createElement('div'),
          request_block_descr = document.createElement('div'),
          request_block_status = document.createElement('div');
          

    request_block_numreq.append(request._id);
    request_block_address.append(request.city);
    request_block_type.append(request.type);
    request_block_descr.append(request.descr);
    request_block_status.append(request.status);

    request_block.classList.add('main_requests_table_item');

    request_block.append(request_block_numreq);
    request_block.append(request_block_address);
    request_block.append(request_block_type);
    request_block.append(request_block_descr);
    request_block.append(request_block_status);
    if(request.status == 'Передана') {
        const request_block_btn = document.createElement('button');
        request_block_btn.innerText = "Принять";
        request_block.append(request_block_btn);
    }
    requests_table.append(request_block);
}

GetRequestsByExecutor("2");

