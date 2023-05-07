const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports.Report = mongoose.model('Report', new Schema({
    request: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Request'
    },
    img: {
        type: String
    },
    date: {
        type: String,
        required: true
    },
},
{versionKey: false}
));