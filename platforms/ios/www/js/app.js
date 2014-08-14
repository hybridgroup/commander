localStorage.commander = JSON.stringify({
  robot: {
    host: 'http://localhost:8080',
    name: 'pebble',
    device: 'pebble',
    commands: {
      up: '',
      center: 'pending_message',
      down: '',
      left: '',
      right: '',
      one: '',
      two: '',
      three: ''
    }
  }
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

  this.robot = function() {
    return JSON.parse(localStorage.commander).robot;
  };

  this.commandUrl = function(buttonName) {
    var robot = this.robot();
    return robot.host + '/api/robots/' + robot.name + '/devices/' +
      robot.device + '/commands/' + robot.commands[buttonName];
  };

  this.execute = function(buttonName) {
    command = this.robot().commands[buttonName];

    if ( command === '') {
      this.message = 'Command is not defined';
    } else {
      this.message = 'Executting command: ' + command;

      var execution = $http.post(this.commandUrl(buttonName));

      execution.success(function(data){
        this.message = 'Result: ' + data.result;
      }.bind(this));

      execution.catch(function(data){
        this.message = 'Error executing command: ' + command;
      }.bind(this));
    }
  };
}]);
