var club_server = require("./club_server.js");
var http_service = require("./http_service.js");

//从配置文件获取服务器信息
var configs = require(process.argv[2]);
var config = configs.hall_server();
var configdb = configs.mysql();

//俱乐部逻辑服务器
club_server.start(config);
club_server.initDB(configdb);

//俱乐部http服务器，用于内部通讯
http_service.start(config);
