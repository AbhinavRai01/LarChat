const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    chatid : {
        type: String,
        required: true
    }
}, {timestamps :true})

const chat = mongoose.model('chat', chatSchema);
module.exports = chat;