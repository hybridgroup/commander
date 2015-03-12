var Cylon = require('cylon');

Cylon.robot({
  name: 'joystick',
  commands: function() {
    return {
      button_event: function(name, action) {
        console.log(name + ": " + action);
      },
      joystick_event: function(name, position) {
        if (position ) {
          console.log(name + ": " + position.x + "," + position.y);
        }
      }
    };
  }
});

Cylon.api('http', {
  host: '0.0.0.0',
  port: '8080',
  ssl:  false
});

Cylon.start();
