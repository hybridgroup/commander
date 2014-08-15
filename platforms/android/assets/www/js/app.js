localStorage.commander = JSON.stringify({
  api: {
    host: 'http://localhost',
    port: '8080'
  },
  commands: [{
    label: 'Say hello',
    robot: 'pebble',
    device: 'pebble',
    name: 'sendNotification',
    params: {message: 'Hello'}
  }]
});

app = angular.module('commander', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.controller('CommanderController', ['$http', function($http) {
  this.message = 'Ready...';

  this.commands = function() {
    return JSON.parse(localStorage.commander).commands;
  };

  this.commandUrl = function(command) {
    var api = JSON.parse(localStorage.commander).api;

    return api.host + ':' + api.port + '/api/robots/' + command.robot +
      '/devices/' + command.device + '/commands/' + command.name;
  };

  this.execute = function(index) {
    var command = this.commands()[index];
    var execution = $http.post(this.commandUrl(command), command.params);

    execution.success(function(data){
      this.message = 'Result of ' + command.name + ': ' + data.result;
    }.bind(this));

    execution.catch(function(data){
      this.message = 'Error executing command: ' + command.name;
    }.bind(this));
  };
}]);
