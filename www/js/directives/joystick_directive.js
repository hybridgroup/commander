commander.directive('draggable', function($document) {
  return function(scope, element, attr) {
    var startX = 0, startY = 0, x = 0, y = 0, currentXpos = 0, currentYpos = 0, initXpos = 0, initYpos = 0, positionChanged=false;

    element.css({
     position: 'relative',
     cursor: 'pointer',
     display: 'block',
     top: y + 'px',
     left:  x + 'px'
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

    element.on('touchstart', function(event) {
      event.preventDefault();
      return false;
    });

    element.on('dragstart', function(event) {
      event.preventDefault();
      event.gesture.preventDefault();
      startX = event.gesture.center.pageX - x;
      startY = event.gesture.center.pageY - y;
      $document.bind('drag', move);
      $document.bind('dragend', release);
    });

    function move(event) {
      x = event.gesture.center.pageX - startX;
      y = event.gesture.center.pageY - startY;

      if(x < 15 && x > -15) {
        element.css({
          left:  x + 'px'
        });
      }
      if(y < 15 && y > -15) {
        element.css({
          top: y + 'px'
        });
      }

      element.css({
        'box-shadow': 'inset ' + x + 'px ' + y + 'px 8px rgba(10,10,10,0.3)'
      });
      
      if (x > 0) { currentXpos = 1;}
      else if (x < 0) { currentXpos = -1;}
      else { currentXpos = 0;}

      if (y > 0) { currentYpos = -1;}
      else if (y < 0) { currentYpos = 1;}
      else { currentYpos = 0;}

      if (initXpos!=currentXpos){
        initXpos = currentXpos;
        positionChanged = true;
      }

      if (initYpos!=currentYpos){
        initYpos = currentYpos;
        positionChanged = true;
      }

      if (positionChanged) {
        command = scope.commands[element.attr('data-command-index')];
        command.params.position = "" + initXpos + "," + initYpos;
        scope.execute(command);
        positionChanged = false;
      }
      
    }

    function release() {
      $document.unbind('drag', move);
      $document.unbind('dragend', release);
      x = 0;
      y = 0;
      startX = 0;
      startY = 0;
      initXpos = 0;
      initYpos = 0;

      command = scope.commands[element.attr('data-command-index')];
      command.params.position = "" + initXpos + "," + initYpos;
      scope.execute(command);
      positionChanged = false;

      element.css({
        top: y + 'px',
        left: x + 'px',
        'box-shadow': 'inset ' + x + 'px ' + y + 'px 8px rgba(10,10,10,0.3)'
      });
    }
  };
});
