var express = require('express');
var router = express.Router();
var pool = require('./sql');





/* GET home page. */
router.get('/', function(req, res, next) {
    var user = unescape(req.cookies.c_user);
    var email = unescape(req.cookies.c_email);
    console.log(user,!user,user==undefined,typeof user)
    if (!!user || !!email) {
        return res.json({ status: -1, msg: '请先登录！' });
    }
    var m = Math.random();
    var cid = 0; //奖品序号
    if (m <= 0.0001) { //0.0025  键盘
        cid = 6;
        Query_history(user, email, cid, res)
    } else if (m > 0.0001 && m <= 0.0006) { //0.025  多啦A梦
        cid = 4;
        Query_history(user, email, cid, res)
    } else if (m > 0.0006 && m <= 0.0011) { //0.025  充电宝
        cid = 9;
        Query_history(user, email, cid, res)
    } else if (m > 0.0011&& m <= 0.0016) { //0.025 背包
        cid = 2;
        Query_history(user, email, cid, res)
    } else if (m > 0.0016 && m <= 0.0021) { //0.075  雨伞
        cid = 0;
        Query_history(user, email, cid, res)
    } else if (m > 0.0021 && m <= 0.0026) { //0.125  扩容
        cid = 1;
        Query_history(user, email, cid, res)
    } else if (m > 0.0026 && m <= 0.0526) { //0.25  小台灯
        cid = 5;
        Query_history(user, email, cid, res)
    } else if (m > 0.0526 && m <= 0.1026) { //0.25  记事本
        cid = 8;
        Query_history(user, email, cid, res)
    } else {
        var m1 = Math.random() > 0.5 ? 3 : 7; //2个飞吻随机位置
        cid = m1;
        Query_history(user, email, cid, res)
    }

});

//查询中奖纪录，如果当天抽奖过，则返回不可抽奖
function Query_history(user, email, cid, res) {
    pool.getConnection(function(err, connection) {
        if (!err) {
            //email查找
            var sql = "select * from cjlist where email='" + email + "' order by id desc";
            //console.log(sql)
            connection.query(sql, function(err, rows) {
                if (!err) {
                    if (rows.length == 0) { //如果没有用户抽奖记录则添加用户记录
                        Query(user, email, cid,connection, res);
                    } else if (rows.length > 0) { //如果有用户记录则查询时间
                        var arr=[0,1,2,4,5,6,8,9];
                        if (rows[0].time == getTime()) {
                            res.json({ status: -1, msg: '一天只有一次抽奖机会！' });
                        }else if (arr.some(function(x) {return x==rows[0].cid;})) {     //如果上次中过奖，且奖品不是飞吻则返回飞吻
                            Query(user, email, 3,connection, res);
                        }else{                                                        //如果上次中过奖，且奖品是飞吻则返回所有可能
                            Query(user, email, cid,connection, res);
                        };
                    } else {
                        res.json({ status: -1, err: "查询用户信息0" });
                    };
                } else {
                    res.json({ status: -1, err: err });
                };

            });
            connection.release();
        } else {
            res.json({ status: -1, err: '数据库连接错误' });
        };
        
    });
}


//库存操作
function Query(user, email, cid,connection, res) {

    var sql_s = "select * from jplist where cid=" + cid;
    connection.query(sql_s, function(err, rows) {
        if (!err && rows.length > 0) {
            var title = rows[0].title; //奖品名称
            var last = rows[0].last; //奖品序号
            if (last > 0) { //判断是否还有奖品
                var sql_d = "update jplist set last=" + (last - 1) + " where cid=" + cid; //奖品减1  更新库存
                connection.query(sql_d, function(err, rows1) {
                    if (!err) {
                        insertQuery(user, email, cid, connection, res); //中奖记录操作
                    } else {
                        res.json({ status: -1, err: '查询返回出错' });
                    };
                });
            } else {
                var m2 = Math.random() > 0.5 ? 3 : 7; //2个飞吻随机位置
                insertQuery(user, email, m2,connection, res);
            };
        } else {
            res.json({ status: -1, err: 'sql查询出错', cid: cid })
        };
    });
};


//插入用户抽奖记录
function insertQuery(user, email, cid, connection, res) {
    var title = '';
    if (cid == 0) title = '雨伞';
    if (cid == 1) title = '扩容';
    if (cid == 2) title = '背包';
    if (cid == 3) title = '飞吻';
    if (cid == 4) title = '多啦A梦';
    if (cid == 5) title = '小台灯';
    if (cid == 6) title = '键盘';
    if (cid == 7) title = '飞吻';
    if (cid == 8) title = '记事本';
    if (cid == 9) title = '充电宝';
    var sql_add = "insert into cjlist (user,email,title,cid,time) value ('" + user + "','" + email + "','" + title + "','" + cid + "','" + getTime() + "')";
    connection.query(sql_add, function(err, rows) {
        if (!err) {
            res.json({ status: 1, msg: 'ok!', data: { title: title, cid: cid }});
        } else {
            res.json({ status: -1, err: '添加用户信息出错' });
        }
    });
}



function getTime() {
    var date = new Date;
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    m = (m < 10) ? ('0' + m) : m;
    d = (d < 10) ? ('0' + d) : d;
    var ndate = y + '' + m + '' + d;
    return ndate;
}

module.exports = router;