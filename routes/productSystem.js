var express = require('express');
var router = express.Router();
var pool = require('./sql');

/* GET home page. */

router.get('/index', function(req, res, next) {
    res.render('productSystem_index', { title: "产品&服务",id:'' });

})

router.get('/:num', function(req, res, next) {
    var id = parseInt(req.params.num); //将参数转换成数字类型
    if (isNaN(id)) {return res.redirect('http://www.appcan.cn/error/404.html'); } //无法转换成数字类型返回404，防止下一步的mysql报错
    pool.getConnection(function(err, connection) {
        if (err) throw err; //确认数据库连接是否正确
        connection.query("select * from template_base where id=" + id + " and del=0", function(err, rows) {
            if (err) {
                throw err;
            }
            if (rows.length > 0) {
                if (req.query.x == 1) {
                    return res.json({id:id, title: rows[0].title, test: rows[0].content, query: req.query })
                }
                res.render('productSystem', {id:id, title: rows[0].title, test: rows[0].content });
            } else {
                res.redirect('http://www.appcan.cn/error/404.html');
            }
        });
        connection.release();
    })
});

router.get('/', function(req, res) { //缺省跳转
    res.redirect('/productSystem/index');
});

module.exports = router;