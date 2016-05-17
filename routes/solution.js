var express = require('express');
var router = express.Router();
var pool = require('./sql');

router.get('/:lanmu', function(req, res, next) {
    var lanmus = ['329', '328', '270', '269', '268', '140','solution','85'];
    var lm=['329', '328', '270', '269', '268', '140'];
    var templateName=['template_base','template_case']
    var itemTemplateId = req.params.lanmu; //获取栏目参数
    if (!lanmus.some(function(x) {return x == itemTemplateId })) {
        return res.redirect('http://www.appcan.cn/error/404.html');
    }

    var page = req.query.page || 1;
    var count = 9;//经典案例每页9个条目
    var firstResults = (page - 1) * count;//当前页条目起始位置
    var x = req.query.x;//调试用
    var sql='';

    pool.getConnection(function(err, connection) {
        if (err) {//确认数据库连接是否正确
            res.json({ status: '1', message: '连接出错' });
            throw err;
        }; 
        //判断是否属于行业类型
        if (lm.some(function(x){return x==itemTemplateId})) {
            sql="select * from template_base where id=" + itemTemplateId + " and del=0";
            connection.query(sql, function(err, rows) {
                if (err) throw err;
                if (rows.length>0) {
                    if (x==1) {
                        res.json({ status: '0', data: rows, sql: sql })
                    }else{
                        res.render('solution', { status: '0', data: rows });
                    };
                }else{
                    res.json({ status: '1', message: '未查到数据' });
                };
            });
        }else if (itemTemplateId==85) {//经典案例
            sql="SELECT id,created_at,case_name,propaganda_image_pc,propaganda_image_app,case_introduction,case_icon,industry,type,synchronized_3g2win,synchronized_app,synchronized_wechat,del,case_status,background_colour,son_template_id,status FROM " 
            + templateName[1] + " WHERE son_template_id = " + itemTemplateId + " and del=0 and status =1 ";
            sql+=" order by created_at desc limit " + firstResults + "," + count;
            connection.query(sql,function(err,rows) {
                if (err) throw err;
                if (rows.length>0) {
                    var sql_num = "SELECT id from " 
                    + templateName[1] + " WHERE son_template_id = " + itemTemplateId + " and del=0 and status =1 ";
                    connection.query(sql_num,function(err,rows2) {
                        if (err) throw err;
                        if (Math.ceil(rows2.length / count)<page)return res.send('err page!');                 
                        if (x == 1) {
                            res.json({
                                total: Math.ceil(rows2.length / count),
                                template_name: templateName[1],
                                itemTemplateId: itemTemplateId,
                                lanmu:itemTemplateId,
                                pages: page,
                                data: rows,
                                sql: sql
                            });
                        } else {
                            res.render('solution_j', {
                                total: Math.ceil(rows2.length / count),
                                template_name: templateName[1],
                                itemTemplateId: itemTemplateId,
                                lanmu:itemTemplateId,
                                pages: page,
                                data: rows
                            });
                        };                     
                    });
                }else{
                    res.json({ status: '1', message: '未查到数据' });
                };
            });
        }else if (itemTemplateId=='solution') {//客户名录
            res.render('solution_html',{});
        } else {
            res.redirect('http://www.appcan.cn/error/404.html');
        };
        connection.release();
    });
});

//详情页
router.get('/:lanmu/:wen', function(req, res, next) {
    var lanmu=req.params.lanmu;
    var id = req.params.wen;
    var x = req.query.x||'';
    var sql = "SELECT * FROM template_case WHERE id = " + id + " and del=0";
    if (lanmu!=85) return res.redirect('http://www.appcan.cn/error/404.html');
    pool.getConnection(function(err, connection) {
        if (err) throw err;
        connection.query(sql, function(err, rows) {
            if (err) throw err;
            if (rows.length > 0) {
                if (x == 1) {
                    res.json({ status: '0', message: '查询成功',lanmu:lanmu, data: rows, sql: sql});
                } else {
                    res.render('solution_details', {lanmu:lanmu,data: rows});
                };
            } else {
                res.json({ status: '1', message: '未查到数据' });
            };
        });
        connection.release();
    });

})

router.get('/', function(req, res) { //缺省跳转
    res.redirect('/solution/329');
})

module.exports = router;