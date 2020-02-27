var mysql = require("mysql");
var crypto = require('./crypto');
var consts = require('./consts')

var pool = null;

function nop(a, b, c, d, e, f, g) {

}

function query(sql, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err, null, null);
        } else {
            console.log(sql);
            conn.query(sql, function (qerr, vals, fields) {
                //释放连接  
                conn.release();
                //事件驱动回调  
                callback(qerr, vals, fields);
            });
        }
    });
};

function select_query(sql, callback) {
    callback = callback == null ? nop : callback;
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(null)
            throw err;
        } else {
            callback(rows);
        }
    })
}

function update_query(sql, callback) {
    callback = callback == null ? nop : callback;
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(false);
            throw err;
        } else {
            if (rows.length > 0)
                callback(true);
        }
    })
}

exports.init = function (config) {
    pool = mysql.createPool({
        host: config.HOST,
        user: config.USER,
        password: config.PSWD,
        database: config.DB,
        port: config.PORT,
    });
};

exports.is_account_exist = function (account, callback) {
    callback = callback == null ? nop : callback;
    if (account == null) {
        callback(false);
        return;
    }

    var sql = 'SELECT * FROM t_accounts WHERE account = "' + account + '"';
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(false);
            throw err;
        }
        else {
            if (rows.length > 0) {
                callback(true);
            }
            else {
                callback(false);
            }
        }
    });
};

exports.create_account = function (account, password, callback) {
    callback = callback == null ? nop : callback;
    if (account == null || password == null) {
        callback(false);
        return;
    }

    var psw = crypto.md5(password);
    var sql = 'INSERT INTO t_accounts(account,password) VALUES("' + account + '","' + psw + '")';
    query(sql, function (err, rows, fields) {
        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                callback(false);
                return;
            }
            callback(false);
            throw err;
        }
        else {
            callback(true);
        }
    });
};

exports.get_account_info = function (account, password, callback) {
    callback = callback == null ? nop : callback;
    if (account == null) {
        callback(null);
        return;
    }

    var sql = 'SELECT * FROM t_accounts WHERE account = "' + account + '"';
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }

        if (rows.length == 0) {
            callback(null);
            return;
        }

        if (password != null) {
            var psw = crypto.md5(password);
            if (rows[0].password == psw) {
                callback(null);
                return;
            }
        }

        callback(rows[0]);
    });
};

exports.is_user_exist = function (account, callback) {
    callback = callback == null ? nop : callback;
    if (account == null) {
        callback(false);
        return;
    }

    var sql = 'SELECT userid FROM t_users WHERE account = "' + account + '"';
    query(sql, function (err, rows, fields) {
        if (err) {
            throw err;
        }

        if (rows.length == 0) {
            callback(false);
            return;
        }

        callback(true);
    });
}


exports.get_user_data = function (account, callback) {
    callback = callback == null ? nop : callback;
    if (account == null) {
        callback(null);
        return;
    }

    var sql = 'SELECT userid,account,name,lv,exp,coins,gems,roomid FROM t_users WHERE account = "' + account + '"';
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }

        if (rows.length == 0) {
            callback(null);
            return;
        }
        // rows[0].name = crypto.fromBase64(rows[0].name);
        callback(rows[0]);
    });
};

exports.get_user_data_by_userid = function (userid, callback) {
    callback = callback == null ? nop : callback;
    if (userid == null) {
        callback(null);
        return;
    }

    var sql = 'SELECT userid,account,name,lv,exp,coins,gems,roomid FROM t_users WHERE userid = ' + userid;
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }

        if (rows.length == 0) {
            callback(null);
            return;
        }
        // rows[0].name = crypto.fromBase64(rows[0].name);
        callback(rows[0]);
    });
};

/**增加玩家房卡 */
exports.add_user_gems = function (userid, gems, callback) {
    callback = callback == null ? nop : callback;
    if (userid == null) {
        callback(false);
        return;
    }

    var sql = 'UPDATE t_users SET gems = gems +' + gems + ' WHERE userid = ' + userid;
    query(sql, function (err, rows, fields) {
        if (err) {
            console.log(err);
            callback(false);
            return;
        }
        else {
            callback(rows.affectedRows > 0);
            return;
        }
    });
};

exports.get_gems = function (account, callback) {
    callback = callback == null ? nop : callback;
    if (account == null) {
        callback(null);
        return;
    }

    var sql = 'SELECT gems FROM t_users WHERE account = "' + account + '"';
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }

        if (rows.length == 0) {
            callback(null);
            return;
        }

        callback(rows[0]);
    });
};

exports.get_user_history = function (userId, callback) {
    callback = callback == null ? nop : callback;
    if (userId == null) {
        callback(null);
        return;
    }

    var sql = 'SELECT history FROM t_users WHERE userid = "' + userId + '"';
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }

        if (rows.length == 0) {
            callback(null);
            return;
        }
        var history = rows[0].history;
        if (history == null || history == "") {
            callback(null);
        }
        else {
            console.log(history.length);
            history = JSON.parse(history);
            callback(history);
        }
    });
};

exports.update_user_history = function (userId, history, callback) {
    callback = callback == null ? nop : callback;
    if (userId == null || history == null) {
        callback(false);
        return;
    }

    history = JSON.stringify(history);
    var sql = 'UPDATE t_users SET roomid = null, history = \'' + history + '\' WHERE userid = "' + userId + '"';
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(false);
            throw err;
        }

        if (rows.length == 0) {
            callback(false);
            return;
        }

        callback(true);
    });
};

exports.get_games_of_room = function (room_uuid, callback) {
    callback = callback == null ? nop : callback;
    if (room_uuid == null) {
        callback(null);
        return;
    }

    var sql = 'SELECT game_index,create_time,result FROM t_games_archive WHERE room_uuid = "' + room_uuid + '"';
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }

        if (rows.length == 0) {
            callback(null);
            return;
        }

        callback(rows);
    });
};

exports.get_detail_of_game = function (room_uuid, index, callback) {
    callback = callback == null ? nop : callback;
    if (room_uuid == null || index == null) {
        callback(null);
        return;
    }
    var sql = 'SELECT base_info,action_records FROM t_games_archive WHERE room_uuid = "' + room_uuid + '" AND game_index = ' + index;
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }

        if (rows.length == 0) {
            callback(null);
            return;
        }
        callback(rows[0]);
    });
}

exports.create_user = function (account, name, coins, gems, sex, headimg, callback) {
    callback = callback == null ? nop : callback;
    if (account == null || name == null || coins == null || gems == null) {
        callback(false);
        return;
    }
    if (headimg) {
        headimg = '"' + headimg + '"';
    }
    else {
        headimg = 'null';
    }
    // name = crypto.toBase64(name);
    var sql = 'INSERT INTO t_users(account,name,coins,gems,sex,headimg) VALUES("{0}","{1}",{2},{3},{4},{5})';
    sql = sql.format(account, name, coins, gems, sex, headimg);
    query(sql, function (err, rows, fields) {
        if (err) {
            throw err;
        }
        callback(true);
    });
};

exports.update_user_info = function (userid, name, headimg, sex, callback) {
    callback = callback == null ? nop : callback;
    if (userid == null) {
        callback(null);
        return;
    }

    if (headimg) {
        headimg = '"' + headimg + '"';
    }
    else {
        headimg = 'null';
    }
    name = crypto.toBase64(name);
    var sql = 'UPDATE t_users SET name="{0}",headimg={1},sex={2} WHERE account="{3}"';
    sql = sql.format(name, headimg, sex, userid);
    query(sql, function (err, rows, fields) {
        if (err) {
            throw err;
        }
        callback(rows);
    });
};

exports.get_user_base_info = function (userid, callback) {
    callback = callback == null ? nop : callback;
    if (userid == null) {
        callback(null);
        return;
    }
    var sql = 'SELECT name,sex,headimg FROM t_users WHERE userid={0}';
    sql = sql.format(userid);
    query(sql, function (err, rows, fields) {
        if (err) {
            throw err;
        }
        // rows[0].name = crypto.fromBase64(rows[0].name);
        callback(rows[0]);
    });
};

exports.get_all_rooms = function (callback) {
    var sql = 'SELECT * FROM nine.t_rooms';
    select_query(sql, callback);
}
exports.is_room_exist = function (roomId, callback) {
    callback = callback == null ? nop : callback;
    var sql = 'SELECT * FROM t_rooms WHERE id = "' + roomId + '"';
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(false);
            throw err;
        }
        else {
            callback(rows.length > 0);
        }
    });
};

exports.cost_gems = function (userid, cost, callback) {
    callback = callback == null ? nop : callback;
    var sql = 'UPDATE t_users SET gems = gems -' + cost + ' WHERE userid = ' + userid;
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(false);
            throw err;
        }
        else {
            callback(rows.length > 0);
        }
    });
};

exports.set_room_id_of_user = function (userId, roomId, callback) {
    callback = callback == null ? nop : callback;
    if (roomId != null) {
        roomId = '"' + roomId + '"';
    }
    var sql = 'UPDATE t_users SET roomid = ' + roomId + ' WHERE userid = "' + userId + '"';
    query(sql, function (err, rows, fields) {
        if (err) {
            console.log(err);
            callback(false);
            throw err;
        }
        else {
            callback(rows.length > 0);
        }
    });
};

exports.get_room_id_of_user = function (userId, callback) {
    callback = callback == null ? nop : callback;
    var sql = 'SELECT roomid FROM t_users WHERE userid = "' + userId + '"';
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }
        else {
            if (rows.length > 0) {
                callback(rows[0].roomid);
            }
            else {
                callback(null);
            }
        }
    });
};


exports.create_room = function (roomId, conf, ip, port, create_time, callback) {
    callback = callback == null ? nop : callback;
    var sql = "INSERT INTO t_rooms(uuid,id,base_info,ip,port,create_time) \
                VALUES('{0}','{1}','{2}','{3}',{4},{5})";
    var uuid = Date.now() + roomId;
    var baseInfo = JSON.stringify(conf);
    sql = sql.format(uuid, roomId, baseInfo, ip, port, create_time);
    query(sql, function (err, row, fields) {
        if (err) {
            callback(null);
            throw err;
        }
        else {
            callback(uuid);
        }
    });
};

exports.get_room_uuid = function (roomId, callback) {
    callback = callback == null ? nop : callback;
    var sql = 'SELECT uuid FROM t_rooms WHERE id = "' + roomId + '"';
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }
        else {
            callback(rows[0].uuid);
        }
    });
};

exports.update_seat_info = function (roomId, seatIndex, userId, icon, name, callback) {
    callback = callback == null ? nop : callback;
    var sql = 'UPDATE t_rooms SET user_id{0} = {1},user_icon{0} = "{2}",user_name{0} = "{3}" WHERE id = "{4}"';
    name = crypto.toBase64(name);
    sql = sql.format(seatIndex, userId, icon, name, roomId);
    query(sql, function (err, row, fields) {
        if (err) {
            callback(false);
            throw err;
        }
        else {
            callback(true);
        }
    });
}

exports.update_num_of_turns = function (roomId, numOfTurns, callback) {
    callback = callback == null ? nop : callback;
    var sql = 'UPDATE t_rooms SET num_of_turns = {0} WHERE id = "{1}"'
    sql = sql.format(numOfTurns, roomId);
    query(sql, function (err, row, fields) {
        if (err) {
            callback(false);
            throw err;
        }
        else {
            callback(true);
        }
    });
};


exports.update_next_button = function (roomId, nextButton, callback) {
    callback = callback == null ? nop : callback;
    var sql = 'UPDATE t_rooms SET next_button = {0} WHERE id = "{1}"'
    sql = sql.format(nextButton, roomId);
    query(sql, function (err, row, fields) {
        if (err) {
            callback(false);
            throw err;
        }
        else {
            callback(true);
        }
    });
};

exports.get_room_addr = function (roomId, callback) {
    callback = callback == null ? nop : callback;
    if (roomId == null) {
        callback(false, null, null);
        return;
    }

    var sql = 'SELECT ip,port FROM t_rooms WHERE id = "' + roomId + '"';
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(false, null, null);
            throw err;
        }
        if (rows.length > 0) {
            callback(true, rows[0].ip, rows[0].port);
        }
        else {
            callback(false, null, null);
        }
    });
};

exports.get_room_data = function (roomId, callback) {
    callback = callback == null ? nop : callback;
    if (roomId == null) {
        callback(null);
        return;
    }

    var sql = 'SELECT * FROM t_rooms WHERE id = "' + roomId + '"';
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }
        if (rows.length > 0) {
            // rows[0].user_name0 = crypto.fromBase64(rows[0].user_name0);
            // rows[0].user_name1 = crypto.fromBase64(rows[0].user_name1);
            // rows[0].user_name2 = crypto.fromBase64(rows[0].user_name2);
            // rows[0].user_name3 = crypto.fromBase64(rows[0].user_name3);
            callback(rows[0]);
        }
        else {
            callback(null);
        }
    });
};

exports.delete_room = function (roomId, callback) {
    callback = callback == null ? nop : callback;
    if (roomId == null) {
        callback(false);
    }
    var sql = "DELETE FROM t_rooms WHERE id = '{0}'";
    sql = sql.format(roomId);
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(false);
            throw err;
        }
        else {
            callback(true);
        }
    });
}

exports.create_game = function (room_uuid, index, base_info, callback) {
    callback = callback == null ? nop : callback;
    var sql = "INSERT INTO t_games(room_uuid,game_index,base_info,create_time) VALUES('{0}',{1},'{2}',unix_timestamp(now()))";
    sql = sql.format(room_uuid, index, base_info);
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }
        else {
            callback(rows.insertId);
        }
    });
};

exports.delete_games = function (room_uuid, callback) {
    callback = callback == null ? nop : callback;
    if (room_uuid == null) {
        callback(false);
    }
    var sql = "DELETE FROM t_games WHERE room_uuid = '{0}'";
    sql = sql.format(room_uuid);
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(false);
            throw err;
        }
        else {
            callback(true);
        }
    });
}

exports.archive_games = function (room_uuid, callback) {
    callback = callback == null ? nop : callback;
    if (room_uuid == null) {
        callback(false);
    }
    var sql = "INSERT INTO t_games_archive(SELECT * FROM t_games WHERE room_uuid = '{0}')";
    sql = sql.format(room_uuid);
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(false);
            throw err;
        }
        else {
            exports.delete_games(room_uuid, function (ret) {
                callback(ret);
            });
        }
    });
}

exports.update_game_action_records = function (room_uuid, index, actions, callback) {
    callback = callback == null ? nop : callback;
    var sql = "UPDATE t_games SET action_records = '" + actions + "' WHERE room_uuid = '" + room_uuid + "' AND game_index = " + index;
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(false);
            throw err;
        }
        else {
            callback(true);
        }
    });
};

exports.update_game_result = function (room_uuid, index, result, callback) {
    callback = callback == null ? nop : callback;
    if (room_uuid == null || result) {
        callback(false);
    }

    result = JSON.stringify(result);
    var sql = "UPDATE t_games SET result = '" + result + "' WHERE room_uuid = '" + room_uuid + "' AND game_index = " + index;
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(false);
            throw err;
        }
        else {
            callback(true);
        }
    });
};

exports.get_message = function (type, version, callback) {
    callback = callback == null ? nop : callback;

    var sql = 'SELECT * FROM t_message WHERE type = "' + type + '"';

    if (version == "null") {
        version = null;
    }

    if (version) {
        version = '"' + version + '"';
        sql += ' AND version != ' + version;
    }

    query(sql, function (err, rows, fields) {
        if (err) {
            callback(false);
            throw err;
        }
        else {
            if (rows.length > 0) {
                callback(rows[0]);
            }
            else {
                callback(null);
            }
        }
    });
};

exports.get_game_info = function (callback) {
    callback = callback == null ? nop : callback;
    var sql = 'SELECT * FROM game';
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(null);
        } else {
            callback(rows);
        }
    })
}

/********   club  ********/
exports.get_all_club_id = function (callback) {
    callback = callback == null ? nop : callback;
    var sql = 'SELECT club.clubid FROM club';
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(null);
        } else {
            callback(rows);
        }
    })
}

exports.get_onwer_club_count = function (userId, callback) {
    console.log("get_onwer_club_count");
    callback = callback == null ? nop : callback;
    var sql = 'SELECT COUNT(id) FROM club WHERE club.ownerId = ' + userId + ';'
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        } else {
            callback(rows[0]['COUNT(id)']);
        }
    })
};

exports.create_club = function (clubId, userId, clubName, callback) {
    callback = callback == null ? nop : callback;
    var ownerNameSql = '(select t_users.`name` FROM t_users WHERE t_users.userid=' + userId + ')';
    var ownerHeadUrl = '(select t_users.`headimg` FROM t_users WHERE t_users.userid = ' + userId + ')';
    var sql = 'INSERT INTO club(clubId,clubName,ownerId,ownerName,createtime,opening,ownerHeadUrl)VALUES' +
        '(' + clubId + ',\'' + clubName + '\',' + userId + ',' + ownerNameSql + ',' + Date.now() + ',' + false + ',' + ownerHeadUrl + ');';
    query(sql, function (err, rows, fields) {
        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                callback(false);
                return;
            }
            callback(false);
            throw err;
        }
        else {
            callback(true);
        }
    });
};

exports.insert_apply_club = function (userId, clubId, notice, callback) {
    callback = callback == null ? nop : callback;
    var nickNameSql = '(SELECT t_users.name FROM t_users WHERE t_users.userId = ' + userId + ')';
    var sql = 'INSERT INTO clubapply (clubapply.userId,clubapply.clubId,clubapply.time,clubapply.note,clubapply.nickName)'
        + 'VALUES(' + userId + ',' + clubId + ',' + Date.now() + ',\'' + notice + '\',' + nickNameSql + ');'
    query(sql, function (err, rows, fields) {
        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                callback(false);
                return;
            }
            callback(false);
            throw err;
        }
        else {
            callback(true);
        }
    });
}
exports.club_remove_apply = function (clubId, userId, callback) {
    var sql = 'DELETE FROM clubapply WHERE clubId = ' + clubId + ' AND userId = ' + userId;
    select_query(sql, callback);
}
exports.select_apply_club = function (clubId, callback) {
    var sql = 'SELECT * FROM clubapply WHERE clubapply.clubId = ' + clubId;
    select_query(sql, callback);
}

exports.select_apply_club_by_id = function (clubId, userId, callback) {
    var sql = 'SELECT * FROM clubapply WHERE clubapply.clubId = ' + clubId + " and clubapply.userId = " + userId;
    select_query(sql, callback);
}

exports.insert_club_member = function (clubId, userId, grade, callback) {
    var ownerNameSql = '(select t_users.`name` FROM t_users WHERE t_users.userid=' + userId + ')';
    var ownerHeadUrl = '(select t_users.`headimg` FROM t_users WHERE t_users.userid = ' + userId + ')';
    var sql = 'INSERT INTO clubuser(clubuser.userId,clubuser.nickName,clubuser.headUrl,clubuser.clubId,clubuser.grade,clubuser.author)VALUES(' +
        userId + ',' + ownerNameSql + ',' + ownerHeadUrl + ',' + clubId + ',' + grade + ',' + grade + ');';
    select_query(sql, callback);
}

exports.get_club_member_count = function (clubId, callback) {
    callback = callback == null ? nop : callback;
    var sql = 'SELECT COUNT(*) FROM clubuser WHERE clubId = ' + clubId;
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        } else {
            callback(rows[0]['COUNT(*)']);
        }
    })
}

exports.get_club_member_by_id = function (clubId, userId, callback) {
    var sql = 'SELECT * FROM clubuser WHERE clubId = ' + clubId + ' and userId = ' + userId;
    select_query(sql, callback);
}

exports.get_club_member_list = function (clubId, callback) {
    var sql = 'SELECT * FROM clubuser WHERE clubId = ' + clubId;
    select_query(sql, callback);
}

exports.get_club_list_by_userId = function (userId, callback) {
    callback = callback == null ? nop : callback;
    var sql = 'SELECT * FROM club WHERE club.ownerId = ' + userId;
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }
        else {
            callback(rows);
        }
    })
};

exports.get_join_clubid_list = function (userId, callback) {
    var sql = 'SELECT clubuser.clubId from clubuser where userId = ' + userId;
    select_query(sql, callback);
};

exports.get_club_info = function (clubId, callback) {
    callback = callback == null ? nop : callback;
    var sql = 'SELECT * FROM club WHERE club.clubid = ' + clubId;
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        } else {
            callback(rows);
        }
    })
};
exports.get_club_info_by_list = function (idList, callback) {
    if (idList.length <= 0) {
        callback([]);
        return;
    }
    var sql = 'SELECT * FROM club WHERE clubId = ' + idList[0].clubId;
    for (var i = 1; i < idList.length; i++) {
        sql += ' or clubId = ' + idList[i].clubId;
    }
    select_query(sql, callback);

};
exports.insert_club_play_method = function (clubId, index, gameId, playMethod, callback) {
    playMethod = JSON.stringify(playMethod);
    var gameNameSql = '(SELECT gameName FROM game WHERE gameId = ' + gameId + ')';
    var sql = 'INSERT INTO clubPlayMethod (clubPlayMethod.gameName,clubPlayMethod.playMethod,clubPlayMethod.type,clubPlayMethod.gameId,clubPlayMethod.clubId,clubPlayMethod.index)' +
        'VALUES(' + gameNameSql + ',\'' + playMethod + '\',' + 0 + ',' + gameId + ',' + clubId + ',' + index + ');'
    select_query(sql, callback);
}
exports.update_club_play_method = function (clubId, index, gameId, playMethod, callback) {
    var gameNameSql = 'SELECT gameName FROM game WHERE gameId = ' + gameId;
    var sql = 'UPDATE SET clubPlayMethod (clubPlayMethod.gameName,clubPlayMethod.playMethod,clubPlayMethod.type,clubPlayMethod.gameId,clubPlayMethod.clubId,clubPlayMethod.index)' +
        'VALUES(' + gameNameSql + ',' + playMethod + ',' + 0 + ',' + gameId + ',' + clubId + ',' + index + ');'
    select_query(sql, callback);
}

exports.get_club_all_play_method = function (clubId, callback) {
    var sql = 'SELECT * FROM clubPlayMethod WHERE clubId = ' + clubId;
    select_query(sql, callback);
}

exports.set_club_member_opt = function (clubId, userId, opt, callback) {
    var sql = '';
    if (opt == consts.club.opt.removeMember) {
        // sql = 'UPDATE SET '
    } else if (opt == consts.club.opt.setGm) {
        sql = 'UPDATE clubuser SET clubuser.author = ' + consts.club.author.manager + ' WHERE clubuser.clubId = ' + clubId + ' and clubuser.userId = ' + userId + ';'
    } else if (opt == consts.club.opt.cancelGm) {
        sql = 'UPDATE clubuser SET clubuser.author = ' + consts.club.author.member + ' WHERE clubuser.clubId = ' + clubId + ' and clubuser.userId = ' + userId + ';'
    } else if (opt == consts.club.opt.setBan) {
        sql = 'UPDATE clubuser SET clubuser.ban = TRUE WHERE clubuser.clubId = ' + data.clubId + ' and clubuser.userId = ' + data.userId;
    } else if (opt == consts.club.opt.cancelBan) {
        sql = 'UPDATE clubuser SET clubuser.ban = FALSE WHERE clubuser.clubId = ' + data.clubId + ' and clubuser.userId = ' + data.userId;
    }
    console.log('set_club_member_opt.sql=', sql);
    update_query(sql, callback);
}
exports.get_club_member_author = function (clubId, userId, callback) {
    var sql = 'SELECT clubuser.author FROM clubuser WHERE clubId =' + clubId + ' AND userId =' + userId;
    select_query(sql, callback);
}


exports.query = query;