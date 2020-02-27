var consts = {

    GET_CLUB_ROOMS_BY_GAME_ID: 1001,

    /**
     * 游戏类型
     */
    gameType: {
        pk_zjh: 1001,//炸金花
        pk_ddz: 1002,//斗地主
        pk_zlm: 1003,//捉老麻
        mj_dgz: 2001,//榆林打锅子
        mj_sxmj: 2002,//陕西麻将
    },

    /**
     * 房间类型
     */
    roomType: {
        gold: 1001,      //金币场
        diamond: 1002,   //钻石场
        match: 1003,     //比赛场
    },

    readyMethod: {
        autoReady: 1001,//自动准备

    },

    club: {
        maxOwnerClub: 10,//俱乐部最大创建个数
        maxJoinClub: 3,//俱乐部最大加入个数
        author: {//权限
            owner: 0,//创建者
            manager: 1,//管理者
            member: 2,//成员
        },
        opt: {
            removeMember: 0,
            setGm: 1,
            cancelGm: 2,
            setBan: 3,
            cancelBan: 4
        }
    },
    clubRoomInfo: {
        creatRoom: 0,
        joinRoom: 1,
        exitRoom: 2,
        startGame: 3,
        dissRoom: 4,
    }
}

module.exports = consts;