"use strict"

const requests_table = document.querySelector('.main_requests_table_content');

async function GetRequests() {
    const response = await fetch("/dispatcher/requests", {
        method: "GET",
        header: { "Accept" : "application/json" }
    });

    if(response.ok === true) {
        const requests = await response.json();
        console.log(requests);
        requests.forEach(item => {
            console.log(item);
            CreateRequest(item);
        });
    }
    else {
        console.log('err');
    }
    
}
function CreateRequest(request) {
    const row = document.createElement('div');
    row.classList.add('main_requests_table_content_row');
    const items = [];
    for(let i = 0; i < 6; i++){
        const item = document.createElement('div');
        item.classList.add('main_requests_table_content_row_item');
        items.push(item);
    }
    items[0].setAttribute('style', 'width: 110px;height:100px;');
    items[1].setAttribute('style', 'width: 200px;height:100px;');
    items[2].setAttribute('style', 'width: 110px;height:100px;');
    items[3].setAttribute('style', 'width: 200px;height:100px;');
    items[4].setAttribute('style', 'width: 140px;height:100px;');
    items[5].setAttribute('style', 'width: 300px;height:100px;');

    items[0].append(request._id);
    items[1].append(request.city +', ' + request.street + ', ' + request.numHome + ', ' + request.numApart);
    items[2].append(request.type);
    items[3].append(request.executor);
    items[4].append(request.status);
    items[5].append(request.descr);

    items.forEach(item => {
        row.append(item);
    });


    requests_table.append(row);
}

GetRequests();
