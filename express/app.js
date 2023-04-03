const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const mongoClient = new MongoClient("mongodb://127.0.0.1:27017/");

const app = express();  
const jsonParser = express.json();
app.set("view engine", "hbs");

const collections = [];
(async () => {
     try {
        await mongoClient.connect();
        const db = mongoClient.db("ManagementCompany");
        collections.push(db.collection("requests"));
        const result = await collections[0].find().toArray();
        console.log(result);
        app.listen(3000);
        console.log("Сервер ожидает подключения...");
    }catch(err) {
        return console.log(err);
    } 
})();

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
    collections[0].insertOne(request.body);
    response.send(request.body);
});

   


