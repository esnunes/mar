
# MAR

MAR - Message & Reply - RPC library based on message exchange.

## Quick Examples

Below you can find some usage examples. The examples below are also listed [here](http://github.com/esnunes/mar/tree/master/examples).

### Server
```js
var mar = require('mar');

var s = new mar.Server(8081);
s.on('ping', function(msg) {
    console.log('ping sent at [%s]', new Date(msg.data));
    if (msg.reply) msg.reply(null, new Date().getTime());
});
```

### Client
```js
var mar = require('mar');

var c = new mar.Client({ host: 'localhost', port: 8081 });
c.on('connect', function ping() {
    c.message('ping', new Date().getTime(), function(err, data) {
        if (err) return console.log('error:', err);
        console.log('pong received at [%s]', new Date(data));
    });
});
```

### Server - Authentication
```js
var mar = require('mar');

var s = new mar.Server(8081);
s.on('ping', function(msg) {
    console.log('ping sent at [%s]', new Date(msg.data));
    if (msg.reply) msg.reply(null, new Date().getTime());
});

s.on('mar.auth', function(msg) {
    if (msg.data != 'foobar') return msg.reply('auth denied');
    msg.reply(null, 'auth granted');
});
```

### Client - Authentication
```js
var mar = require('mar');

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
```

## Download

The source is available for download from
[GitHub](http://github.com/esnunes/mar).
Alternatively, you can install using Node Package Manager (npm):

    npm install mar

## Future - TODO

There are many thoughts about future features for MAR library. You can find them [here](http://github.com/esnunes/mar/blob/master/TODO.md).
