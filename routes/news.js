var express = require('express');
var router = express.Router();
var pool = require('./sql');

router.get('/:lanmu', function(req, res, next) {

    var itemTemplateId = req.params.lanmu || 'hyzx'; //获取栏目参数

    if (itemTemplateId == 'hyzx') {
        itemTemplateId = 95;
    } else if (itemTemplateId == 'gfxw') {
        itemTemplateId = 94;
    } else if (itemTemplateId == 'jchd') {
        itemTemplateId = 116;
    } else {
        return res.redirect('http://www.appcan.cn/error/404.html')
    }
    var templateName = ''; //联表名
    //var sonTemplateName = '';

    var page = req.query.page || 1; //默认显示第一页
    var firstResults = 0; //当前页条目起始位置
    var x = req.query.x; //调试参数


    var sql = ''; //指定栏目目录查询
    var sql_add = ''; //增加条件
    var sql_num = '';
    var count = 10; //默认列表显示10条新闻
    var firstResults_6 = (page - 1) * 6; //只针对精彩活动，每页显示6条
    var firstResults = (page - 1) * count;

    pool.getConnection(function(err, connection) { //确认数据库连接是否正确
        if (err) throw err;

        if (itemTemplateId == 95 || itemTemplateId == 94) {
            sql = "SELECT id,created_at,title,nearby,son_template_id,author,permission,status,del FROM template_base WHERE son_template_id = " + itemTemplateId + " and del=0";
            sql += " order by created_at desc limit " + firstResults + "," + count;
            connection.query(sql, function(err, rows2) { //获取当前页条目所有数据
                if (err)return res.json({ status: '1', message: '未查到数据', error: err });
                if (rows2.length>0) {
                    //获取全部条目个数
                    sql_num = "select id from template_base WHERE son_template_id = " + itemTemplateId + " and del=0";
                    connection.query(sql_num, function(err, rows3) {
                        if (err) throw err;
                        if (Math.ceil(rows3.length / count)<page) return res.send('err page!');
                        if (x == 1) {
                            res.json({
                                total: Math.ceil(rows3.length / count),
                                itemTemplateId: itemTemplateId,
                                lanmu:req.params.lanmu,
                                pages: page,
                                data: rows2,
                                sql: sql,
                                sql_num: sql_num
                            });
                        } else {
                            res.render('news', {
                                total: Math.ceil(rows3.length / count),
                                itemTemplateId: itemTemplateId,
                                lanmu:req.params.lanmu,
                                pages: page,
                                data: rows2
                            });
                        };
                    });
                }else{
                    res.send('没有数据')
                }
            });
        } else if (itemTemplateId == 116) {
            sql = "SELECT id,created_at,content,case_name,propaganda_image_pc,propaganda_image_app,case_introduction,case_icon,industry,type,synchronized_3g2win,synchronized_app,synchronized_wechat,del,case_status,background_colour,son_template_id,status FROM template_case WHERE son_template_id = " + itemTemplateId + " and del=0 and status =1 ";
            sql += " order by created_at desc limit " + firstResults_6 + ",6"; //精彩活动每页显示6条
            connection.query(sql, function(err, rows2) {
                if (err) {
                    console.log(err);
                    return res.json({ status: '1', message: '未查到数据', error: err })

                } else {
                    sql_num = "select id from template_case WHERE son_template_id = " + itemTemplateId + " and del=0 and status =1 ";
                    connection.query(sql_num, function(err, rows3) {
                        if (err) throw err;
                        if (Math.ceil(rows3.length / count)<page)return res.send('err page!');
                        if (x == 1) {
                            res.json({
                                total: Math.ceil(rows3.length / 6),
                                itemTemplateId: itemTemplateId,
                                lanmu:req.params.lanmu,
                                pages: page,
                                data: rows2,
                                sql: sql,
                                sql_num: sql_num
                            });
                        } else {
                            res.render('news_j', {
                                total: Math.ceil(rows3.length / 6),
                                itemTemplateId: itemTemplateId,
                                lanmu:req.params.lanmu,
                                pages: page,
                                data: rows2
                            });
                        };


                    });
                };
            });
        };
        connection.release();
    });
});

//详情页
router.get('/:lanmu/:zid', function(req, res, next) {
    var zid = parseInt(req.params.zid); //将参数转换成数字类型
    var lanmu=req.params.lanmu;
    var lanmus=['hyzx','gfxw','jchd']
    var cn = req.query.cn;
    var x = req.query.x || '';
    if (!zid||!lanmus.some(function (x) {return x==lanmu})) {
        return res.redirect('http://www.appcan.cn/error/404.html')
    } //无法转换成数字类型则返回404，禁止mysql查询
    var sql = "SELECT * FROM template_base WHERE id = " + zid + " and del=0";
    pool.getConnection(function(err, connection) {
        if (err) throw err;
        connection.query(sql, function(err, rows) {
            if (err) throw err;
            if (rows.length > 0) {
                if (x == 1) {
                    res.json({ status: '0', message: '查询成功', channal: cn, data: rows, sql: sql, zid: zid,lanmu:lanmu });
                } else {
                    res.render('news_details', { status: '0',data: rows });
                };
            } else {
                res.send('没有数据');
            };
        });
        connection.release();
    });

})


router.get('/', function(req, res) { //缺省跳转
    res.redirect('/news/gfxw')
})


module.exports = router;