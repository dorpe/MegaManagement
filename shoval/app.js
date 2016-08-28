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
var monk = require('monk');
var db = monk('10.17.1.13/local');
var app = express();

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
    var db = req.db;
    var openMatzevot = db.get('Matzeva');
    openMatzevot.find({"status": "open"},{},function(e, docs){
      res.send(docs);
      db.close;
    });
});

routes.get('/CloseMatzevot', function(req, res){
    var db = req.db;
    var openMatzevot = db.get('Matzeva');
    openMatzevot.find({"status": "closed"},{},function(e, docs){
      res.send(docs);
      db.close;
    });
});

routes.put('/openMatzevot/:id', function (req, res){
    var db = req.db;
    var openMatzevot = db.get('Matzeva');
    openMatzevot.find({"status": "open"},{},function(e, docs){
     docs[0].status = "closed";
     openMatzevot.save();
     db.close;
    })
});

routes.get('/missingPeople', function(req, res){
    var moreFiveMinuets = new Date();
    moreFiveMinuets.setMinutes(moreFiveMinuets.getMinutes() - 5);
    moreFiveMinuets.setHours(moreFiveMinuets.getHours() + 3);

    var db = req.db;
    var missingPeople = db.get('Matzeva');
    missingPeople.find({"status" : "open", "time" : { $gte : moreFiveMinuets} },{},function(e, docs){
      
      res.send(docs);
      db.close;
    });
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

module.exports = app;


