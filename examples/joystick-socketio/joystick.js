var Cylon = require('cylon');

Cylon.robot({
  name: 'joystick',  
  commands: function() {
    return {
      button_event: function(params) {
        console.log(params.name + ':' + params.action);
      },
      joystick_event: function(params) {
        console.log(params.name + ": " + params.position.x + "," + params.position.y);
      }
    };
  }
})

Cylon.api(
  'socketio',
  {
  host: '0.0.0.0',
  port: '8080'
});

Cylon.start();
