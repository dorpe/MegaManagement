var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Hello World');
});

router.get('/Dor', function (req, res) {
  res.send('Hello Dor!');
});


module.exports = router;
