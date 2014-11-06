var Cylon = require('cylon');

Cylon.config({
  api: {
    ssl: false,
    port: '8080',
    host: '0.0.0.0',
  }
});

Cylon.api();

Cylon.robot({
  name: 'pebble',
  connection: { name: 'pebble', adaptor: 'pebble' },
  device: { name: 'pebble', driver: 'pebble' }
}).start();
