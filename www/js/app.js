if(!localStorage.commander){
  localStorage.commander = JSON.stringify({
    api: 'http://localhost:3000',
    command_sets: [],
    connections: [],
    current_command_set: null,
    current_connection: null,
    log: ''
  });
}

// Making sure api is a string, not an object as before
(function() {
  var storage = JSON.parse(localStorage.commander);
  var api = storage.api
  if(api.host){
    storage.api = api.host + ':' + api.port;
    localStorage.commander = JSON.stringify(storage);
  }
})();

commander = angular.module('commander', ['ionic'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    $rootScope.appVersion = "0.1.0";
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.navigator && window.navigator.splashscreen) {
      window.navigator.splashscreen.hide();
    }
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.cordova){
      cordova.getAppVersion(function(version) {
        $rootScope.appVersion = version;
      });
    }
    if(window.StatusBar) {
      StatusBar.hide();
    }
  });

  ionic.Platform.fullScreen(true, false);
});

commander.controller('ContentController', ['$scope', '$rootScope', '$ionicSideMenuDelegate', function($scope, $rootScope, $ionicSideMenuDelegate) {
  $scope.toggleRight = function() {
    $ionicSideMenuDelegate.toggleRight();
  };
  $rootScope.sockets = {};
}]);
