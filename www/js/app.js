if(!localStorage.commander){
  localStorage.commander = JSON.stringify({
    api: {
      url:'http://localhost:3000',
      auth:'none',
      user: null,
      password: null,
      token: null,
      tokenHeader: null
    },
    command_sets: [],
    connections: [],
    current_command_set: null,
    current_connection: null,
    log: ''
  });
}
else {
  var configuration = JSON.parse(localStorage.commander);
  
  var newApi = configuration.api; 
  if (typeof configuration.api === "string") {
    var newApi = {
      url: configuration.api,
      auth:'none',
      user: null,
      password: null,
      token: null,
      tokenHeader: null
    }
  }

  var newConnections = [];
  angular.forEach(configuration.connections, function(connection, index){
    if (typeof connection === "string") {
      newConnections.push({
        url: connection,
        auth: 'none',
        user: null,
        password: null,
        token: null,
        tokenHeader: null
      });
    }
    else{
      newConnections.push(connection);
    }
  });
  localStorage.commander = JSON.stringify({
    api: newApi,
    command_sets: configuration.command_sets,
    connections: newConnections,
    current_command_set: configuration.current_command_set,
    current_connection: configuration.current_connection,
    log: configuration.log
  });
}


commander = angular.module('commander', ['ionic'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    $rootScope.appVersion = "0.4.0";
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

commander.controller('ContentController', ['$scope', '$rootScope', '$ionicSideMenuDelegate', '$ionicNavBarDelegate', '$location', function($scope, $rootScope, $ionicSideMenuDelegate, $ionicNavBarDelegate, $location) {
  $scope.toggleRight = function() {
    $ionicSideMenuDelegate.toggleRight();
  };
  $scope.myGoBack = function () {
    if($location.path().match(/command_sets\/\d*/)){
      $location.path('/command_sets');
    }
    else{
      $ionicNavBarDelegate.back();
    }
  };
  $rootScope.sockets = {};
  $rootScope.mqtts = {};
  $rootScope.editConnectionMode = false;
}]);
