commander.directive('joystick', function($document,$timeout) {
  return function(scope, element, attr) {
    var domJoysticks = [];
    var joystick_vars = [{startX: 0, startY: 0, x: 0, y: 0, currentXpos: 0, currentYpos: 0, initXpos: 0, initYpos: 0, positionChanged: false},{startX: 0, startY: 0, x: 0, y: 0, currentXpos: 0, currentYpos: 0, initXpos: 0, initYpos: 0, positionChanged: false}];
    var resetJoysticks = true;
    var joystickScale = 20;

    $timeout(function(){
      for(var i=0; i<scope.joysticks.length; i++){
        domJoysticks.push(angular.element(document.querySelector('#joystick'+i)));
      }
    });

    element.on('tap', function(event) {
      event.preventDefault();
      event.gesture.preventDefault();
      return false;
    });

    element.on('click', function(event) {
      event.preventDefault();
      return false;
    });

    element.on('transform drag touch', function(event) {
      if (event.target.id.match(/button/) == undefined ) {
        joystickIndex = parseInt(event.gesture.target.id.substring(8));
        var joystick = domJoysticks.filter(function(e){if (e[0].id == 'joystick'+joystickIndex){return e[0];}})[0];
        var touch;
        if (event.gesture.touches[0].target.id == 'joystick'+joystickIndex){
          touch = event.gesture.touches[0]
        }
        else {
          touch = event.gesture.touches[1]
        }
        if (resetJoysticks){
          joystick_vars[joystickIndex].startX = touch.pageX - joystick_vars[joystickIndex].x;
          joystick_vars[joystickIndex].startY = touch.pageY - joystick_vars[joystickIndex].y;
        }
        resetJoysticks = false;

        joystick_vars[joystickIndex].x = touch.pageX - joystick_vars[joystickIndex].startX;
        joystick_vars[joystickIndex].y = touch.pageY - joystick_vars[joystickIndex].startY;

        if(joystick_vars[joystickIndex].x <= joystickScale && joystick_vars[joystickIndex].x >= -(joystickScale)) {
          if (joystick_vars[joystickIndex].x > 0) { joystick_vars[joystickIndex].currentXpos = joystick_vars[joystickIndex].x/joystickScale;}
          else if (joystick_vars[joystickIndex].x < 0) { joystick_vars[joystickIndex].currentXpos = (joystick_vars[joystickIndex].x/joystickScale);}
          else { joystick_vars[joystickIndex].currentXpos = 0;}
          joystick.css({
            left:  joystick_vars[joystickIndex].x + 'px'
          });
        }
        if(joystick_vars[joystickIndex].y <= joystickScale && joystick_vars[joystickIndex].y >= -(joystickScale)) {
          if (joystick_vars[joystickIndex].y > 0) { joystick_vars[joystickIndex].currentYpos = -(joystick_vars[joystickIndex].y/joystickScale);}
          else if (joystick_vars[joystickIndex].y < 0) { joystick_vars[joystickIndex].currentYpos = -(joystick_vars[joystickIndex].y/joystickScale);}
          else { joystick_vars[joystickIndex].currentYpos = 0;}
          joystick.css({
            top: joystick_vars[joystickIndex].y + 'px'
          });
        }

        if (joystick_vars[joystickIndex].initXpos!=joystick_vars[joystickIndex].currentXpos){
          joystick_vars[joystickIndex].initXpos = joystick_vars[joystickIndex].currentXpos;
          joystick_vars[joystickIndex].positionChanged = true;
        }

        if (joystick_vars[joystickIndex].initYpos!=joystick_vars[joystickIndex].currentYpos){
          joystick_vars[joystickIndex].initYpos = joystick_vars[joystickIndex].currentYpos;
          joystick_vars[joystickIndex].positionChanged = true;
        }

        if (joystick_vars[joystickIndex].positionChanged) {
          command = scope.commands[joystick.attr('data-command-index')];
          position = {'x': joystick_vars[joystickIndex].initXpos,'y': joystick_vars[joystickIndex].initYpos};
          scope.execute(command, {position: position});
          joystick_vars[joystickIndex].positionChanged = false;
        }

        joystick.css({
          'box-shadow': (joystick_vars[joystickIndex].x / 2) + 'px ' + (joystick_vars[joystickIndex].y / 2) + 'px 10px #333'
        });
      }
    });

    element.on('touchstart', function(event) {
      if (event.target.id.match(/button/)) {
        var command = scope.commands.filter(function(e){if (e.name == element.attr('command-name')){return e;}})[0];
        scope.execute(command, {action: 'press'});
        element.css({
          'box-shadow': '0 2px 2px rgba(255,255,255,0.25),inset 0 2px 2px rgba(0,0,0,0.5)'
        });
      }
      else {
        event.preventDefault();
        return false;
      }
    });

    element.on('touchend', function(event) {
      if (event.target.id.match(/button/)) {
        var command = scope.commands.filter(function(e){if (e.name == element.attr('command-name')){return e;}})[0];
        scope.execute(command, {action: 'release'});
        element.css({
          'box-shadow': '0 2px 2px rgba(255,255,255,0),inset 0 2px 2px rgba(0,0,0,0)'
        });
      }
      else {
        event.preventDefault();
        return false;
      }
    });

    element.on('transformend', function(event) {
      if (event.target.id.match(/button/) == undefined ) {
        joystickIndex = parseInt(event.gesture.target.id.substring(8));
        // Switch index in order to reset the other joystick since the event is fired on the touch that is still pressed
        if (joystickIndex == 1) {
          joystickIndex = 0;
        }
        else {
          joystickIndex = 1;
        }
        var joystick = domJoysticks.filter(function(e){if (e[0].id == 'joystick'+joystickIndex){return e[0];}})[0];
        command = scope.commands[joystick.attr('data-command-index')];
        position = {'x':0,'y':0};
        scope.execute(command, {position: position});

        joystick.css({
          top: '0px',
          left: '0px',
          'box-shadow': '0px 0px 20px #333'
        });
        //}
        resetJoysticks = true;
        joystick_vars[joystickIndex] = {startX: 0, startY: 0, x: 0, y: 0, currentXpos: 0, currentYpos: 0, initXpos: 0, initYpos: 0, positionChanged: false};
      }
    });

    element.on('release', function(event) {
      if (event.target.id.match(/button/) == undefined ) {
        joystickIndex = parseInt(event.gesture.target.id.substring(8));
        var joystick = domJoysticks.filter(function(e){if (e[0].id == 'joystick'+joystickIndex){return e[0];}})[0];
        command = scope.commands[joystick.attr('data-command-index')];
        position = {'x':0,'y':0};
        scope.execute(command, {position: position});

        joystick.css({
          top: '0px',
          left: '0px',
          'box-shadow': '0px 0px 20px #333'
        });
        resetJoysticks = true;
        joystick_vars[joystickIndex] = {startX: 0, startY: 0, x: 0, y: 0, currentXpos: 0, currentYpos: 0, initXpos: 0, initYpos: 0, positionChanged: false};
      }
    });
  };
});
