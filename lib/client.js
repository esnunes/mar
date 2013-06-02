
var net = require('net'),
    EventEmitter = require('events').EventEmitter;

var Client = module.exports = function(address) {
    this._nextId = 0;
    this._buffer = '';
    this._callbacks = {};

    this.connected = false;

    var that = this;

    this._socket = new net.Socket();

    this._socket.setEncoding('utf8');
    this._socket.setNoDelay(true);

    this._socket.on('data', function(data) {
        var tokens = that._tokenizer(data);
        for (var i = 0, len = tokens.length; i < len; i++) {
            that._process(tokens[i]);
        }
    });
    this._socket.on('connect', function() {
        that.connected = true;
        that.emit('connect');
    });
    this._socket.on('error', function(e) {
        that._socket.end();
    });
    this._socket.on('close', function() {
        that._reset();
        that.emit('close');
    });
    this._socket.connect(address);
}

Client.prototype.__proto__ = EventEmitter.prototype;

Client.prototype._process = function(msg) {
    var that = this;

    try {
        msg = JSON.parse(msg);
        if (!this._callbacks[msg.id]) return;

        var err = msg.err || undefined;
        var data = msg.data || undefined;

        var fn = this._callbacks[msg.id];
        delete this._callbacks[msg.id];
        fn(err, data);
    } catch (e) {
        console.log('error', e);
    }
}

Client.prototype.message = function(subject, data, fn) {
    var that = this;

    if (!this.connected) {
        if (fn) fn('not connected');
        return;
    }

    var msg = {
        subject: subject,
        data: data
    }

    if (fn) {
        msg.id = this._uniqueId();
        msg.reply = true;
        this._callbacks[msg.id] = fn;
    }

    this._socket.write(JSON.stringify(msg) + '\0');
}

Client.prototype._reset = function() {
    this.connected = false;
    for (var key in this._callbacks) {
        var fn = this._callbacks[key];
        fn('connection lost');
    }
    this._callbacks = {};
}

Client.prototype._uniqueId = function() {
    return this._nextId++;
}

Client.prototype._tokenizer = function(data) {
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

