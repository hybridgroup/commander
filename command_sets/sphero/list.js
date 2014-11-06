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
  red: 0,
  green: 0,
  blue: 0,

  increase: function(color) {
    if (color < 254) {
      color =+ 1
    }
    this.setRGB(red, green, blue);
  },
  decrease: function(color) {
    if (color > 0) {
      color =- 1
    }
    this.setRGB(red, green, blue);
  },
  commands: function() {
    return {
      increase_red: this.increase(this.red),
      decrease_red: this.decrease(this.red),
      increase_green: this.increase(this.green),
      decrease_green: this.decrease(this.green),
      increase_blue: this.increase(this.blue),
      decrease_blue: this.decrease(this.blue)
    };
  }
}).start();
