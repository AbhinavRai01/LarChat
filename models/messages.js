const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender : {
        type: String,
        required: true
    },
    message : {
        type: String,
        required: true
    }
}, {timestamps :true})

const message = mongoose.model('message', messageSchema);
const mess1141age = mongoose.model('mess1141age', messageSchema);
const mess1341age = mongoose.model('mess1341age', messageSchema);
const mess1981age = mongoose.model('mess1981age', messageSchema);

module.exports = {mess1141age,mess1981age,mess1341age,message};