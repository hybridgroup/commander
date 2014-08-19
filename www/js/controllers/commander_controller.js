commander.controller('CommanderController', ['$scope', '$http', function($scope, $http) {
  $scope.configuration = JSON.parse(localStorage.commander);

  $scope.commands = $scope.configuration.commands;

  $scope.commandUrl = function(command) {
    var api = $scope.configuration.api;

    return api.host + ':' + api.port + '/api/robots/' + command.robot +
      '/devices/' + command.device + '/commands/' + command.name;
  };

  $scope.execute = function(command) {
    var execution = $http.post($scope.commandUrl(command), command.params);

    execution.success(function(data){
      $scope.message = 'Result of ' + command.name + ': ' + data.result;
    }.bind(this));

    execution.catch(function(data){
      $scope.message = 'Error executing command: ' + command.name;
    }.bind(this));
  };

  $scope.message = 'Ready...';
}]);
