const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    chats: [
        {
          name: String,
          chatid: String
        }
    ]
}, {timestamps :true})

const user = mongoose.model('user', userSchema);
module.exports = user;