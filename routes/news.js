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

    var page = parseInt(req.query.page) || 1; //默认显示第一页
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
                if (err)return res.redirect('http://www.appcan.cn/error/404.html');
                if (rows2.length>0) {
                    //获取全部条目个数
                    sql_num = "select id from template_base WHERE son_template_id = " + itemTemplateId + " and del=0";
                    connection.query(sql_num, function(err, rows3) {
                        if (err) throw err;
                        var total=Math.ceil(rows3.length / count);
                        if (total<page||page<1)return res.redirect('http://www.appcan.cn/error/404.html');
                        if (x == 1) {
                            res.json({
                                total: total,
                                itemTemplateId: itemTemplateId,
                                lanmu:req.params.lanmu,
                                pages: page,
                                data: rows2,
                                sql: sql,
                                sql_num: sql_num,
                                id:''
                            });
                        } else {
                            res.render('news', {
                                total: total,
                                itemTemplateId: itemTemplateId,
                                lanmu:req.params.lanmu,
                                pages: page,
                                data: rows2,
                                id:''
                            });
                        };
                    });
                }else{
                    res.redirect('http://www.appcan.cn/error/404.html');
                }
            });
        } else if (itemTemplateId == 116) {
            sql = "SELECT id,created_at,content,case_name,propaganda_image_pc,propaganda_image_app,case_introduction,case_icon,industry,type,synchronized_3g2win,synchronized_app,synchronized_wechat,del,case_status,background_colour,son_template_id,status FROM template_case WHERE son_template_id = " + itemTemplateId + " and del=0 and status =1 ";
            sql += " order by created_at desc limit " + firstResults_6 + ",6"; //精彩活动每页显示6条
            connection.query(sql, function(err, rows2) {
                if (err)return res.redirect('http://www.appcan.cn/error/404.html');
                if(rows2.length>0) {
                    sql_num = "select id from template_case WHERE son_template_id = " + itemTemplateId + " and del=0 and status =1 ";
                    connection.query(sql_num, function(err, rows3) {
                        if (err) throw err;
                        var total=Math.ceil(rows3.length / 6);
                        if (total<page||page<1)return res.redirect('http://www.appcan.cn/error/404.html');
                        if (x == 1) {
                            res.json({
                                total: total,
                                itemTemplateId: itemTemplateId,
                                lanmu:req.params.lanmu,
                                pages: page,
                                data: rows2,
                                sql: sql,
                                sql_num: sql_num,
                                id:''
                            });
                        } else {
                            res.render('news_j', {
                                total: total,
                                itemTemplateId: itemTemplateId,
                                lanmu:req.params.lanmu,
                                pages: page,
                                data: rows2,
                                id:''
                            });
                        };


                    });
                }else{
                    return res.redirect('http://www.appcan.cn/error/404.html');
                };
            });
        };
        connection.release();
    });
});

//详情页
router.get('/:lanmu/:zid', function(req, res, next) {
    var zid = req.params.zid; 
    var lanmu=req.params.lanmu;
    var lanmus=['hyzx','gfxw','jchd']
    var cn = req.query.cn;
    var x = req.query.x || '';
    if (isNaN(zid)||!lanmus.some(function (x) {return x==lanmu})) {
        return res.redirect('http://www.appcan.cn/error/404.html');
    } //无法转换成数字类型则返回404，禁止mysql查询
    var sql = "SELECT * FROM template_base WHERE id = " + zid + " and del=0";
    pool.getConnection(function(err, connection) {
        if (err) throw err;
        connection.query(sql, function(err, rows) {
            if (err) throw err;
            if (rows.length > 0) {
            	searchList(lanmu,zid,x,rows,cn,sql,connection,res);
            } else {
                res.redirect('http://www.appcan.cn/error/404.html');
            };
        });
        connection.release();
    });

})


router.get('/', function(req, res) { //缺省跳转
    res.redirect('news/hyzx');
})

function searchList(lanmu,zid,x,fRows,cn,fSql,connection,res) {
	var box={};
	var prev_id=0,next_id;
	var prev_title='',next_title='';
	var father=95;
	if (lanmu=='gfxw') father=94;
	if (lanmu=='jchd') father=116;
	var lSql="select id,title from template_base where son_template_id="+father+" and del=0 order by created_at desc";
	connection.query(lSql,function(err,rows) {
		if (!err) {
			for (var i = 0; i < rows.length; i++) {
				if(rows[i].id==zid){ //当前条目在列表中的索引位置
					if (i==0) {      //索引为0
						prev_id=0;
						prev_title='没有了';
						if (rows.length==1) {		//条目个数为1					
						    next_id=0;
						    next_title='没有了';
						}else{                        //条目个数大于1
                            next_id=rows[i+1].id;
						    next_title=rows[i+1].title;
						}
					}else if(i==(rows.length-1)){    //最后一条 
                        prev_id=rows[i-1].id;
						prev_title=rows[i-1].title;
						next_id=0;
						next_title='没有了';
					}else{ //索引不为0
                        prev_id=rows[i-1].id;
						prev_title=rows[i-1].title;
						next_id=rows[i+1].id;
						next_title=rows[i+1].title;
					}	
				}
			}
			box={
				prev_id:prev_id,
				prev_title:prev_title.replace(/\s+/,''),
				next_id:next_id,
				next_title:next_title.replace(/\s+/,''),
			}
			if (x == 1) {
                res.json({ status: '0', message: '查询成功', channal: cn, data: fRows, sql: fSql, zid: zid,lanmu:lanmu,id:'',add:box });
            } else {
                res.render('news_details', { status: '0', message: '查询成功', channal: cn, data: fRows, sql: fSql, zid: zid,lanmu:lanmu,id:'',add:box });
            };
			return box;

		}else{throw err};
	});
};

module.exports = router;