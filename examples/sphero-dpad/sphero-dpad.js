var Cylon = require('cylon');

Cylon.robot({
  name: 'sphero-dpad',
  connection: { name: 'sphero', adaptor: 'sphero', port: '/dev/tty.Sphero-YBW-RN-SPP' },
  device: { name: 'sphero', driver: 'sphero' },
  r: 255,
  g: 255,
  b: 255,
  work: function(my) {
    my.sphero.setRGB(parseInt(this.currentColor()));
  },
  toHex: function (c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  },
  currentColor: function () {
    return "0x" + this.toHex(this.r) + this.toHex(this.g) + this.toHex(this.b);
  },

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

  changeColor: function(color) {
    switch (color) {
      case "red":
        this.r = 255;
        this.g = 0;
        this.b = 0;
        break;
      case "green":
        this.r = 0;
        this.g = 255;
        this.b = 0;
        break;
      case "blue":
        this.r = 0;
        this.g = 0;
        this.b = 255;
        break;
      case "white":
        this.r = 255;
        this.g = 255;
        this.b = 255;
        break;
    }

    var color = this.currentColor();
    this.sphero.setRGB(parseInt(color));
    return color;
  },

  commands: function() {
    return {
      move: this.move,
      change_color: this.changeColor
    };
  }
});


Cylon.api('http',{
  host: '0.0.0.0',
  port: '8080',
  ssl:  false
});

Cylon.start();
