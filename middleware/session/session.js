//key sid// value 用户数据var sessions = {};function Session(sid) {    this.$sid = sid;    // 当会话结束时，使用该方法从服务器中删除 session 对象    this.destroy = function () {        delete sessions[this.$sid];    }}function createSID() {    var chars = '0123456789';    var len = chars.length;    var sid = 'sid-';    for(var i=0;i<len;i++){        var number = Math.floor(Math.random() * len);        sid += number;    }    return sid;}function getSession(req,res) {    var sid;    // 客户端与服务端的会话建立后，客户端会将名称为 sid 的 cookie 发给服务端    if(req.cookies.sid){        sid = req.cookies.sid;//会话已建立    }else {        sid = createSID();//表示客户第一次连接服务器        res.cookie('sid',sid);    }    var session;    if(sessions[sid]){//该sid对应的会话已经存在，则根据SID在sessions中查找        session = sessions[sid];    }else{//表示对话不存在，生成一个新的对话，保存到sessions中        session = new Session(sid);        sessions[sid] = session;    }    return session;}exports.getSession = getSession;