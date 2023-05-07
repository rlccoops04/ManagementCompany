async function getRequests(token) {
    const response = await fetch("/dispatcher/get/requests", {
        method: "GET",
        headers: { 
            "Accept" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });
    if(response.ok) {
        const requests = await response.json();
        console.log('Получены все заявки');
        return requests;
    }
    else {
        if(response.status == 403) {
            console.log('Не уполномочен');
        }
        else if(response.status == 401){
            console.log('Не авторизован');
        }
        else {
            console.log('Ошибка при получении запроса');
        }
        console.log(response.status);
    }
}

async function getRequestByExecutor(token) {
    const response = await fetch("/specialist/get/requests", {
        method: "GET",
        headers: { 
            "Accept" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });
    if(response.ok) {
        const requests = await response.json();
        console.log('Получены все заявки специалиста');
        return requests;
    }
    else {
        if(response.status == 403) {
            console.log('Не уполномочен');
        }
        else if(response.status == 401){
            console.log('Не авторизован');
        }
        else {
            console.log('Ошибка при получении запроса');
        }
        console.log(response.status);
    }
}

async function PostRequest(token, request) {
    const response = await fetch('/dispatcher/post/request', {
        method: "POST",
        headers: { 
            "Accept": "application/json", "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
        },
        body: JSON.stringify(request)
    });
    if (response.ok) {
        const result = await response.json();
        console.log(result);
        return result;
    }
    else {return null;}
}

async function PostUserRequest(request) {
    const response = await fetch('/post/request', {
        method: "POST",
        headers: { 
            "Accept": "application/json", "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
        },
        body: JSON.stringify(request)
    });
    return response;
}

async function EditRequest(token, requestId, requestExecutor, requestStatus, requestPriority) {
    const response = await fetch('/dispatcher/put/request/' + requestId,{
        method: "PUT",
        headers: {
            "Accept" : "application/json", "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`
        },
        body: JSON.stringify({
            executor: requestExecutor,
            status: requestStatus,
            priority: requestPriority
        })
    });
    if(response.ok) {
        console.log('Заявка успешно изменена');
    }
}

async function EditRequestSpec(token, requestId,requestStatus) {
    const result = await fetch('/specialist/put/request/' + requestId, {
        method: 'PUT',
        headers: {
            "Accept" : "application/json", "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`
        },
        body: JSON.stringify({
            status: requestStatus
        })
    });
    if(result.ok) {
        console.log('Заявка успешно изменена');
    }
}

async function DeleteRequest(token, id) {
    const response = await fetch('/dispatcher/delete/request/' + id, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });
}

async function getTypesWork(token) {
    const response = await fetch('/get/works', {
        method: "GET",
        headers: { 
            "Accept" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });
    if(response.ok) {
        console.log("Получены все работы");
        const works = await response.json();
        return works;
    }
    return null;
}

async function getResidents(token) {
    const response = await fetch('/dispatcher/get/residents', {
        method: "GET",
        headers: {
            "Accept" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });
    if(response.ok) {
        console.log('Получены все жильцы');
        const residents = await response.json();
        return residents;
    }
    return null;
}

async function postResident(token, resident) {
    const response = await fetch('/dispatcher/post/resident', {
        method: "POST",
        headers: {
            "Accept" : "application/json",
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`
        },
        body: JSON.stringify(resident)
    });
    return response;
}

async function EditResident(token, resident) {
    const response = await fetch('/dispatcher/put/resident/' + resident.id,{
        method: "PUT",
        headers: {
            "Accept" : "application/json", "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`
        },
        body: JSON.stringify(resident)
    });
    if(response.ok) {
        console.log('Жилец успешно изменен');
    }
    else {
        console.log("Ошибка при изменении жильца");
    }
}

async function DeleteResident(token, id) {
    const response = await fetch('/dispatcher/delete/resident/' + id, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });
}

async function GetExecutors(token, type_work) {
    const response = await fetch("/dispatcher/get/executors/" + type_work, {
        method: "GET",
        header: { 
            "Accept" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });

    if(response.ok) {
        const executors = await response.json();
        console.log('Получены все исполнители');
        return executors;
    }
    else {
        console.log('Ошибка при получении исполнителей');
    } 
}

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

async function GetUsers(token) {
    const response = await fetch("/dispatcher/get/users", {
        method: "GET",
        headers: { 
            "Accept" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });
    if(response.ok) {
        const users = await response.json();
        console.log('Получены все пользователи');
        return users;
    }
    else {
        if(response.status == 403) {
            console.log('Не уполномочен');
        }
        else if(response.status == 401){
            console.log('Не авторизован');
        }
        else {
            console.log('Ошибка при получении запроса');
        }
        return null;
    } 
}

async function GetEmployees(token) {
    const response = await fetch("/dispatcher/get/employees", {
        method: "GET",
        headers: { 
            "Accept" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });
    if(response.ok) {
        const employees = await response.json();
        console.log('Получены все работники');
        return employees;
    }
    else {
        if(response.status == 403) {
            console.log('Не уполномочен');
            window.location.replace("/");
        }
        else if(response.status == 401){
            console.log('Не авторизован');
            window.location.replace("/login");
        }
        else {
            console.log('Ошибка при получении запроса');
        }
        return null;
    } 
}

async function DeleteUser(token,id) {
    const response = await fetch('/dispatcher/delete/user/' + id, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });
}

async function DeleteEmployee(token,id) {
    const response = await fetch('/dispatcher/delete/employee/' + id, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });
}

async function PostUser(token, user) {
    const response = await fetch('/auth/registration', {
        method: "POST",
        headers: { 
            "Accept": "application/json", "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
        },
        body: JSON.stringify(user)
    });
    if (response.ok) {
        console.log(response.json());
        return response.json();
    }
    else {return null;}
}

async function PostEmployee(token, user) {
    const response = await fetch('/auth/registrationEmp', {
        method: "POST",
        headers: { 
            "Accept": "application/json", "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
        },
        body: JSON.stringify(user)
    });
    if (response.ok) {
        console.log(response.json());
        return response.json();
    }
    else {return null;}
}

async function getReports(token) {
    const response = await fetch("/dispatcher/get/reports", {
        method: "GET",
        headers: { 
            "Accept" : "application/json",
            "Authorization" : `Bearer ${token}`
        }
    });
    if(response.ok) {
        const requests = await response.json();
        return requests;
    }
}

export {getRequests,getTypesWork,getResidents,EditRequest,DeleteRequest,GetExecutors,PostRequest,postResident, EditResident, DeleteResident, PostUser, GetUsers, GetEmployees, DeleteUser, PostEmployee, DeleteEmployee,getRequestByExecutor,EditRequestSpec, getReports};
