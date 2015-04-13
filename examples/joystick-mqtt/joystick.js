var Cylon = require('cylon');

Cylon.robot({
  name: 'joystick',  
  commands: function() {
    return {
      button_event: function(name, action) {
        console.log(name + ':' + action);
      },
      joystick_event: function(name, position) {
        console.log(name + ": " + position.x + "," + position.y);
      }
    };
  }
})

Cylon.api(
  'mqtt',
  {
  broker: 'mqtt://127.0.0.1:1883',
  port: '3001'
});

Cylon.start();
