commander.directive('orientation', function($document,$timeout) {
  return function(scope, element, attr) {
    if(attr.commandSetOrientation && attr.commandSetOrientation !== 'any') {
      screen.lockOrientation(attr.commandSetOrientation);
    }
    else {
      screen.unlockOrientation();
    }
  };
});
