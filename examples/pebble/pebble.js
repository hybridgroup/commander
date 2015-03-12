var Cylon = require('cylon');

Cylon.robot({
  name: 'pebble',
  connection: { name: 'pebble', adaptor: 'pebble' },
  device: { name: 'pebble', driver: 'pebble' }
});

Cylon.api('http',{
  host: '0.0.0.0',
  port: '8080',
  ssl:  false
});

Cylon.start();
