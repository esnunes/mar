
var mar = require('..');

var count = 0;

var s = new mar.Server(8081);
s.on('ping', function(msg) {
    if (count++ % 10000 == 0) console.log(count);
    console.log('ping sent at [%s]', new Date(msg.data));
    if (msg.reply) msg.reply(null, new Date().getTime());
});

s.on('mar.auth', function(msg) {
    if (msg.data == 'foobar') {
        msg.reply(null, 'auth granted');
    } else {
        msg.reply('auth denied');
    }
});
