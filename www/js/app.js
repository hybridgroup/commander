if(!localStorage.commander){
  localStorage.commander = JSON.stringify({
    api: {
      host: 'http://localhost',
      port: '8080'
    },
    remote_address: {
      url: 'http://localhost:8080'
    },
    commands: [{
      label: 'Say hello',
      robot: 'pebble',
      device: 'pebble',
      name: 'sendNotification',
      params: {message: 'Hello'}
    }]
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

commander.controller('ContentController', ['$scope', '$ionicSideMenuDelegate', 'Connection', function($scope, $ionicSideMenuDelegate, Connection) {
  $scope.connection = Connection;

  $scope.toggleRight = function() {
    $ionicSideMenuDelegate.toggleRight();
  };
}]);
