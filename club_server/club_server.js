
//club_server.js
var express = require("express");
var app = express();
var io = null;
var errorCode = require('../utils/errorCode')
var consts = require('../utils/consts')
var roomMgr = require("../majiang_server/roommgr");
var clientSocketList = [];
var http = require('../utils/http');
var httpService = require('./http_service');

var db = require('../utils/db');
var _config = null;

function initClubServer() {

}

function generateClubId() {
    var roomId = "";
    for (var i = 0; i < 6; ++i) {
        roomId += Math.floor(Math.random() * 10);
    }
    return roomId;
}

exports.initDB = function (config) {
    db.init(config);
}

exports.onDisRoom = function (roomInfo) {

}

/**
 * 给客户端同步房间信息
 * 1、房间创建
 * 2、房间销毁
 * 3、用户加入房间
 * 4、用户离开房间
 * 5、房间开始游戏
 * 6、房间是否可以进入并观战
 * 宗旨是发送房间的简略信息
 */
function boradcastInClub(event, data) {
    // console.log('boradcastInClub.clientCount=', clientSocketList.length);
    for (var i = 0; i < clientSocketList.length; i++) {
        clientSocketList[i].emit('update_rooms_info', data);
    }
    // socket.emit('update_rooms_info', data);
}

function onFailedOpt(path, errorCode) {
    var data = {
        errorCode: errorCode,
    }
    socket.emit(path, data);
}

exports.boradMsg = function (path, data) {
    boradcastInClub(path, data);
}
exports.start = function (config) {
    _config = config;
    initClubServer();

    io = require('socket.io')(config.CLUB_PORT);
    db.init(config);

    console.log('club_server.start linsten port:' + config.CLUB_PORT);
    io.sockets.on('connect', function (socket) {
        clientSocketList.push(socket);
        console.log('clientSocketList.length=', clientSocketList.length);
        socket.on('login', function (data) {
            console.log("club_server.socket.login");
        });
        socket.on('getClubServer', function (data) {
            console.log('getClubServer');
        });
        socket.on('disconnect', function () {
            var index = clientSocketList.indexOf(socket);
            if (index >= 0) {
                clientSocketList.splice(index);
            }
            console.log('index=', index);
            console.log('clientSocketList.length=', clientSocketList.length);
        });

        socket.on('game_ping', function (data) {
            socket.emit('game_pong');
        });

        socket.on('create_club', function (data) {
            var data = JSON.parse(data);
            console.log('create_club');
            db.get_onwer_club_count(data.userId, function (clubCount) {
                if (clubCount != null) {
                    if (clubCount >= consts.club.maxOwnerClub) {
                        //通知前端
                        var ret = {
                            errcode: errorCode.CLUB_CREATE_MAX_LIMIT,
                            errmsg: "ok",
                        };
                        socket.emit('create_club_response', ret);
                    } else {
                        db.get_all_club_id(function (clubIdList) {
                            var clubId = -1;
                            var checkClubId = function () {
                                var isExist = false;
                                clubId = generateClubId();
                                for (var i = 0; i < clubIdList.length; i++) {
                                    if (clubId == clubIdList[i])
                                        isExist = true;
                                }
                                if (clubId <= 99999 || clubId >= 1000000)
                                    isExist = true;
                                if (isExist)
                                    checkClubId();
                                return true;
                            }
                            if (checkClubId()) {
                                console.log("== clubId:" + clubId);
                                db.create_club(clubId, data.userId, data.clubName, function (ret) {//创建成功
                                    if (ret) {
                                        //insert owner
                                        db.insert_club_member(clubId, data.userId, consts.club.author.owner, function (data) {

                                        })
                                        db.get_club_list_by_userId(data.userId, function (ret) {
                                            if (ret != null) {
                                                console.log('get_club_list_by_userid');
                                                // console.log(ret);
                                                for (var i = 0; i < ret.length; i++) {
                                                    ret[i].tableCount = 0;
                                                    ret[i].memberCount = 1;
                                                }
                                                var ret = {
                                                    errorCode: errorCode.SUCCESS,
                                                    errmsg: "createClubSuccess",
                                                    data: ret,
                                                }
                                                socket.emit('create_club_response', ret);
                                            } else {
                                                var ret = {
                                                    errorCode: errorCode.CLUB_CREATE_UNKOWN,
                                                }
                                                socket.emit('create_club_response', ret);
                                            }
                                        });
                                    } else {
                                        var ret = {
                                            errorCode: errorCode.CLUB_CREATE_UNKOWN,
                                        }
                                        socket.emit('create_club_response', ret);
                                    }
                                });
                            }
                        });
                    }
                } else {
                    var ret = {
                        errorCode: errorCode.CLUB_CREATE_UNKOWN,
                    }
                    socket.emit('create_club_response', ret);
                }
            })
        });

        socket.on('join_club', function (data) {
            console.log('join_club = ', data);
            var clientData = JSON.parse(data);
            let unkonw = function () {
                data = {
                    errorCode: errorCode.CLUB_APPLY_UNKONW,
                }
                socket.emit('join_club', data);
            }
            var onInsertApplyClub = function (data) {
                console.log('onInsertApplyClub', data);
                if (data == true) {
                    data = {
                        errorCode: errorCode.SUCCESS,
                        data: clientData,
                    }
                    socket.emit('join_club', data);
                } else {
                    unkonw();
                }
            }
            var onGetApplyClub = function (data) {
                console.log('onGetApplyClub', data);
                if (data != null) {
                    if (data.length > 0) {
                        data = {
                            errorCode: errorCode.CLUB_APPLY_EXIST,
                        }
                        socket.emit('join_club', data);
                    } else {
                        db.insert_apply_club(clientData.userId, clientData.clubId, 'note', onInsertApplyClub);//不存在插入
                    }
                } else {
                    unkonw();
                }
            }
            var onGetClubMember = function (data) {
                console.log('onGetClubMember', data);
                if (data != null) {
                    if (data.length > 0) {
                        data = {
                            errorCode: errorCode.CLUB_APPLY_MEMBER_EXIST_IN_CLUB,
                        }
                        socket.emit('join_club', data);
                    } else {
                        db.select_apply_club_by_id(clientData.clubId, clientData.userId, onGetApplyClub);//检查申请人是否已申请
                    }
                } else {
                    unkonw();
                }
            }
            var onGetClubInfo = function (data) {
                console.log('get_club_info = ', data);
                if (data != null) {
                    if (data.length > 0) {
                        console.log('club_is_exist');
                        db.get_club_member_by_id(clientData.clubId, clientData.userId, onGetClubMember);//检查俱乐部中有无申请人
                    } else {
                        data = {
                            errorCode: errorCode.CLUB_NOT_EXIST,
                        }
                        socket.emit('join_club', data);
                    }
                }
            }
            db.get_club_info(clientData.clubId, onGetClubInfo);//检查俱乐部是否存在
        });

        socket.on('get_club_list', function (data) {
            var clientData = JSON.parse(data);
            var getClubMemberCount = function (clubList) {
                let getCount = 0;
                for (let i = 0; i < clubList.length; i++) {
                    db.get_club_member_count(clubList[i].clubId, function (count) {
                        clubList[i].memberCount = count;
                        clubList[i].tableCount = roomMgr.getClubRoomCount(data[i].clubId);
                        getCount++;
                        if (getCount >= clubList.length) {
                            data = {
                                errorCode: errorCode.SUCCESS,
                                data: clubList,
                            }
                            socket.emit('get_club_list', data);
                        }
                    })
                }
            }
            var onGetClubList = function (data) {
                if (data != null) {
                    getClubMemberCount(data);
                } else {
                    onFailedOpt(errorCode.CLUB_GET_JOIN_CLUB_LIST_UNKOWN);
                }
            }
            var onGetJoinClub = function (data) {
                if (data != null) {
                    let clubIdList = data;
                    console.log('onGetJoinClub.clubIdList=', clubIdList);
                    db.get_club_info_by_list(clubIdList, onGetClubList);
                } else {
                    onFailedOpt('get_join_club', errorCode.CLUB_GET_JOIN_CLUB);
                }
            }
            db.get_join_clubid_list(clientData.userId, onGetJoinClub);
        });

        socket.on('get_club_list', function (data) {
            var clientData = JSON.parse(data);
            var onGetClubList = function (data) {
                console.log('onGetClubList.data=', data);
                if (data != null) {
                    socket.emit('get_club_list', data);
                } else {
                    onFailedOpt(errorCode.CLUB_GET_JOIN_CLUB_LIST_UNKOWN);
                }
            }
            var onGetJoinClub = function (data) {
                if (data != null) {
                    let clubIdList = data;
                    console.log('onGetJoinClub.clubIdList=', clubIdList);
                    db.get_club_info_by_list(clubIdList, onGetClubList);
                } else {
                    onFailedOpt('get_join_club', errorCode.CLUB_GET_JOIN_CLUB);
                }
            }
            db.get_join_clubid_list(clientData.userId, onGetJoinClub);
        });

        socket.on('get_club_info', function (data) {
            data = JSON.parse(data);
            db.get_club_info(data.clubId, function (data) {
                if (data != null) {
                    if (data.length > 0) {
                        db.get_club_member_count(data[0].clubId, function (content) {
                            data[0].memberCount = content;
                            data = {
                                errorCode: errorCode.SUCCESS,
                                data: data[0],
                            }
                            socket.emit('get_club_info', data);
                        });
                    } else {
                        onFailedOpt(errorCode.CLUB_GET_INFO_NOT_EXIST);
                    }
                } else {
                    onFailedOpt(errorCode.CLUB_GET_INFO_UNKOWN);
                }
            });
        });

        socket.on('create_club_play_method', function (data) {
            data = JSON.parse(data);
            db.insert_club_play_method(data.clubId, data.index, data.gameId, data.playMethod, function (data) {
                if (data != null) {
                    db.get_club_all_play_method(data.clubId, function (data) {
                        if (data != null) {
                            data = {
                                errorCode: errorCode.SUCCESS,
                                data: data,
                            }
                            socket.emit('create_club_play_method', data);
                        } else {
                            data = {
                                errorCode: errorCode.CLUB_CREATE_PLAY_METHOD_UNKONW,
                            }
                            socket.emit('create_club_play_method', data);
                        }
                    })
                } else {
                    data = {
                        errorCode: errorCode.CLUB_CREATE_PLAY_METHOD_UNKONW,
                    }
                    socket.emit('create_club_play_method', data);
                }
            })
        });
        socket.on('get_club_all_play_method', function (data) {
            data = JSON.parse(data);
            db.get_club_all_play_method(data.clubId, function (data) {
                if (data != null) {
                    data = {
                        errorCode: errorCode.SUCCESS,
                        data: data,
                    }
                    socket.emit('get_club_all_play_method', data);
                } else {
                    data = {
                        errorCode: errorCode.CLUB_GET_PLAY_METHOD_UNKONW,
                    }
                    socket.emit('get_club_all_play_method', data);
                }
            })
        });
        socket.on('set_club_play_method', function (data) {
            data = JSON.parse(data);
            var clubId = data.clubId;
            db.insert_club_play_method(data.clubId, data.index, data.gameId, data.playMethod, function (data) {
                if (data != null) {
                    db.get_club_all_play_method(clubId, function (data) {
                        if (data != null) {
                            data = {
                                errorCode: errorCode.SUCCESS,
                                data: data,
                            }
                            socket.emit('get_club_all_play_method', data);
                        } else {
                            data = {
                                errorCode: errorCode.CLUB_SET_PLAY_METHOD_UNKONW,
                            }
                            socket.emit('set_club_play_method', data);
                        }
                    })
                } else {
                    data = {
                        errorCode: errorCode.CLUB_SET_PLAY_METHOD_UNKONW,
                    }
                    socket.emit('set_club_play_method', data);
                }
            })
        });

        socket.on(consts.GET_CLUB_ROOMS_BY_GAME_ID, function (data) {//1001
            console.log(consts.GET_CLUB_ROOMS_BY_GAME_ID, data);
            http.get(_config.HALL_IP, _config.HTTP_PORT, '/' + consts.GET_CLUB_ROOMS_BY_GAME_ID, { jsonData: data }, function (ret, data) {
                if (ret) {
                    console.log('ret=', ret);
                    console.log('data=', data);
                    data = {
                        errorCode: errorCode.SUCCESS,
                        data: data.rooms,
                    }
                    socket.emit(consts.GET_CLUB_ROOMS_BY_GAME_ID, data);
                }
            })
        })
        socket.on('get_club_member_list', function (data) {
            console.log('get_club_member_list');
            data = JSON.parse(data);
            var unkonw = function () {
                data = {
                    errorCode: errorCode.CLUB_GET_MEMBER_UNKONW,
                }
                socket.emit('get_club_member_list', data);
            };
            db.get_club_member_list(data.clubId, function (data) {
                console.log(data);
                if (data != null) {
                    data = {
                        errorCode: errorCode.SUCCESS,
                        data: data,
                    }
                    socket.emit('get_club_member_list', data)
                } else {
                    unkonw();
                }
            })
        });
        socket.on('get_club_apply', function (data) {
            data = JSON.parse(data);
            var onSelectApplyClub = function (data) {
                console.log(data);
                if (data != null) {
                    data = {
                        errorCode: errorCode.SUCCESS,
                        data: data,
                    }
                    socket.emit('get_club_apply', data)
                } else {
                    data = {
                        errorCode: errorCode.CLUB_GET_APPLY_UNKONW,
                    }
                    socket.emit('get_club_apply', data);
                }
            }
            db.select_apply_club(data.clubId, onSelectApplyClub);
        });
        socket.on('get_club_rooms', function (data) {
            data = JSON.parse(data);
        });
        socket.on('set_club_member_opt', function (data) {
            var clientData = JSON.parse(data);
            console.log('set_club_member_opt.clientData = ', clientData);
            var unkonw = function () {
                data = {
                    errorCode: errorCode.CLUB_SET_MEMBER_OPT_UNKONW,
                }
                socket.emit('set_club_member_opt', data);
            }
            //TODU:check author
            var onGetClubMemberData = function (data) {
                if (data != null) {
                    data = {
                        errorCode: errorCode.SUCCESS,
                        data: data,
                    }
                    socket.emit('set_club_member_opt', data);
                } else {
                    unkonw();
                }
            }
            var onSetClubMemberOpt = function (data) {
                if (data == true) {
                    db.get_club_member_by_id(clientData.clubId, clientData.userId, onGetClubMemberData);
                } else {
                    unkonw();
                }
            }
            db.set_club_member_opt(clientData.clubId, clientData.targetUserId, clientData.opt, onSetClubMemberOpt);
        });
        socket.on('club_opt_apply', function (data) {
            var clientData = JSON.parse(data);
            console.log('club_opt_apply.clientData=', clientData)
            var unkonw = function (errorCode) {
                console.log('club_opt_apply unkonw=', errorCode);
                var data = {
                    errorCode: errorCode,
                }
                console.log(data);
                socket.emit('club_opt_apply', data);
            }
            var onClubRemoveApply = function (data) {
                console.log('onClubRemoveApply=', data);
                if (data != null) {
                    data = {
                        errorCode: errorCode.SUCCESS,
                        data: clientData,
                    }
                    socket.emit('club_opt_apply', data);
                } else {
                    unkonw(errorCode.CLUB_APPLY_REMOVE_UNKONW);
                }
            }
            var onInsertClubMember = function (data) {
                console.log('onInsertClubMember=', data);
                if (data != null) {
                    db.club_remove_apply(clientData.clubId, clientData.applyUserId, onClubRemoveApply);
                } else {
                    unkonw(errorCode.CLUB_MEMBER_INSERT_UNKONW);
                }
            }
            var onSelectClubApply = function (data) {
                if (data != null) {
                    if (data.length > 0) {
                        db.insert_club_member(clientData.clubId, clientData.applyUserId, consts.club.author.member, onInsertClubMember);
                    } else {
                        unkonw(errorCode.CLUB_APPLY_NOT_EXIST);
                    }
                } else {
                    unkonw(errorCode);
                }
            }
            var onGetClubMemberAuthor = function (data) {
                if (data != null) {
                    if (data[0].author == consts.club.author.owner || data[0].author == consts.club.author.manager) {
                        db.select_apply_club_by_id(clientData.clubId, clientData.applyUserId, onSelectClubApply);
                    } else {
                        unkonw(errorCode.CLUB_APPLY_PERMISSION_DENIED);
                    }
                } else {
                    unkonw(errorCode.CLUB_APPLY_PERMISSION_UNKOWN);
                }
            }
            db.get_club_member_author(clientData.clubId, clientData.optUserId, onGetClubMemberAuthor);
        });
    });
};