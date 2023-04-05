const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectId;

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
    const requests = app.locals.requests,
          new_requests = await requests.find({status: 'Новая'}).toArray(),
          inwork_requests = await requests.find({status: 'В работе'}).toArray(),
          done_requests = await requests.find({status: 'Выполнена'}).toArray(),
          send_requests = await requests.find({status: 'Передана'}).toArray(),
          cancel_requests = await requests.find({status: 'Отмена'}).toArray();

    response.render("dispatcher.hbs", {
        request_new_count: new_requests.length,
        request_inwork_count: inwork_requests.length,
        request_done_count: done_requests.length,
        request_send_count: send_requests.length,
        request_cancel_count: cancel_requests.length
    });
});

app.get("/dispatcher/requests", async (req,response) => {
    const collection = req.app.locals.requests;
    const requests = await collection.find({}).toArray();
    response.send(requests);
});

app.post('/post/request', jsonParser, (request, response) => {
    const requestsCollection = request.app.locals.requests;
    console.log(request.body);
    requestsCollection.insertOne(request.body);
    response.send(request.body);
});

app.put('/put/request', jsonParser, async (request,response) => {
    if(!request.body) return response.status(400);

    const id = new objectId(request.body._id);
    const reqExecutor = request.body.executor;
    const reqStatus = request.body.status;

    const reqCollection = request.app.locals.requests;
    const req = await reqCollection.findOneAndUpdate({_id:id}, { $set: {executor: reqExecutor, status: reqStatus}},
        {returnDocument: "after"});
    // reqCollection.forEach(item => {
    //     if(item._id == id) {
    //         req = item;
    //     }
    // });
    if(req.value) {
        response.send(req);
    }
    else {
        response.sendStatus(404);
    }
});
