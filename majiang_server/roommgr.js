var db = require('../utils/db');
var errorCode = require('../utils/errorCode')
var consts = require('../utils/consts')

var rooms = {};
var creatingRooms = {};

var userLocation = {};
var totalRooms = 0;

var DI_FEN = [1, 2, 5];
var MAX_FAN = [3, 4, 5];
var JU_SHU = [4, 8];
var JU_SHU_COST = [2, 3];

function generateRoomId() {
	var roomId = "";
	for (var i = 0; i < 6; ++i) {
		roomId += Math.floor(Math.random() * 10);
	}
	return roomId;
}

function constructRoomFromDb(dbdata) {
	let confData = JSON.parse(dbdata.base_info);
	var roomInfo = {
		uuid: dbdata.uuid,
		id: dbdata.id,
		//curPlayRound:dbdata.num_of_turns,
		createTime: dbdata.create_time,
		nextButton: dbdata.next_button,
		//seats:new Array(4),
		conf: JSON.parse(dbdata.base_info),
		seats: new Array(confData.playerCount),
	};
	roomInfo.curPlayRound = dbdata.num_of_turns;

	if (roomInfo.conf.type == consts.gameType.pk_zjh) {//

	} else if (roomInfo.conf.type == consts.gameType.pk_ddz) {

	} else if (roomInfo.conf.type == consts.gameType.pk_zlm) {

	} else if (roomInfo.conf.type == consts.gameType.mj_dgz) {
		roomInfo.gameMgr = require('./gamemgr_dgz');
	} else if (roomInfo.conf.type == consts.gameType.mj_sxmj) {
	}

	var roomId = roomInfo.id;

	for (var i = 0; i < roomInfo.conf.playerCount; ++i) {
		var s = roomInfo.seats[i] = {};
		s.userId = dbdata["user_id" + i];
		s.score = dbdata["user_score" + i];
		s.name = dbdata["user_name" + i];
		s.ready = false;
		s.seatIndex = i;
		s.numZiMo = 0;
		s.numJiePao = 0;
		s.numDianPao = 0;
		s.numAnGang = 0;
		s.numMingGang = 0;
		s.numChaJiao = 0;

		if (s.userId > 0) {
			userLocation[s.userId] = {
				roomId: roomId,
				seatIndex: i
			};
		}
	}
	rooms[roomId] = roomInfo;
	totalRooms++;
	return roomInfo;
}

exports.init = function () {
	db.get_all_rooms(function (data) {
		for (let k in data) {
			rooms[data[k].id] = constructRoomFromDb(data[k]);
		}
	});
}

exports.getClubRoomCount = function (clubId) {
	let count = 0;
	for (var i = 0; i < rooms.length; i++) {
		if (rooms[i].conf.clubId == clubId)
			count++;
	}
	return 10;
}

exports.getClubRoomsByGameId = function (clubId, gameId) {
	// console.log('roommgr.getClubRoomsByGameId', clubId, ' gameId:', gameId);
	let result = [];
	console.log(rooms);
	for (let k in rooms) {
		if (rooms[k].conf.clubId == clubId && rooms[k].conf.type == gameId) {
			// console.log('getClubRoomsByGameId=', rooms[k]);
			var playerList = [];
			for (let i = 0; i < rooms[k].seats.length; i++) {
				if (rooms[k].seats[i].userId > 0) {
					let userInfo = {
						userId: rooms[k].seats[i].userId,
						nickName: rooms[k].seats[i].name,
					}
					playerList.push(userInfo);
				}
			}
			var dd = {
				playerCount: rooms[k].conf.playerCount,
				roomId: rooms[k].id,
				gameType: rooms[k].conf.type,
				index: rooms[k].id,
				playerList: playerList,
			}
			result.push(dd);
		}
	}
	return result;
}

exports.createRoom = function (creator, roomConf, gems, ip, port, callback) {

	// console.log("roommgr.createroom");
	console.log('roomConf=', roomConf);
	if (roomConf == null) {
		callback(errorCode.ROOM_CONF_IS_NULL, "");
		return;
	}

	if (roomConf.roomType == consts.roomType.gold) {//金币场不能创建房间？？
		callback(errorCode.ROOM_TYPE_NOT_MATCH, "");
		return;
	}

	var getCost = function (roomConf) {
		return 0;
	}
	// console.log('gems:'+gems);
	if (gems < getCost(roomConf)) {
		callback(errorCode.DIAMOND_NOT_ENOUGH, "");
		return;
	}

	var fnCreate = function () {
		var roomId = generateRoomId();
		if (rooms[roomId] != null || creatingRooms[roomId] != null) {
			fnCreate();
		}
		else {
			creatingRooms[roomId] = true;
			db.is_room_exist(roomId, function (ret) {

				if (ret) {
					delete creatingRooms[roomId];
					fnCreate();
				}
				else {

					roomConf.creator = creator;
					roomConf.curPlayRound = 0;
					roomConf.baseScore = 1;

					var createTime = Math.ceil(Date.now() / 1000);
					var roomInfo = {
						uuid: "",
						id: roomId,
						createTime: createTime,
						nextButton: 0,
						seats: [],
						// conf:{
						// 	type:roomConf.type,
						// 	baseScore:DI_FEN[roomConf.difen],
						//     zimo:roomConf.zimo,
						//     jiangdui:roomConf.jiangdui,
						//     hsz:roomConf.huansanzhang,
						//     dianganghua:parseInt(roomConf.dianganghua),
						//     menqing:roomConf.menqing,
						//     tiandihu:roomConf.tiandihu,
						//     maxFan:MAX_FAN[roomConf.zuidafanshu],
						//     maxPlayRound:JU_SHU[roomConf.jushuxuanze],
						//     creator:creator,
						// }
						conf: roomConf,
					};

					if (roomInfo.conf.type == consts.gameType.pk_zjh) {//

						roomInfo.gameMgr = require('./gamemgr_pk_zjh');
					} else if (roomInfo.conf.type == consts.gameType.pk_ddz) {

					} else if (roomInfo.conf.type == consts.gameType.pk_zlm) {

					} else if (roomInfo.conf.type == consts.gameType.mj_dgz) {
						roomInfo.gameMgr = require('./gamemgr_dgz');
						if (roomInfo.conf.maxPlayRound == 0) {
							roomInfo.conf.maxPlayRound = 4;
						} else if (roomInfo.conf.maxPlayRound == 1) {
							roomInfo.conf.maxPlayRound = 8;
						} else if (roomInfo.conf.maxPlayRound == 2) {
							roomInfo.conf.maxPlayRound = 16;
						} else if (roomInfo.conf.maxPlayRound == 3) {
							roomInfo.conf.maxPlayRound = 24;
						}
					} else if (roomInfo.conf.type == consts.gameType.mj_sxmj) {

					}

					for (var i = 0; i < roomConf.playerCount; ++i) {
						roomInfo.seats.push({
							userId: 0,
							score: 0,
							name: "",
							ready: false,
							seatIndex: i,
							numZiMo: 0,
							numJiePao: 0,
							numDianPao: 0,
							numAnGang: 0,
							numMingGang: 0,
							numChaJiao: 0,
						});
					}

					//写入数据库
					var conf = roomInfo.conf;
					db.create_room(roomInfo.id, roomInfo.conf, ip, port, createTime, function (uuid) {
						delete creatingRooms[roomId];
						if (uuid != null) {
							roomInfo.uuid = uuid;
							console.log(uuid);
							rooms[roomId] = roomInfo;
							totalRooms++;
							callback(0, roomInfo);
						}
						else {
							callback(3, null);
						}
					});
				}
			});
		}
	}

	fnCreate();
};

exports.destroy = function (roomId) {
	var roomInfo = rooms[roomId];
	if (roomInfo == null) {
		return;
	}

	for (var i = 0; i < roomInfo.conf.playerCount; ++i) {
		var userId = roomInfo.seats[i].userId;
		if (userId > 0) {
			delete userLocation[userId];
			db.set_room_id_of_user(userId, null);
		}
	}

	delete rooms[roomId];
	totalRooms--;
	db.delete_room(roomId);
}

exports.getTotalRooms = function () {
	return totalRooms;
}

exports.getRoom = function (roomId) {
	return rooms[roomId];
};

exports.getRooms = function () {
	return rooms;
}

exports.getTotalRooms = function (clubId, index) {
};

exports.isCreator = function (roomId, userId) {
	var roomInfo = rooms[roomId];
	if (roomInfo == null) {
		console.error('roomInfo is null');
		return false;
	}
	return roomInfo.conf.creator == userId;
};

exports.enterRoom = function (roomId, userId, userName, callback) {
	// console.log("enterRoom");
	// console.log(userId+"//"+ userName);
	var fnTakeSeat = function (room) {
		if (exports.getUserRoom(userId) == roomId) {
			//已存在
			return 0;
		}

		for (var i = 0; i < room.conf.playerCount; ++i) {
			var seat = room.seats[i];
			if (seat.userId <= 0) {
				seat.userId = userId;
				seat.name = userName;
				userLocation[userId] = {
					roomId: roomId,
					seatIndex: i
				};
				console.log('enterRoom:', userLocation[userId]);
				db.update_seat_info(roomId, i, seat.userId, "", seat.name);
				//正常
				return 0;
			}
		}
		//房间已满
		return 1;
	}
	var room = rooms[roomId];
	if (room) {
		var ret = fnTakeSeat(room);
		callback(ret);
	}
	else {
		db.get_room_data(roomId, function (dbdata) {
			if (dbdata == null) {
				//找不到房间
				callback(errorCode.ROOM_NOT_EXIST);
			}
			else {
				//construct room.
				room = constructRoomFromDb(dbdata);
				//
				var ret = fnTakeSeat(room);
				callback(ret);
			}
		});
	}
};

exports.setReady = function (userId, value) {
	var roomId = exports.getUserRoom(userId);
	if (roomId == null) {
		return;
	}

	var room = exports.getRoom(roomId);
	if (room == null) {
		return;
	}

	var seatIndex = exports.getUserSeat(userId);
	if (seatIndex == null) {
		return;
	}

	var s = room.seats[seatIndex];
	s.ready = value;
}

exports.isReady = function (userId) {
	var roomId = exports.getUserRoom(userId);
	if (roomId == null) {
		return;
	}

	var room = exports.getRoom(roomId);
	if (room == null) {
		return;
	}

	var seatIndex = exports.getUserSeat(userId);
	if (seatIndex == null) {
		return;
	}

	var s = room.seats[seatIndex];
	return s.ready;
}


exports.getUserRoom = function (userId) {
	var location = userLocation[userId];
	if (location != null) {
		return location.roomId;
	}
	return null;
};
//location = { roomId: '299957', seatIndex: 0 }
exports.getRoomClubId = function (userId) {
	var location = userLocation[userId];
	console.log('userLocation:', userLocation);
	console.log(location);
	if (location != null) {
		return location.conf.clubId;
	}
	return null;
};

exports.getUserSeat = function (userId) {
	var location = userLocation[userId];
	//console.log(userLocation[userId]);
	if (location != null) {
		return location.seatIndex;
	}
	return null;
};

exports.getUserLocations = function () {
	return userLocation;
};

exports.exitRoom = function (userId) {
	var location = userLocation[userId];
	if (location == null)
		return;

	var roomId = location.roomId;
	var seatIndex = location.seatIndex;
	var roomInfo = rooms[roomId];
	delete userLocation[userId];
	if (roomInfo == null || seatIndex == null) {
		return;
	}

	var seat = roomInfo.seats[seatIndex];
	seat.userId = 0;
	seat.name = "";

	var numOfPlayers = 0;
	for (var i = 0; i < roomInfo.seats.length; ++i) {
		if (roomInfo.seats[i].userId > 0) {
			numOfPlayers++;
		}
	}
	var data = {//TODU:这个只适用麻将，其他游戏要处理
		userId: 0,
		score: 0,
		name: "",
		ready: false,
		seatIndex: i,
		numZiMo: 0,
		numJiePao: 0,
		numDianPao: 0,
		numAnGang: 0,
		numMingGang: 0,
		numChaJiao: 0,
	}
	seat = data;
	db.set_room_id_of_user(userId, null);

	if (numOfPlayers == 0 && roomInfo.conf.clubId == 0) {
		exports.destroy(roomId);
	}
};