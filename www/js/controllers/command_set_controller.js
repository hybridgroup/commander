commander.controller('CommandSetController', ['$scope', '$http', '$stateParams', '$location', function($scope, $http, $stateParams, $location) {
  $scope.configuration = JSON.parse(localStorage.commander);

  if ($stateParams && $stateParams.index){
    $scope.index = $stateParams.index;
    $scope.command_set = $scope.configuration.command_sets[$scope.index];
  }else{
    $scope.command_set = $scope.configuration.command_sets[$scope.configuration.current_command_set];
  }

  if(!$scope.command_set) {
    $location.path('/command_sets');
  }

  $scope.commands = $scope.command_set.commands;

  $scope.commandUrl = function(command) {
    var api = $scope.configuration.api;

    var buildCommandUrl = function(api, command) {
      var url = api;

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
      $scope.message = 'Result of ' + command.name + ': ' + data.result;
    }.bind(this));

    execution.catch(function(data){
      $scope.message = 'Error executing command: ' + command.name;
    }.bind(this));

    return true;
  };

  $scope.isValid = function(command) {
    if (command.name && command.label){
      return true;
    }else{
      return false;
    }
  };

  $scope.message = 'Ready...';
}]);
