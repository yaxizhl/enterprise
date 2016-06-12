var express = require('express');
var router = express.Router();
var pool = require('./sql');

var json2csv = require('json2csv');
var fs = require('fs');
var fields = ['user', 'email', 'title', 'time'];

//下载csv
router.get('/down', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        if (!err) {
            var sql = "select user,email,title,time from cjlist";
            connection.query(sql, function(err, rows) {
                if (!err) {
                    if (rows.length > 0) {
                        json2csv({ data: rows, fields: fields }, function(err, csv) {
                            if (err) console.log(err);
                            fs.writeFile('file/zj_list.csv', csv, function(err) {
                                if (err) console.log(err);
                                return res.download('file/zj_list.csv')
                            });
                        });
                    } else {
                        res.json({ status: -1, msg: '没有中奖记录' })
                    }
                } else {
                    res.json({ status: -1, msg: '查询失败' })
                }
                connection.release();
            });

        } else {
            res.json({ status: -1, msg: '数据库连接错误' })
        }

        
    });
});

//剩余奖品数量
router.get('/last', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        if (!err) {
            var sql = "select last from jplist order by id asc";
            connection.query(sql, function(err, rows) {
                if (!err) {
                    if (rows.length > 0) {
                        res.json({ status: 1, msg: rows })
                    } else {
                        res.json({ status: -1, msg: '没有记录' })
                    }
                } else {
                    res.json({ status: -1, msg: '查询失败' })
                }

                connection.release();
            });
        } else {
            res.json({ status: -1, msg: '数据库连接错误' })
        }

    });
});


//接口
router.get('/', function(req, res, next) {
    var csv1 = req.query.csv;
    pool.getConnection(function(err, connection) {
        if (!err) {
            var sql = "select * from cjlist";
            connection.query(sql, function(err, rows) {
                if (!err) {
                    if (rows.length > 0) {
                        res.json({status:1,msg:rows})
                    } else {
                        res.json({ status: -1, msg: '没有中奖记录' })
                    }
                } else {
                    res.json({ status: -1, msg: '查询失败' })
                }
                console.log(connection)
                connection.release();
            });
        } else {
            res.json({ status: -1, msg: '数据库连接错误' })
        }

        
    });



});

















module.exports = router;