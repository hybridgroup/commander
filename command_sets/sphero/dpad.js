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

  move: function(direction) {
    switch (direction) {
      case "up":
        this.roll(100, 0);
        break;
      case "down":
        this.roll(100, 180);
        break;
      case "left":
        this.roll(100, 270);
        break;
      case "right":
        this.roll(100, 90);
    }

    setTimeout(function() {
      this.stop();
    }, 2000);

    return "ok";
  },
  commands: function() {
    return {
      move: this.move
    };
  }
}).start();
