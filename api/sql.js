var mysql = require('mysql');
var pool = mysql.createPool({
    host: '192.168.2.190',
    //host: 'mas.3g2win.com',
    user: 'root',
    password: '',
    port: '3306',
    database: 'cj0531'
});
module.exports=pool