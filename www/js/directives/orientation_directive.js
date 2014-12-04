commander.directive('orientation', function($document,$timeout) {
  return function(scope, element, attr) {
    if(element.attr('data-force-landscape')) {
      screen.lockOrientation('landscape');
    }
    else {
      screen.unlockOrientation();
    }
  };
});
