
var mar = require('..');

var count = 0;

var c = new mar.Client({ host: 'localhost', port: 8081 });
c.on('connect', function ping() {
    if (count++ % 10000 == 0) console.log(count);
    c.message('ping', new Date().getTime(), function(err, data) {
        if (err) return console.log('error:', err);
        console.log('pong received at [%s]', new Date(data));
        ping();
    });
});
