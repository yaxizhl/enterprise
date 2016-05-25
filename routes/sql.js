var mysql = require('mysql');
var pool = mysql.createPool({
    host: '192.168.1.102',
    //host: 'mas.3g2win.com',
    user: 'train_user',
    password: 'trainpass',
    port: '3306',
    database: 'train_db'
});

module.exports=pool