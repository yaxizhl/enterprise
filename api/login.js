var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/exit', function(req, res, next) {
	res.clearCookie('name');
	res.json({status:'err',url:'/login.html'})
  
});


router.post('/', function(req, res, next) {
	var u=req.body.user;
	var p=req.body.pass;
    console.log(req)
	if (u=='appcan'&&p=='123456') {	
		res.json({status:'index',name:'appcan',url:'/fox'});
	}else{
		res.json({status:'err',msg:'账号或密码不正确'});
	}
  
});

module.exports = router;