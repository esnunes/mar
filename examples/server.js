
var mar = require('..');

var s = new mar.Server(8081);
s.on('ping', function(msg) {
    console.log('ping sent at [%s]', new Date(msg.data));
    if (msg.reply) msg.reply(null, new Date().getTime());
});
