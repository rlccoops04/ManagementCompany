const express = require("express");
const fs = require("fs");
    
const app = express();  
const jsonParser = express.json();
app.set("view engine", "hbs");

app.use('/', express.static('d:/Web/PAPS/views'));

app.use("/notifications",express.static('d:/Web/PAPS/views'));

app.get("/", function(_, response){
    response.render("index.hbs");
});

app.get("/notifications", function(_, response){
    response.render("notifications.hbs");
});

app.post('/send/req', jsonParser, (request, response) => {
    console.log(request.body);
    response.send(request.body);
});

   
app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});