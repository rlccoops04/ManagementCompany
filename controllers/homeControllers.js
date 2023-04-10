module.exports.index = (_,response) => {
    response.render("index.hbs");
}
module.exports.getUser = (request,response) => {
    response.json(request.user);
}

module.exports.notifications = (_,response) => {
    response.render("notifications.hbs");
}