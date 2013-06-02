
var mar = require('..');

var count = 0;

var s = new mar.Server(8081);
s.on('ping', function(msg) {
    if (count++ % 10000 == 0) console.log(count);
    console.log('ping sent at [%s]', new Date(msg.data));
    if (msg.reply) msg.reply(null, new Date().getTime());
});
