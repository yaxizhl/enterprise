var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: '测试' });
  res.redirect('/productSystem/index');
});

module.exports = router;
