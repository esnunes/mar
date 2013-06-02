
var net = require('net');


var Server = module.exports = function(port) {
    this._remoteMethods = {};

    this._authRequired = false;

    var that = this;
    this._socket = net.createServer(function(s) {
        new ServerClient(that, s);
    });
    this._socket.listen(port);
}

Server.prototype.on = function(subject, fn) {
    if (subject == 'mar.auth') this._authRequired = true;

    this._remoteMethods[subject] = fn;
}

Server.prototype._process = function(msg) {
    if (!this._remoteMethods[msg.subject]) {
        if (msg.reply) msg.reply('unsupported subject [' + msg.subject + ']');
        return;
    }

    this._remoteMethods[msg.subject](msg);
}


var ServerClient = function(server, socket) {
    this._server = server;
    this._socket = socket;

    this.authenticated = false;
    this._buffer = '';

    var that = this;

    socket.setEncoding('utf8');
    socket.setNoDelay(true);

    socket.on('data', function(data) {
        var tokens = that._tokenizer(data);
        for (var i = 0, len = tokens.length; i < len; i++) {
            that._process(tokens[i]);
        }
    });
}

ServerClient.prototype._process = function(msg) {
    var that = this;

    try {
        msg = JSON.parse(msg);
        msg = this.prepare(msg);
        msg = this.auth(msg);
        if (msg) this._server._process(msg);
    } catch (e) {
        console.log('error', e);
    }
}

ServerClient.prototype.auth = function(msg) {
    if (!this._server._authRequired) return msg;
    if (!this.authenticated && msg.subject != 'mar.auth') {
        msg.reply('auth required');
        return;
    }

    var that = this;

    var original = msg.reply;
    msg.reply = function(err, data) {
        if (!err) that.authenticated = true;
        original(err, data);
    }
    return msg;
}

ServerClient.prototype.prepare = function(msg) {
    var that = this;

    if (msg.reply) msg.reply = function(err, data) {
        var reply = {
            id: msg.id
        }
        if (err) {
            console.log('[%s:%s] %s', that._socket.remoteAddress, that._socket.remotePort, err);
            reply.err = err;
            that._socket.write(JSON.stringify(reply) + '\0');
            return;
        }
        reply.data = data;
        that._socket.write(JSON.stringify(reply) + '\0');
    }
    return msg;
}

ServerClient.prototype._tokenizer = function(data) {
    this._buffer += data;

    var result = this._buffer.split('\0');
    if (result.length == 1) return [];

    var last = result.pop();
    if (last === '') {
        this._buffer = '';
        return result;
    } else {
        this._buffer = last;
        return result;
    }
}
