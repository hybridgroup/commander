var Cylon = require('cylon');

Cylon.robot({
  name: 'arduino',
  connection: { name: 'arduino', adaptor: 'firmata', port: '/dev/ttyACM0'  },
  device: {name: 'led', driver: 'led', pin: 13}
});

Cylon.api('http',{
  host: '0.0.0.0',
  port: '8080',
  ssl:  false
});


Cylon.start();
