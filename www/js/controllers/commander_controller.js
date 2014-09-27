commander.controller('CommanderController', ['$scope', '$http', 'Connection', function($scope, $http, Connection) {
  $scope.connection = Connection;
  $scope.configuration = JSON.parse(localStorage.commander);

  $scope.commands = $scope.configuration.commands;

  $scope.commandUrl = function(command) {
    var api = $scope.configuration.api;

    var buildCommandUrl = function(api, command) {
      var url = api.host + ':' + api.port + '/api'

      if (command.robot) { url += '/robots/' + command.robot; }
      if (command.device) { url += '/devices/' + command.device; }

      url += '/commands/' + command.name;

      return url;
    }
    return buildCommandUrl(api, command);
  };

  $scope.execute = function(command) {
    var execution = $http.post($scope.commandUrl(command), command.params);

    execution.success(function(data){
      $scope.connection.success = true;
    }.bind(this));

    execution.catch(function(data){
      $scope.connection.success = false;
    }.bind(this));
  };

  $scope.isValid = function(command) {
    if (command.name && command.label){
      return true;
    }else{
      return false;
    }
  };
}]);
