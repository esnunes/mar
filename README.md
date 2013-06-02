
# MAR

MAR - Message & Reply, is a RPC library based on message exchange.

## Quick Examples

Below you can find some usage examples. The examples listed below can also be found [here](http://github.com/esnunes/mar/tree/master/examples).

### Server
```js
var mar = require('mar');

var count = 0;

var s = new mar.Server(8081);
s.on('ping', function(msg) {
    if (count++ % 10000 == 0) console.log(count);
    console.log('ping sent at [%s]', new Date(msg.data));
    if (msg.reply) msg.reply(null, new Date().getTime());
});
```

### Client
```js
var mar = require('mar');

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
```

### Server - Authentication
```js
var mar = require('mar');

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
```

### Client - Authentication
```js
var mar = require('mar');

var count = 0;

var c = new mar.Client({ host: 'localhost', port: 8081 });
c.on('connect', function() {
    c.message('mar.auth', 'foobar', function(err, auth) {
        if (err) return console.log(err);
        console.log(auth);
        ping();
    });
});

function ping() {
    if (count++ % 10000 == 0) console.log(count);
    c.message('ping', new Date().getTime(), function(err, data) {
        if (err) return console.log('error:', err);
        console.log('pong received at [%s]', new Date(data));
        ping();
    });
}
```

## Download

The source is available for download from
[GitHub](http://github.com/esnunes/mar).
Alternatively, you can install using Node Package Manager (npm):

    npm install mar
