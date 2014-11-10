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
  name: 'sphero-list',
  connection: { name: 'sphero', adaptor: 'sphero', port: '/dev/tty.Sphero-YBW-RN-SPP' },
  device: { name: 'sphero', driver: 'sphero' },
  r: 122,
  g: 122,
  b: 122,
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

  addColor: function(color, delta) {
    switch (color) {
      case "red":
        var newColor = this.r + delta;
        if (newColor>0 && newColor<255) this.r = newColor;
        break;
      case "green":
        var newColor = this.g + delta;
        if (newColor>0 && newColor<255) this.g = newColor;
        break;
      case "blue":
        var newColor = this.b + delta;
        if (newColor>0 && newColor<255) this.b = newColor;
    }

    var color = this.currentColor();
    this.sphero.setRGB(parseInt(color));
    return color;
  },
  increase_red: function() {
    this.addColor("red", 10);
  },
  increase_green: function() {
    this.addColor("green", 10);
  },
  increase_blue: function() {
    this.addColor("blue", 10);
  },
  decrease_red: function() {
    this.addColor("red", -10);
  },
  decrease_green: function() {
    this.addColor("green", -10);
  },
  decrease_blue: function() {
    this.addColor("blue", -10);
  },
  commands: function() {
    return {
      increase_red: this.increase_red,
      decrease_red: this.decrease_red,
      increase_green: this.increase_green,
      decrease_green: this.decrease_green,
      increase_blue: this.increase_blue,
      decrease_blue: this.decrease_blue
    };
  }
}).start();
