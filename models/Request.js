const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports.Request = mongoose.model('Request', new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        city: {
            type: String,
        },
        street: {
            type: String,
        },
        numHome: {
            type: Number,
        },
        numApart: {
            type: Number,
        },
    },
    tel: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    type: {
        type: String,
        ref: 'Type'
    },
    status: {
        type: String,
        ref: 'Status'
    },
    executor: {
        type: String,
        ref: 'User'
    },
    date: {
        type: String,
        required: true
    },
    descr : {
        type: String,
        required: true
    }
}));