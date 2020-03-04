//扎金花逻辑
var roomMgr = require("./roommgr");
var userMgr = require("./usermgr");
var mjutils = require('./mjutils');
var db = require("../utils/db");
var crypto = require("../utils/crypto");
var consts = require('../utils/consts');

var games = {};

var ACTION_CHUPAI = 1;
var ACTION_MOPAI = 2;
var ACTION_PENG = 3;
var ACTION_GANG = 4;
var ACTION_HU = 5;
var ACTION_ZIMO = 6;

var gameSeatsOfUsers = {};
var paiCount = 52;
var notEatHu = [0, 1, 2, 3, 9, 10, 11, 12, 18, 19, 20, 21];
var dgzCanNotHu = [0, 1, 10, 11, 18, 19];
var handCardCount = 3;//手牌数量

function getMJType(id) {
    if (id >= 0 && id < 13) {
        //黑
        return 0;
    } else if (id >= 13 && id < 26) {
        //红
        return 1;
    } else if (id >= 26 && id < 39) {
        //梅
        return 2;
    } else if (id >= 39 && id < 52) {
        //方
        return 3;
    }
}

function getMJNum(id) {
    let result = id % 13 + 1;
    console.log('paiId:' + id);
    console.log('getMJNum:' + result);
    return result;
}

//准备麻将，混乱麻将
function shuffle(game) {

    var mahjongs = game.mahjongs;

    //筒 (0 ~ 13 表示黑桃
    var index = 0;
    for (var i = 0; i < 13; ++i) {
        for (var c = 0; c < 4; ++c) {
            mahjongs[index] = i;
            index++;
        }
    }

    //条 9 ~ 17表示红桃
    for (var i = 13; i < 26; ++i) {
        for (var c = 0; c < 4; ++c) {
            mahjongs[index] = i;
            index++;
        }
    }

    // 18 ~ 26表示梅花
    for (var i = 26; i < 39; ++i) {
        for (var c = 0; c < 4; ++c) {
            mahjongs[index] = i;
            index++;
        }
    }

    //方块
    for (var i = 39; i < 52; ++i) {
        for (var c = 0; c < 4; ++c) {
            mahjongs[index] = i;
            index++;
        }
    }

    //混乱麻将
    for (var i = 0; i < mahjongs.length; ++i) {
        var lastIndex = mahjongs.length - 1 - i;
        var index = Math.floor(Math.random() * lastIndex);
        var t = mahjongs[index];
        mahjongs[index] = mahjongs[lastIndex];
        mahjongs[lastIndex] = t;
    }
}

function mopai(game, seatIndex) {
    if (game.currentIndex == game.mahjongs.length) {
        return -1;
    }
    var data = game.gameSeats[seatIndex];
    var mahjongs = data.holds;
    var pai = game.mahjongs[game.currentIndex];
    mahjongs.push(pai);

    //统计牌的数目 ，用于快速判定（空间换时间）例子：红中有几张
    var c = data.countMap[pai];
    if (c == null) {
        c = 0;
    }
    data.countMap[pai] = c + 1;
    game.currentIndex++;
    return pai;
}

//发牌
function deal(game) {
    //强制清0
    game.currentIndex = 0;
    //console.log('game:' + game);

    //每人13张 一共 13*4 ＝ 52张 庄家多一张 53张
    var seatIndex = game.button;
    let paiCount = handCardCount * game.conf.playerCount;
    for (var i = 0; i < paiCount; ++i) {
        var mahjongs = game.gameSeats[seatIndex].holds;
        if (mahjongs == null) {
            mahjongs = [];
            game.gameSeats[seatIndex].holds = mahjongs;
        }
        mopai(game, seatIndex);
        seatIndex++;
        seatIndex %= game.conf.playerCount;
    }

    //庄家多摸最后一张
    // mopai(game, game.button);
    //当前轮设置为庄家
    game.turn = game.button;
}

function clearAllOptions(game, seatData) {
    var fnClear = function (sd) {
        sd.canPeng = false;
        sd.canGang = false;
        sd.gangPai = [];
        sd.canHu = false;
        sd.lastFangGangSeat = -1;
    }
    if (seatData) {
        fnClear(seatData);
    } else {
        game.qiangGangContext = null;
        for (var i = 0; i < game.gameSeats.length; ++i) {
            fnClear(game.gameSeats[i]);
        }
    }
}

function getSeatIndex(userId) {
    var seatIndex = roomMgr.getUserSeat(userId);
    if (seatIndex == null) {
        return null;
    }
    return seatIndex;
}

function getGameByUserID(userId) {
    var roomId = roomMgr.getUserRoom(userId);
    if (roomId == null) {
        return null;
    }
    var game = games[roomId];
    return game;
}

function hasOperations(seatData) {
    if (seatData.canGang || seatData.canPeng || seatData.canHu) {
        return true;
    }
    return false;
}

function sendOperations(game, seatData, pai) {
    if (hasOperations(seatData)) {
        if (pai == -1) {
            pai = seatData.holds[seatData.holds.length - 1];
        }

        var data = {
            pai: pai,
            hu: seatData.canHu,
            peng: seatData.canPeng,
            gang: seatData.canGang,
            gangpai: seatData.gangPai
        };

        //如果可以有操作，则进行操作
        userMgr.sendMsg(seatData.userId, 'game_action_push', data);

        data.si = seatData.seatIndex;
    } else {
        userMgr.sendMsg(seatData.userId, 'game_action_push');
    }
}

function moveToNextUser(game, nextSeat) {
    game.fangpaoshumu = 0;
    //找到下一个没有和牌的玩家
    if (nextSeat == null) {
        while (true) {
            game.turn++;
            game.turn %= game.conf.playerCount;
            var turnSeat = game.gameSeats[game.turn];
            if (turnSeat.hued == false) {
                return;
            }
        }
    } else {
        game.turn = nextSeat;
    }
}

function calculateResult(game, roomInfo) {
    numOfHued = 1;
    console.log('start calculateResult');
    var baseScore = -1;

    var bankerWin = false;
    var isZimo = false;

    for (var i = 0; i < game.gameSeats.length; i++) {
        if (game.gameSeats[i].hued) {
            baseScore = getMJNum(game.gameSeats[i].hupai);
            if (game.gameSeats[i].seatIndex == game.button) {
                bankerWin = true;

                let ac = game.gameSeats[i].actions;
                if (ac.type == "zimo")
                    isZimo = true;
                break;
            }
        }
    }
    console.log("baseScore:" + baseScore);
    console.log("isZimo:" + isZimo);
    console.log("bankerWin:" + bankerWin);
    if (baseScore < 0) {
        console.log("gamemgr_dgz.calculateResult.baseScore is error");
        return;
    }
    console.log(game.button);
    for (var i = 0; i < game.gameSeats.length; i++) {
        let gameSeat = game.gameSeats[i];
        let tmpScore = 0;

        console.log(' --------  ');
        console.log('tmpScore:' + tmpScore);
        if (gameSeat.hued) {
            console.log('win');
            tmpScore += baseScore * (game.conf.playerCount - 1);
            tmpScore *= isZimo ? 2 : 1;
            tmpScore *= bankerWin ? 2 : 1;
        } else {
            console.log("lose");
            tmpScore -= baseScore;
            tmpScore *= isZimo ? 2 : 1;
            tmpScore *= bankerWin ? 2 : 1;
        }
        game.gameSeats[i].score += tmpScore;
    }
    console.log("baseScore end");
    //gang score
    for (var i = 0; i < game.gameSeats.length; i++) {
        game.gameSeats[i].numMingGang += game.gameSeats[i].wangangs.length + game.gameSeats[i].diangangs.length;
        game.gameSeats[i].numAnGang += game.gameSeats[i].angangs.length;
    }

    var gangScore = function (seatIndex, gangPai, isMingGang) {
        let gangPaiNum = getMJNum(gangPai);
        gangPaiNum *= isMingGang ? 1 : 2;
        console.log(" === gangScore");
        console.log("gangPaiNum:" + gangPaiNum);
        console.log("isMingGang:" + isMingGang);
        for (var i = 0; i < game.gameSeats.length; i++) {
            if (game.gameSeats[i].seatIndex == seatIndex) {
                game.gameSeats[seatIndex].score += gangPaiNum * (game.gameSeats.length - 1);
            } else {
                game.gameSeats[i].score -= gangPaiNum;
            }
            console.log("seatIndex:" + game.gameSeats[i].seatIndex);
            console.log("score:" + game.gameSeats[seatIndex].score);
        }
    }

    for (var i = 0; i < game.gameSeats.length; i++) {
        let seat = game.gameSeats[i];
        console.log("wangangs");
        console.log(seat.wangangs);
        for (var j = 0; j < seat.wangangs.length; j++) {
            gangScore(seat.seatIndex, seat.wangangs[j], true);
        }
        console.log("diangangs");
        console.log(seat.diangangs);
        for (var j = 0; j < seat.diangangs.length; j++) {
            gangScore(seat.seatIndex, seat.diangangs[j], true);
        }
        console.log("angangs");
        console.log(seat.angangs);
        for (var j = 0; j < seat.angangs.length; j++) {
            gangScore(seat.seatIndex, seat.angangs[j], false);
        }
    }

    console.log('calculateResult end');
    //console.log(game.gameSeats);
}

function doGameOver(game, userId, forceEnd) {
    var roomId = roomMgr.getUserRoom(userId);
    if (roomId == null) {
        console.log('doGameOver.roomId is null');
        return;
    }
    var roomInfo = roomMgr.getRoom(roomId);
    if (roomInfo == null) {
        console.log('doGameOver.roomInfo is null');
        return;
    }

    var results = [];
    var dbresult = [];
    for (var i = 0; i < game.conf.playerCount; i++) {
        dbresult.push(0);
    }

    var fnNoticeResult = function (isEnd) {
        console.log('fnNoticeResult');
        var endinfo = null;
        if (isEnd) {
            endinfo = [];
            for (var i = 0; i < roomInfo.seats.length; ++i) {
                var rs = roomInfo.seats[i];
                endinfo.push({
                    numzimo: rs.numZiMo,
                    numjiepao: rs.numJiePao,
                    numdianpao: rs.numDianPao,
                    numangang: rs.numAnGang,
                    numminggang: rs.numMingGang,
                    numchadajiao: rs.numChaJiao,
                });
            }
        }
        userMgr.broacastInRoom('game_over_push', { results: results, endinfo: endinfo }, userId, true);
        //如果局数已够，则进行整体结算，并关闭房间
        if (isEnd) {
            setTimeout(function () {
                if (roomInfo.conf.curPlayRound > 1) {
                    store_history(roomInfo);
                }

                userMgr.kickAllInRoom(roomId);
                roomMgr.destroy(roomId);
                db.archive_games(roomInfo.uuid);
            }, 1500);
        }
    }

    if (game != null) {
        if (!forceEnd) {
            calculateResult(game, roomInfo);
        }

        for (var i = 0; i < roomInfo.seats.length; ++i) {
            var rs = roomInfo.seats[i];
            var sd = game.gameSeats[i];

            rs.ready = false;
            rs.score += sd.score;
            rs.numZiMo += sd.numZiMo;
            rs.numJiePao += sd.numJiePao;
            rs.numDianPao += sd.numDianPao;
            rs.numAnGang += sd.numAnGang;
            rs.numMingGang += sd.numMingGang;
            rs.numChaJiao += sd.numChaJiao;

            var userRT = {
                userId: sd.userId,
                pengs: sd.pengs,
                actions: [],
                wangangs: sd.wangangs,
                diangangs: sd.diangangs,
                angangs: sd.angangs,
                numofgen: sd.numofgen,
                holds: sd.holds,
                fan: sd.fan,
                score: sd.score,
                totalscore: rs.score,
                qingyise: sd.qingyise,
                pattern: sd.pattern,
                isganghu: sd.isGangHu,
                menqing: sd.isMenQing,
                zhongzhang: sd.isZhongZhang,
                jingouhu: sd.isJinGouHu,
                haidihu: sd.isHaiDiHu,
                tianhu: sd.isTianHu,
                dihu: sd.isDiHu,
                huorder: game.hupaiList.indexOf(i),
            };

            for (var k in sd.actions) {
                userRT.actions[k] = {
                    type: sd.actions[k].type,
                };
            }
            results.push(userRT);


            dbresult[i] = sd.score;
            delete gameSeatsOfUsers[sd.userId];
        }
        delete games[roomId];

        var old = roomInfo.nextButton;
        if (game.yipaoduoxiang >= 0) {
            roomInfo.nextButton = game.yipaoduoxiang;
        } else if (game.firstHupai >= 0) {
            roomInfo.nextButton = game.firstHupai;
        } else {
            roomInfo.nextButton = (game.turn + 1) % game.conf.playerCount;
        }

        if (old != roomInfo.nextButton) {
            db.update_next_button(roomId, roomInfo.nextButton);
        }
    }

    if (forceEnd || game == null) {
        fnNoticeResult(true);
    } else {
        //保存游戏
        store_game(game, function (ret) {

            db.update_game_result(roomInfo.uuid, game.gameIndex, dbresult);

            //记录打牌信息
            var str = JSON.stringify(game.actionList);
            db.update_game_action_records(roomInfo.uuid, game.gameIndex, str);

            //保存游戏局数
            db.update_num_of_turns(roomId, roomInfo.conf.curPlayRound);

            //如果是第一次，并且不是强制解散 则扣除房卡
            if (roomInfo.conf.curPlayRound == 1) {
                var cost = 2;
                if (roomInfo.conf.maxPlayRound == 8) {
                    cost = 3;
                }
                db.cost_gems(game.gameSeats[0].userId, cost);
            }

            var isEnd = (roomInfo.conf.curPlayRound >= roomInfo.conf.maxPlayRound);
            fnNoticeResult(isEnd);
        });
    }
}

function recordUserAction(game, seatData, type, target) {
    var d = { type: type, targets: [] };
    if (target != null) {
        if (typeof (target) == 'number') {
            d.targets.push(target);
        } else {
            d.targets = target;
        }
    } else {
        for (var i = 0; i < game.gameSeats.length; ++i) {
            var s = game.gameSeats[i];
            if (i != seatData.seatIndex && s.hued == false) {
                d.targets.push(i);
            }
        }
    }

    seatData.actions.push(d);
    return d;
}

function recordGameAction(game, si, action, pai) {
    game.actionList.push(si);
    game.actionList.push(action);
    if (pai != null) {
        game.actionList.push(pai);
    }
}

exports.setReady = function (userId, callback) {
    var roomId = roomMgr.getUserRoom(userId);
    if (roomId == null) {
        return;
    }
    var roomInfo = roomMgr.getRoom(roomId);
    if (roomInfo == null) {
        return;
    }

    roomMgr.setReady(userId, true);

    var game = games[roomId];
    if (game == null) {
        if (roomInfo.seats.length == roomInfo.conf.playerCount) {
            for (var i = 0; i < roomInfo.seats.length; ++i) {
                var s = roomInfo.seats[i];
                if (s.ready == false || userMgr.isOnline(s.userId) == false) {
                    return;
                }
            }
            //个人到齐了，并且都准备好了，则开始新的一局
            console.log('setReady and start game');
            // exports.begin(roomId);
        }
    } else {
        var numOfMJ = game.mahjongs.length - game.currentIndex;
        var remainingGames = roomInfo.conf.maxPlayRound - roomInfo.conf.curPlayRound;

        var data = {
            state: game.state,
            numofmj: numOfMJ,
            button: game.button,
            turn: game.turn,
            chuPai: game.chuPai,
            huanpaimethod: game.huanpaiMethod
        };

        data.seats = [];
        var seatData = null;
        for (var i = 0; i < roomInfo.conf.playerCount; ++i) {
            var sd = game.gameSeats[i];

            var s = {
                userid: sd.userId,
                folds: sd.folds,
                angangs: sd.angangs,
                diangangs: sd.diangangs,
                wangangs: sd.wangangs,
                pengs: sd.pengs,
                que: sd.que,
                hued: sd.hued,
                iszimo: sd.iszimo,
            }
            if (sd.userId == userId) {
                s.holds = sd.holds;
                s.huanpais = sd.huanpais;
                seatData = sd;
            } else {
                s.huanpais = sd.huanpais ? [] : null;
            }
            data.seats.push(s);
        }

        //同步整个信息给客户端
        userMgr.sendMsg(userId, 'game_sync_push', data);
        sendOperations(game, seatData, game.chuPai);
    }
}

function store_single_history(userId, history) {
    db.get_user_history(userId, function (data) {
        if (data == null) {
            data = [];
        }
        while (data.length >= 10) {
            data.shift();
        }
        data.push(history);
        db.update_user_history(userId, data);
    });
}

function store_history(roomInfo) {
    var seats = roomInfo.seats;
    var history = {
        uuid: roomInfo.uuid,
        id: roomInfo.id,
        time: roomInfo.createTime,
        seats: new Array(roomInfo.conf.playerCount)
    };

    for (var i = 0; i < seats.length; ++i) {
        var rs = seats[i];
        var hs = history.seats[i] = {};
        hs.userid = rs.userId;
        hs.name = crypto.toBase64(rs.name);
        hs.score = rs.score;
    }

    for (var i = 0; i < seats.length; ++i) {
        var s = seats[i];
        store_single_history(s.userId, history);
    }
}

function construct_game_base_info(game) {
    console.log("construct_game_base_info");
    var baseInfo = {
        type: game.conf.type,
        button: game.button,
        index: game.gameIndex,
        mahjongs: game.mahjongs,
        game_seats: new Array(game.conf.playerCount)
    }

    for (var i = 0; i < game.conf.playerCount; ++i) {
        baseInfo.game_seats[i] = game.gameSeats[i].holds;
    }
    game.baseInfoJson = JSON.stringify(baseInfo);
}

function store_game(game, callback) {
    db.create_game(game.roomInfo.uuid, game.gameIndex, game.baseInfoJson, callback);
}

//开始新的一局
exports.begin = function (roomId) {
    var roomInfo = roomMgr.getRoom(roomId);
    if (roomInfo == null) {
        return;
    }
    var seats = roomInfo.seats;

    var game = {
        conf: roomInfo.conf,
        roomInfo: roomInfo,
        gameIndex: roomInfo.conf.curPlayRound,

        button: roomInfo.nextButton,
        mahjongs: new Array(paiCount),
        currentIndex: 0,
        gameSeats: new Array(roomInfo.conf.playerCount),

        numOfQue: 0,
        turn: 0,
        chuPai: -1,
        state: "idle",
        // firstHupai: -1,
        // yipaoduoxiang: -1,
        // fangpaoshumu: -1,
        // actionList: [],
        // hupaiList: [],
        // chupaiCnt: 0,
    };

    console.log('gamemgr_dgz.begin');
    roomInfo.conf.curPlayRound++;

    for (var i = 0; i < roomInfo.conf.playerCount; ++i) {
        var data = game.gameSeats[i] = {};

        //zjh
        data.game = game;

        data.seatIndex = i;

        data.userId = seats[i].userId;
        //持有的牌
        data.holds = [];

        data.fan = 0;
        data.score = 0;

        gameSeatsOfUsers[data.userId] = data;
    }
    games[roomId] = game;
    //洗牌
    shuffle(game);
    //发牌
    deal(game);

    var numOfMJ = game.mahjongs.length - game.currentIndex;

    for (var i = 0; i < seats.length; ++i) {
        //开局时，通知前端必要的数据
        var s = seats[i];
        //通知玩家手牌
        userMgr.sendMsg(s.userId, 'game_holds_push', game.gameSeats[i].holds);

        //通知还剩多少张牌
        userMgr.sendMsg(s.userId, 'mj_count_push', numOfMJ);
        //通知还剩多少局
        userMgr.sendMsg(s.userId, 'game_num_push', roomInfo.conf.curPlayRound);
        //通知游戏开始
        userMgr.sendMsg(s.userId, 'game_begin_push', game.button);
    }
    userMgr.broacastInRoom('game_playing_push', null, seats[0].userId, true);

    construct_game_base_info(game);

    var turnSeat = game.gameSeats[game.turn];
    game.state = "playing";
    //通知玩家出牌方
    turnSeat.canChuPai = true;
    //TODU:接着往下整理扎金花逻辑
    // var data = {
    //     msgId:consts.ZJH_OPT
    // }
    // userMgr.broacastInRoom(consts.zjh_msg,
    userMgr.broacastInRoom('game_chupai_push', turnSeat.userId, turnSeat.userId, true);

    //检查胡 用最后一张来检查
    checkCanHu(game, turnSeat, turnSeat.holds[turnSeat.holds.length - 1], true);
    //通知前端
    sendOperations(game, turnSeat, game.chuPai);
};

exports.isPlaying = function (userId) {
    var seatData = gameSeatsOfUsers[userId];
    if (seatData == null) {
        return false;
    }

    var game = seatData.game;

    if (game.state == "idle") {
        return false;
    }
    return true;
}

exports.hasBegan = function (roomId) {
    var game = games[roomId];
    if (game != null) {
        return true;
    }
    var roomInfo = roomMgr.getRoom(roomId);
    if (roomInfo != null) {
        return roomInfo.conf.curPlayRound > 0;
    }
    return false;
};


var dissolvingList = [];

exports.doDissolve = function (roomId) {
    var roomInfo = roomMgr.getRoom(roomId);
    if (roomInfo == null) {
        return null;
    }

    var game = games[roomId];
    doGameOver(game, roomInfo.seats[0].userId, true);
};

exports.dissolveRequest = function (roomId, userId) {
    var roomInfo = roomMgr.getRoom(roomId);
    if (roomInfo == null) {
        return null;
    }

    if (roomInfo.dr != null) {
        return null;
    }

    var seatIndex = roomMgr.getUserSeat(userId);
    if (seatIndex == null) {
        return null;
    }

    let localSeat = [];
    for (let i = 0; i < roomInfo.conf.playerCount; i++) {
        localSeat.push(false);
    }
    roomInfo.dr = {
        endTime: Date.now() + 30000,
        states: localSeat,
    };
    roomInfo.dr.states[seatIndex] = true;

    dissolvingList.push(roomId);

    return roomInfo;
};

exports.dissolveAgree = function (roomId, userId, agree) {
    var roomInfo = roomMgr.getRoom(roomId);
    if (roomInfo == null) {
        return null;
    }

    if (roomInfo.dr == null) {
        return null;
    }

    var seatIndex = roomMgr.getUserSeat(userId);
    if (seatIndex == null) {
        return null;
    }

    if (agree) {
        roomInfo.dr.states[seatIndex] = true;
    } else {
        roomInfo.dr = null;
        var idx = dissolvingList.indexOf(roomId);
        if (idx != -1) {
            dissolvingList.splice(idx, 1);
        }
    }
    return roomInfo;
};


function update() {
    for (var i = dissolvingList.length - 1; i >= 0; --i) {
        var roomId = dissolvingList[i];

        var roomInfo = roomMgr.getRoom(roomId);
        if (roomInfo != null && roomInfo.dr != null) {
            if (Date.now() > roomInfo.dr.endTime) {
                console.log("delete room and games");
                exports.doDissolve(roomId);
                dissolvingList.splice(i, 1);
            }
        } else {
            dissolvingList.splice(i, 1);
        }
    }
}

setInterval(update, 1000);
