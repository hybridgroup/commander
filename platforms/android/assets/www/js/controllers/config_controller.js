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

  $scope.addCommand = function() {
    new_command_params = {
      label: $scope.command.label,
      robot: $scope.command.robot,
      device: $scope.command.device,
      name: $scope.command.name,
      params: $scope.command.params
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