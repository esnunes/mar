
var Client = require('..').Client;

var c = new Client();
c.on('connect', function ping() {
  c.message('ping', new Date().getTime(), function(err, data) {
    if (err) return console.log(err);
    console.log('pong received at [%s]', new Date(data));
  });
});
c.connect({ host: 'localhost', port: 8081 });
