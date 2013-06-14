
var Client = require('..').Client;

var c = new Client();
c.on('connect', function() {
  c.message('mar.auth', 'foobar', function(err, auth) {
    if (err) return console.log(err);
    console.log(auth);
    ping();
  });
});

function ping() {
  c.message('ping', new Date().getTime(), function(err, data) {
    if (err) return console.log(err);
    console.log('pong received at [%s]', new Date(data));
  });
}

c.connect({ host: 'localhost', port: 8081 });
