commander.directive('button', function($document,$timeout) {
  return function(scope, element, attr) {


    $timeout(function(){
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

    element.on('touch', function(event) {
      var command = scope.buttons.filter(function(e,i){if ((e.name + i) == element.attr('command-name')){return e;}})[0];
      scope.execute(command, {action: 'press'});
      element.css({
        'box-shadow': '0 2px 2px rgba(255,255,255,0.25),inset 0 2px 2px rgba(0,0,0,0.5)'
      });
    });

    element.on('touchend', function(event) {
      var command = scope.buttons.filter(function(e,i){if ((e.name + i) == element.attr('command-name')){return e;}})[0];
      scope.execute(command, {action: 'release'});
      element.css({
        'box-shadow': '0 2px 2px rgba(255,255,255,0),inset 0 2px 2px rgba(0,0,0,0)'
      });
    });

  };
});
