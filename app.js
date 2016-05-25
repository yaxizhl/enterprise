var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var routes = require('./routes/index');
var productSystem = require('./routes/productSystem');//产品体系
var news = require('./routes/news');//新闻活动
var solution = require('./routes/solution');//解决方案

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/productSystem', productSystem);//产品体系
app.use('/news', news);//新闻活动
app.use('/solution', solution);//解决方案
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.redirect('http://www.appcan.cn/error/404.html');
});

//异常处理
app.use(function(err, req, res, next) {
  res.redirect('http://www.appcan.cn/error/404.html');
});



process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err);
    
});

app.listen(9999);
console.log('service running!!!')
module.exports = app;
