var express = require('express');
var router = express.Router();
var pool = require('./sql');

router.get('/', function(req, res, next) {
    var itemTemplateId = req.query.id || 140;
    var flag = false;
    var templateName = templateName || '';
    var firstResults = '';
    var sonTemplateName = "";
    var count = 9;
    var page = req.query.page || 1;
    var x = req.query.x;
    var sql0 = 'select template_name,name from item_template where id=' + itemTemplateId;
    var sql1 = 'select * from template_base where id=' + itemTemplateId + ' and del=0;';
    var sql2 = '';
    var firstResults = (page - 1) * count;
    var sql = (q(329) || q(328) || q(270) || q(269) || q(268) || q(140)) ? sql1 : sql0;

    function q(num) {
        return itemTemplateId == num.toString(); }

    //单页跳转
    if (itemTemplateId == 'solution') {
        return res.render('solution_html', {});
    }

    pool.getConnection(function(err, connection) {
        if (err) { res.json({ status: '1', message: '连接出错' });
            throw err }; //确认数据库连接是否正确
        connection.query(sql, function(err, rows) {
            if (err) {
                throw err };
            if (rows.length > 0) {
                if (sql == sql1) { //行业类型
                    if (x == 1) {
                        res.json({ status: '0', data: rows,sql:sql })
                    } else {
                        res.render('solution', { status: '0', data: rows });
                    };


                } else { //经典案例
                    templateName = rows[0].template_name;
                    if (templateName == 'template_base') {
                        sql2 = "SELECT id,created_at,title,nearby,son_template_id,author,permission,status,del FROM " + templateName + " WHERE son_template_id = " + itemTemplateId + " and del=0";
                    } else if (templateName == 'template_case') {
                        sql2 = "SELECT id,created_at,case_name,propaganda_image_pc,propaganda_image_app,case_introduction,case_icon,industry,type,synchronized_3g2win,synchronized_app,synchronized_wechat,del,case_status,background_colour,son_template_id,status FROM " + templateName + " WHERE son_template_id = " + itemTemplateId + " and del=0 and status =1 ";

                    };

                    sql2 += " order by created_at desc";
                    sql2 += " limit " + firstResults + "," + count + "";
                    connection.query(sql2, function(err, rows2) {
                        if (err) throw err;
                        var sql3 = "select id from " + templateName + " WHERE son_template_id = " + itemTemplateId + " and del=0 and status =1 ";
                        connection.query(sql3, function(err, rows3) {
                            if (err) throw err;
                            if (x == 1) {
                                res.json({
                                    total: Math.ceil(rows3.length / count),
                                    template_name: rows[0].name,
                                    itemTemplateId: itemTemplateId,
                                    pages: page,
                                    data: rows2,
                                    sql2:sql2
                                });
                            } else {
                                res.render('solution_j', {
                                    total: Math.ceil(rows3.length / count),
                                    template_name: rows[0].name,
                                    itemTemplateId: itemTemplateId,
                                    pages: page,
                                    data: rows2
                                });
                            };
                        });
                    });
                }
            } else {
                res.json({ status: '1', message: '未查到数据' });
            };

        });

        connection.release();
    });
});

//详情页
router.get('/details', function(req, res, next) {
    var id = req.query.case || '';
    var cn = req.query.cn;
    var x = req.query.x || ''
    var sql = "SELECT * FROM template_case WHERE id = " + id + " and del=0";
    pool.getConnection(function(err, connection) {
        if (err) throw err;
        connection.query(sql, function(err, rows) {
            if (err) throw err;
            if (rows.length > 0) {
                if (x == 1) {
                    res.json({ status: '0', message: '查询成功', channal: cn, data: rows,sql:sql });
                } else {
                    res.render('solution_details', { status: '0', message: '查询成功', channal: cn, data: rows });
                };
            } else {
                res.json({ status: '1', message: '未查到数据' });
            };
        });
        connection.release();
    });

})

//其他路径跳转到首页
router.get('/', function(req, res, next) {})

module.exports = router;