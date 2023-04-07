const express = require('express'); 
const app = express();
const server = require('http').createServer(app) // создание сервера
const io = require('socket.io')(server) //подключение сокетов для сервера
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectId;

io.on('connection', socket => {}) // обработка сокера
const mongoClient = new MongoClient("mongodb://127.0.0.1:27017/");
const jsonParser = express.json();
app.set("view engine", "hbs");

(async () => {
     try {
        await mongoClient.connect();
        const db = mongoClient.db("ManagementCompany");
        // collections.push(db.collection("requests"));
        // const result = await collections[0].find().toArray();
        // console.log(result);
        app.locals.requests = db.collection("requests");
        server.listen(3000)
        console.log("Сервер ожидает подключения...");
        return db;
    }catch(err) {
        return console.log(err);
    }
})();

app.use('/', express.static('d:/Web/PAPS/views'));

app.use("/notifications",express.static('d:/Web/PAPS/views'));

app.use("/dispatcher",express.static('d:/Web/PAPS/views'));

app.get("/", function(_, response){
    response.render("index.hbs");
});

app.get("/notifications", function(_, response){
    response.render("notifications.hbs");
});

app.get("/specialist", (_,response) => {
    response.render("specialist.hbs");
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

app.get("/get/requests", async (request,response) => {
    const collection = request.app.locals.requests;
    const requests = await collection.find({}).toArray();
    response.send(requests);
});

app.get("/get/requests/:executor", async (request, response) => {
    const collection = request.app.locals.requests;
    const requests = await collection.find({executor: request.params.executor}).toArray();
    console.log("ds");
    response.send(requests);
});

app.post('/post/request', jsonParser, (request, response) => {
    const requestsCollection = request.app.locals.requests;
    console.log(request.body);
    requestsCollection.insertOne(request.body);
    response.send(request.body);
});

app.put('/put/request/:id', jsonParser, async (request,response) => {
    if(!request.body) return response.status(400);

    const id = new objectId(request.params.id);
    const reqExecutor = request.body.executor;
    const reqStatus = request.body.status;

    const reqCollection = request.app.locals.requests;
    const result = await reqCollection.findOneAndUpdate({_id:id}, { $set: {executor: reqExecutor, status: reqStatus}},
        {returnDocument: "after"});
    
    if(result.value) {
        response.send(result);
    }
    else {
        response.sendStatus(404);
    }
});

app.delete('/delete/request/:id', jsonParser, async (request,response) => {
    if(!request.body) return response.status(400);

    const reqCollection = request.app.locals.requests;
    const id = new objectId(request.params.id);
    const result = await reqCollection.findOneAndDelete({_id: id});

    if(result.value) {
        response.send(result);
    }
    else {
        response.sendStatus(404);
    }
});
process.on("SIGINT", async() => {
    await mongoClient.close();
    console.log("Приложение завершило работу");
    process.exit();
});