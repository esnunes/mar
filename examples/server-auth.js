
var Server = require('..').Server;

var s = new Server(8081);
s.on('ping', function(msg) {
    console.log('ping sent at [%s]', new Date(msg.data));
    if (msg.reply) msg.reply(null, new Date().getTime());
});

s.on('mar.auth', function(msg) {
    if (msg.data != 'foobar') msg.reply('auth denied');
    msg.reply(null, 'auth granted');
});
