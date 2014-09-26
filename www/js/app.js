if(!localStorage.commander){
  localStorage.commander = JSON.stringify({
    api: "http://localhost:3000",
    command_sets: [
      {
        name: "Pebble",
        commands: [
          {
            label: 'Say hello',
            robot: 'pebble',
            device: 'pebble',
            name: 'sendNotification',
            params: "{message: 'Hello'}"
          },
          {
            label: 'Say bye',
            robot: 'pebble',
            device: 'pebble',
            name: 'sendNotification',
            params: "{message: 'Bye'}"
          }
        ],
        type: "list"
      },
      {
        name: "AR-Drone",
        commands: [
          {
            label: 'Say hello',
            robot: 'pebble',
            device: 'pebble',
            name: 'sendNotification',
            params: "{message: 'Hello'}"
          },
          {
            label: 'Say bye',
            robot: 'pebble',
            device: 'pebble',
            name: 'sendNotification',
            params: "{message: 'Bye'}"
          }
        ],
        type: "d-pad"
      }
    ],
    log: "blah..."
  });
}


commander = angular.module('commander', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.hide();
    }
  });

  ionic.Platform.fullScreen(true, false);
});

commander.controller('ContentController', ['$scope', '$ionicSideMenuDelegate', function($scope, $ionicSideMenuDelegate) {
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleRight();
  };
}]);
