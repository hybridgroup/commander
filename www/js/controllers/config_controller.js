commander.controller('ConfigController', [ '$scope', '$stateParams', function($scope, $stateParams) {
  $scope.params = $stateParams;
  $scope.configuration = JSON.parse(localStorage.commander);
  $scope.commands = $scope.configuration.commands;

  if ($stateParams && $stateParams.index){
    $scope.index = $stateParams.index;
    $scope.command = $scope.commands[$scope.index];
  }else{
    $scope.command = {};
  }

  $scope.saveConfiguration = function() {
    localStorage.commander = JSON.stringify($scope.configuration);
  };

  $scope.editAPI = function(host, port) {
    $scope.configuration.api = { host: host, port: port };
    $scope.saveConfiguration();
  };

  $scope.saveCommand = function(command, index) {
    if(index != undefined){
       $scope.configuration.commands[index] = command;
    }else{
      $scope.configuration.commands.push(command);
    }

    $scope.saveConfiguration();
  };

  $scope.removeCommand = function(command) {
    var index = $scope.configuration.commands.indexOf(command);
    if (index > -1) {
      $scope.configuration.commands.splice(index, 1);
    }

    $scope.saveConfiguration();
  };

}]);
