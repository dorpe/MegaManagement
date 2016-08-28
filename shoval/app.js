var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var mongoose   = require('mongoose');
var mongodb = require('mongodb');
var db = require('monk')('10.17.1.13/local');
var app = express();

var Matzevot = db.get('Matzeva');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next){
  req.db = db;
  next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


routes.get('/userList', function(req, res){
    var db = req.db;
    var collection = db.get('Users');
    collection.find({},{},function(e, docs){
      res.send(docs);
      db.close;
    });
});

routes.get('/openMatzevot', function(req, res){
    var openMatzevot = Matzevot.find({"status": "open"},{},function(e, docs){
      res.send(docs);
      db.close;
    });
});

routes.get('/CloseMatzevot', function(req, res){
     var closedMatzevot = Matzevot.find({"status": "closed"},{},function(e, docs){
      res.send(docs);
      db.close;
    });
});

<<<<<<< HEAD
routes.get('/getMatzevaStatus', function(req, res){
=======
routes.post('/changestatus', function(req, res){
      Matzevot.update({"_id": req.body.id} ,{$set:{"status" : "closed"}});
      db.close;
});

routes.get('/missingPeople', function(req, res){
    var moreFiveMinuets = new Date();
    moreFiveMinuets.setMinutes(moreFiveMinuets.getMinutes() - 5);
    moreFiveMinuets.setHours(moreFiveMinuets.getHours() + 3);

>>>>>>> 7389623bfbd244185bcdf928a875d92d8506a391
    var db = req.db;
    var missingPeople = db.get('Matzeva');
    var allUsers = db.get('User').find();
    missingPeople.find({"status" : "open"},{},function(e, docs){
          docs.forEach(function(currMatzeva) {
          var Answered = currMatzeva["answered"];
          console.log(Answered);
          Answered.forEach(function(currUser){
          console.log(currUser["user"]);
        });
      });

       });
      res.send("aa");
      db.close;
});

routes.post('/UserStatusinMatzeva', function(req, res){
    var db = req.db;
    var userID = req.body.userID;
    var userStatus = req.body.userStatus;
    var matzevaID = req.body.matzevaID;

    db.collection('Matzeva').update(
    { "_id": matzevaID},
    { "$push": 
        {"answered": 
            {
                "user": userID,
                "status": userStatus,
                "time_answered" : new Date()
            }
        }     
    });

    res.send(docs);
    db.close;
});

routes.post('/CreateMatzeva', function(req, res){
    var db = req.db;
    var place = req.body.place;
    var time = req.body.time;
    var name = req.body.name;
    var maker = req.body.maker;

    db.collection('Matzeva').insert(
    { 
        "name" : name,
        "maker" : maker,
        "time" : time,
        "place" : place,        
        "status" : "open"
    });
    
    res.send(docs);
    db.close;
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

module.exports = app;


