var crypto = require('../utils/crypto');
var express = require('express');
var db = require('../utils/db');
var http = require("../utils/http");
var consts = require('../utils/consts');
var club_service = require('./club_server');

var app = express();

function send(res, ret) {
    var str = JSON.stringify(ret);
    res.send(str)
}

exports.start = function (cfg) {
    app.listen(cfg.CLUB_HTTP_PORT);
    console.log("club http_service is listening on ", cfg.HALL_IP, cfg.CLUB_HTTP_PORT);
}

exports.sendTo

//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/update_rooms_info', function (req, res) {
    console.log(req.path);
    console.log(req.query);
    data = JSON.parse(req.query.jsonData);
    club_service.boradMsg(req.path, data);
});
