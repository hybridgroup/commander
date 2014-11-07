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
  name: 'sphero-dpad',
  connection: { name: 'sphero', adaptor: 'sphero', port: '/dev/tty.Sphero-YBW-RN-SPP' },
  device: { name: 'sphero', driver: 'sphero' },

  move: function(direction) {
    var my = this;

    switch (direction) {
      case "up":
        my.sphero.roll(100, 0);
        break;
      case "down":
        my.sphero.roll(100, 180);
        break;
      case "left":
        my.sphero.roll(100, 270);
        break;
      case "right":
        my.sphero.roll(100, 90);
    }

    setTimeout(function() {
      my.sphero.stop();
    }, 2000);

    return "ok";
  },
  commands: function() {
    return {
      move: this.move
    };
  }
}).start();
