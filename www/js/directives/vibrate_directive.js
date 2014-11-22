commander.directive('vibrate', function($document,$timeout) {
  return function(scope, element, attr) {
    element.on('touchstart', function(event) {
      if (device.platform !== 'iOS') {navigator.notification.vibrate(50);}
    });
  };
});
