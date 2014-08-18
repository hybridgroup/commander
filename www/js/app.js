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
  this.configuration = function() {
    return JSON.parse(localStorage.commander);
  };

  this.commandUrl = function(command) {
    var api = this.configuration().api;

    return api.host + ':' + api.port + '/api/robots/' + command.robot +
      '/devices/' + command.device + '/commands/' + command.name;
  };

  this.execute = function(index) {
    var command = this.configuration().commands[index];
    var execution = $http.post(this.commandUrl(command), command.params);

    execution.success(function(data){
      this.message = 'Result of ' + command.name + ': ' + data.result;
    }.bind(this));

    execution.catch(function(data){
      this.message = 'Error executing command: ' + command.name;
    }.bind(this));
  };

  this.message = 'Ready...';
  this.labels = this.configuration().commands.map(function(command) {
    if (command && command.label){
      return command.label;
    } else {
      return '';
    }
  });

}]);

app.controller('ConfigController', function() {
  this.configuration = JSON.parse(localStorage.commander);

  this.saveConfiguration = function() {
    localStorage.commander = JSON.stringify(this.configuration);
  };

  this.editAPI = function(host, port) {
    this.configuration.api = { host: host, port: port };
    this.saveConfiguration();
  };

  this.addCommand = function(index, command) {
    this.configuration.commands[index] = command;
    this.saveConfiguration();
  };

  this.removeCommand = function(index) {
    this.configuration.commands[index] = undefined;
    this.saveConfiguration();
  };

});
