var express = require('express');
var router = express.Router();
var pool = require('./sql');

/* GET home page. */

router.get('/index',function (req,res,next) {
    res.render('productSystem_index', { title: "产品&服务"});
    
})

router.get('/:num', function(req, res, next) { 
	var id=req.params.num;
	    pool.getConnection(function(err, connection) {
        if (err) { res.json({ status: '1', message: '连接出错' });throw err }; //确认数据库连接是否正确
        connection.query("select * from template_base where id="+id+" and del=0", function(err, rows) {
            if (err) {
                throw err; }
            if (rows.length > 0) {
                if (req.query.x == 1) {
                    return res.json({ title: rows[0].title, test: rows[0].content, query: req.query }) }
                res.render('productSystem', { title: rows[0].title, test: rows[0].content });
            } else {
                res.redirect('http://www.appcan.cn/error/404.html')
            }
        });
        connection.release();
    })
});


module.exports = router;