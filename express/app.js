const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const mongoClient = new MongoClient("mongodb://127.0.0.1:27017/");

const app = express();  

const jsonParser = express.json();
app.set("view engine", "hbs");

async function start() {
     try {
        await mongoClient.connect();
        const db = mongoClient.db("ManagementCompany");
        // collections.push(db.collection("requests"));
        // const result = await collections[0].find().toArray();
        // console.log(result);
        app.locals.requests = db.collection("requests");
        app.listen(3000);
        console.log("Сервер ожидает подключения...");
        return db;
    }catch(err) {
        return console.log(err);
    }
};
start();

app.use('/', express.static('d:/Web/PAPS/views'));

app.use("/notifications",express.static('d:/Web/PAPS/views'));

app.use("/dispatcher",express.static('d:/Web/PAPS/views'));

app.get("/", function(_, response){
    response.render("index.hbs");
});

app.get("/notifications", function(_, response){
    response.render("notifications.hbs");
});

app.get("/dispatcher", async (_,response) => {
    const new_requests = await app.locals.requests.find({}).toArray();
    response.render("dispatcher.hbs", {
        request_new_count: new_requests.length,
        request_inwork_count: 0,
        request_inwait_count: 0,
        request_done_count: 0,
        request_failbycom_count: 0,
        request_failbyclient_count: 0
    });
});

app.get("/dispatcher/requests", async (req,response) => {
    const collection = req.app.locals.requests;
    const requests = await collection.find({}).toArray();
    response.send(requests);
});

app.post('/send/req', jsonParser, (request, response) => {
    const requestsCollection = request.app.locals.requests;
    console.log(request.body);
    requestsCollection.insertOne(request.body);
    response.send(request.body);
});

   


