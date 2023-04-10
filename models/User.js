const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports.User = mongoose.model('User', new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        city: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        numHome: {
            type: Number,
            required: true
        },
        numApart: {
            type: Number,
            required: true
        }
    },
    tel: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: String,
        ref: 'Role'
    }]

}));


