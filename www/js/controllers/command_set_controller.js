commander.controller('CommandSetController', ['$scope', '$http', '$stateParams', '$location', 'activityLogger', 'LocalStorageService', function($scope, $http, $stateParams, $location, activityLogger, LocalStorageService) {
  $scope.configuration = JSON.parse(localStorage.commander);
  $scope.activityLog = activityLogger;

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

    $http.post($scope.commandUrl(command), command.params)
    .success(function(data){
      $scope.logActivity(true, command, data);
    })
    .error(function(data){
      $scope.logActivity(false, command, data);
    });

    return true;
  };

  $scope.isValid = function(command) {
    if (command.name && command.label){
      return true;
    }else{
      return false;
    }
  };

  $scope.logActivity = function(success, command, data) {
    if (success){
      $scope.message = 'Result of ' + command.name + ': ' + data.result;
    }
    else {
      $scope.message = 'Error executing command: ' + command.name;
    }
    $scope.activityLog.saveLog(success, $scope.message);
  };

  $scope.showActivityLogIndicator = function(){
    currentCommandSet = LocalStorageService.get('current_command_set');
    return $location.path() == "/command_sets/" + currentCommandSet;
  };

  $scope.message = 'Ready...';
}]);
