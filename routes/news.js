var express = require('express');
var router = express.Router();
var pool=require('./sql');

router.get('/', function(req, res, next) {
    var templateName = '';
    var itemTemplateId = req.query.itemTemplateId||95;
    var sonTemplateName = "";
    var count=10;
    var page=req.query.page||1;
    var firstResults='';
    var flag = false;
    var x=req.query.x;

    var sql = 'select template_name,name from item_template where id=' + itemTemplateId;
    var sql_0 = '';
    var sql_c = '';
    var sql_6 = '';
    var firstResults_6 = (page - 1) * 6;
    var firstResults = (page - 1) * count;

    //
    pool.getConnection(function(err, connection) {
        if (err) {res.json({ status: '1', message: '连接出错' }); throw err};//确认数据库连接是否正确
        connection.query(sql, function(err, rows) {
            if (err){throw err} ;//确认是否查询出错
            if (rows.length > 0) {
                flag = true;
                templateName = rows[0].template_name;
            } else {
                res.json({ status: '1', message: '未查到数据' });
            };
            if (flag) {
                if (templateName == 'template_base') {
                    sql_0 = "SELECT id,created_at,title,nearby,son_template_id,author,permission,status,del FROM " + templateName + " WHERE son_template_id = " + itemTemplateId + " and del=0";
                }else if (templateName == 'template_case') {
                    sql_0 = "SELECT id,created_at,content,case_name,propaganda_image_pc,propaganda_image_app,case_introduction,case_icon,industry,type,synchronized_3g2win,synchronized_app,synchronized_wechat,del,case_status,background_colour,son_template_id,status FROM " 
                    + templateName + " WHERE son_template_id = " + itemTemplateId + " and del=0 and status =1 ";
                   
                };
                sql_6 =sql_0+ " order by created_at desc limit " + firstResults_6 + "," + 6 + "";                 
                sql_c =sql_0+ " order by created_at desc limit " + firstResults + "," + count + "";
                if (itemTemplateId==116) {
                    connection.query(sql_6,function(err,rows2) {
                        if (err){
                            console.log(err) ;
                            return res.json({ status: '1', message: '未查到数据',error:err })

                        }else{
                            var sql3='select id from '+templateName+ " WHERE son_template_id = " + itemTemplateId + " and del=0 and status =1 ";
                            connection.query(sql3,function (err,rows3) {
                                if (err) throw err;
                                if (x==1) {
                                   res.json({
                                        total: Math.ceil(rows3.length/6),
                                        template_name:rows[0].name,
                                        itemTemplateId:itemTemplateId,
                                        pages:page,
                                        data:rows2,
                                        sql_6:sql_6,
                                        sql3:sql3
                                    }); 
                                }else{
                                    res.render('news_j',{
                                        total:Math.ceil(rows3.length/6),
                                        template_name:rows[0].name,
                                        itemTemplateId:itemTemplateId,
                                        pages:page,
                                        data:rows2
                                    });
                                };
                                
                                
                            });
                        };
                    }); 
                }else{
                    connection.query(sql_c,function(err,rows2) {//获取所有数据
                        if (err){
                            console.log(err) ;
                            return res.json({ status: '1', message: '未查到数据',error:err })

                        }else{
                            var sql3='select id from '+templateName+ " WHERE son_template_id = " + itemTemplateId + " and del=0 and status =1 ";
                            connection.query(sql3,function (err,rows3) {
                                if (err) throw err;
                                if (x==1) {
                                   res.json({
                                        total: Math.ceil(rows3.length/count),
                                        template_name:rows[0].name,
                                        itemTemplateId:itemTemplateId,
                                        pages:page,
                                        data:rows2,
                                        sql_c:sql_c,
                                        sql3:sql3
                                    }); 
                                }else{
                                    res.render('news',{
                                        total:Math.ceil(rows3.length/count),
                                        template_name:rows[0].name,
                                        itemTemplateId:itemTemplateId,
                                        pages:page,
                                        data:rows2
                                    });
                                };
                                
                                
                            });
                        };
                    }); 
                };                
                
                
            };
        });
        connection.release();
    });
});

//详情页
router.get('/details/:zid',function (req,res,next) {
    var zid=parseInt(req.params.zid);
    var cn=req.query.cn;
    var x=req.query.x||'';
    if (!zid) {return res.redirect('http://www.appcan.cn/error/404.html')}
    var sql = "SELECT * FROM template_base WHERE id = "+zid+" and del=0";
    pool.getConnection(function(err,connection) {
        if (err) throw err;
        connection.query(sql,function (err,rows) {
            if (err) throw err;
            if (rows.length>0) {                
                if (x==1) {
                    res.json({ status: '0', message: '查询成功' ,channal:cn,data:rows,sql:sql,zid:zid});
                }else{
                    res.render('news_details',{ status: '0', message: '查询成功' ,channal:cn,data:rows});
                };
            }else{
                res.json({ status: '1', message: '未查到数据' });
            };
        });
        connection.release();
    });
    
})





module.exports = router;

