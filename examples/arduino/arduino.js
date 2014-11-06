var Cylon = require('cylon');

Cylon.config({
  api: {
    ssl: false,
    port: '8080',
    host: '0.0.0.0'
  }
});

Cylon.api();

Cylon.robot({
  name: 'arduino',
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0'  },
  device: {name: 'led', driver: 'led', pin: 13}
}).start();
