const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const morgan = require('morgan');
const api = require('./api');
const auth = require('./auth');
const db = require('../db');
const passport = require('passport');
const socketIo = require('socket.io');

app.use(morgan('tiny'));
app.use(cookieParser());
app.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

var server = app.listen(port, () => console.log(`listening on port ${port}!`));
var io = socketIo(server);

io.on('connection', function(socket){
  socket.on('action', (action) => {
    if(action.type === 'server/hello'){
      io.sockets.emit('action', {type:'message', data:action.data, user: action.user});
    }
  });
});

/////////////////////// PUBLIC ENDPOINTS ///////////////////////////////


app.use(auth);
app.use('/login', express.static(path.join(__dirname, '../client/dist')));


/////////////////////// AUTH GATEWAY ///////////////////////////////


app.use((req, res, next) => {  
  if (req.session.passport && req.session.passport.user) {
    next();
  } else {
    res.redirect('/login');
  }
});

/////////////////////// PRIVATE ENDPOINTS ///////////////////////////////

app.use('/api', api);
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use('/topic/:topicId', express.static(path.join(__dirname, '../client/dist')));