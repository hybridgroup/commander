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
  name: 'joystick',
  commands: function() {
    return {
      button_event: function(name, action) {
        console.log(name + ": " + action);
      },
      joystick_event: function(name, position) {
        console.log(name + ": " + position)
      }
    };
  }
}).start();
