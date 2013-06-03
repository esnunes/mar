
var mar = require('..');

var c = new mar.Client({ host: 'localhost', port: 8081 });
c.on('connect', function() {
    c.message('mar.auth', 'foobar', function(err, auth) {
        if (err) return console.log(err);
        console.log(auth);
        ping();
    });
});

function ping() {
    c.message('ping', new Date().getTime(), function(err, data) {
        if (err) return console.log('error:', err);
        console.log('pong received at [%s]', new Date(data));
    });
}
