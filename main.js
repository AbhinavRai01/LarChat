const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const notifier = require('node-notifier');

const Message = module.require('./models/messages');
const User = module.require('./models/user');
const Chat = module.require('./models/chats');

const app = express();
var userID = "";

app.set('view engine', 'ejs');

const dBURI = 'mongodb+srv://abhinav:abhinav2005@messenger.wjyjr.mongodb.net/Message-Data?retryWrites=true&w=majority&appName=messenger';
mongoose.connect(dBURI)
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// app.post('/', (req, res) => {
//   const message = new Message.message(req.body);
//   message.save()
//     .then((result) => res.redirect('/'))
//     .catch((err) => console.log(err));
// })

app.post('/newchat', (req, res) => {
  const chat = new Chat(req.body);
  chat.save()
    .then((result) => res.redirect('/'))
    .catch((err) => console.log(err, req.body));
})

app.post('/login', (req, res) => {
  User.findOne({ username: req.body.username })
    .then(user => {
      if (user) {
        if (user.password == req.body.password) {
          console.log("LOGIN SUCCESSFUL");
          res.redirect('/chats/' + user.id);
        } else {
          console.log("WRONG PASSWORD");
          notifier.notify({
            title: 'Wrong Password',
            message: 'Please try again.',
            sound: true,
            wait: true
          })
          res.redirect('/login');
        }
      } else {
        console.log('WRONG USERNAME');
        notifier.notify({
          title: 'Wrong Username',
          message: 'Please enter a valid username.',
          sound: true,
          wait: true
        })
        res.redirect('/login');
      }
    })
})

app.post('/signup', (req, res) => {
  console.log("hui hui");
  User.findOne({ username: req.body.username })
    .then(user => {
      if (user) {
        console.log("User already exists!!")
        notifier.notify({
          title: 'Username taken',
          message: 'Please try another one.',
          sound: true,
          wait: true
        })
        res.redirect('/login');

      } else {
        const newUser = new User(req.body);
        newUser.save()
          .then((result) => {
            console.log("USER CREATED");
            res.redirect('/chats/' + result.id);
          })
          .catch((err) => console.log(err));
      }
    })
})

app.post('/addchat', (req, res) => {
  User.findById(userID)
    .then((user) => {
      Chat.findOne({ chatid: req.body.chatid })
        .then((result) => {
          if (result) {
            if (!user.chats.some(chat => chat.name === result.name && chat.chatid === result.chatid)) {
              user.chats.push({ name: result.name, chatid: result.chatid });
              user.save();
              res.redirect('/chats/' + userID);
            }else{
              notifier.notify({
                title: 'Chat already added',
                message: 'Please enter a unique one.',
                sound: true,
                wait: true
              })
              res.redirect('/chats/' + userID);
            }

          } else {
            notifier.notify({
              title: 'Invalid chatId',
              message: 'Please enter a valid one.',
              sound: true,
              wait: true
            })
            res.redirect('/chats/' + userID);
          }

        })


    })
    .catch((err) => console.log(err));

});

app.post('/sendmessage', (req, res) => {
  console.log(req.body.chatid);
  const chatid = req.body.chatid;

  const messageCollection = Message[`mess${chatid}age`];

  const message = new messageCollection(req.body);
  message.save();

  res.redirect('/chats/' + userID + '/' + chatid);
})
app.get('/', (req, res) => {
  res.redirect('/login');
})

app.get('/login', (req, res) => {
  res.render('login');
})

app.get('/home', (req, res) => {
  res.render('home');
})

app.get('/newchat', (req, res) => {
  res.render('newchat');
})

app.get('/test', (req, res) => {
  res.render('chat');
})

app.get('/chats/:id', (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid User ID');
  }



  User.findById(id)
    .then((result) => {
      if (!result) {
        return res.status(404).send('User not found');
      }
      userID = id;
      console.log(userID);
      res.render('home.ejs', { chats: result.chats, userId: userID });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
})

app.get('/chats/:userid/:chatid', (req, res) => {
  const userid = req.params.userid;
  let sender;

  User.findById(userid)
    .then((user) => {
      console.log(user);
      sender = user.username;

      console.log(sender);

      const chatid = req.params.chatid;

      console.log(userid, " and  ", chatid);
      console.log(Message[`mess${chatid}age`]);
      console.log(Message[`mess1141age`]);

      Message[`mess${chatid}age`].find().sort({ createdAt: -1 })
        .then((result) => res.render('chat', { messages: result, chatid: chatid, sender: sender }));

    });


})





