const Request = require('../models/Request.js').Request;
module.exports.specialist = async function (request, response) {
    response.render('specialist.hbs');
}

module.exports.getRequests =  async (request, response) => {
    let requests = await Request.find({executor: request.user.id}).populate({
        path: 'resident',
        populate: { path: 'address' }
    });
    requests.forEach(request=> {
        delete request.dispatcher;
    });
    response.send(requests);
}