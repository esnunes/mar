
var Client = require('..').Client;

var address = { host: 'localhost', port: 8081 };

var c = new Client();
c.on('error', function(err) {
  console.log(err);
  c.close();
});
c.on('close', function() {
  console.log('connection closed. trying to reconnect in 5 seconds');
  setTimeout(function() {
    c.connect(address);
  }, 5000);
});
c.on('connect', function() {
  console.log('connected');
  ping(new Date().getTime());
});

c.connect(address);

function ping(timestamp) {
  c.message('ping', timestamp, function(err, data) {
    if (err) return console.log(err);
    console.log('pong received at [%s]', new Date(data));
  });
}
