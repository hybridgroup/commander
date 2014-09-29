if(!localStorage.commander){
  localStorage.commander = JSON.stringify({
    api: 'http://localhost:3000',
    command_sets: [],
    current_command_set: null,
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
