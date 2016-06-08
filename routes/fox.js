var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
	var name=req.cookies.name;
	if (!name) {return res.redirect(303,'/login.html') }
    res.render('fox',{title:'后台管理',user:req.cookies.name})
});

module.exports = router;