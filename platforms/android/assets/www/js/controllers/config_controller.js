commander.controller('ConfigController', function($scope, $http) {
  $scope.command = {};

  $scope.configuration = JSON.parse(localStorage.commander);
  $scope.commands = $scope.configuration.commands;

  $scope.saveConfiguration = function() {
    localStorage.commander = JSON.stringify($scope.configuration);
  };

  $scope.editAPI = function(host, port) {
    $scope.configuration.api = { host: host, port: port };
    $scope.saveConfiguration();
  };

  $scope.addCommand = function(command) {
    new_command_params = {
      label: command.label,
      robot: command.robot,
      device: command.device,
      name: command.name,
      params: command.params
    }

    $scope.configuration.commands.push(new_command_params);
    $scope.saveConfiguration();
  };

  $scope.removeCommand = function(command) {
    var index = $scope.configuration.commands.indexOf(command);
    if (index > -1) {
      $scope.configuration.commands.splice(index, 1);
    }

    $scope.saveConfiguration();
  };

});