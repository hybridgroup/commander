commander.controller('CommandSetController', ['$scope', '$http', '$stateParams', '$location', 'activityLogger', 'LocalStorageService', '$ionicPopup', function($scope, $http, $stateParams, $location, activityLogger, LocalStorageService, $ionicPopup) {
  $scope.configuration = JSON.parse(localStorage.commander);
  $scope.activityLog = activityLogger;
  $scope.popupVisible = false;

  if ($stateParams && $stateParams.index){
    $scope.index = $stateParams.index;
    $scope.command_set = $scope.configuration.command_sets[$scope.index];
  }else{
    $scope.command_set = $scope.configuration.command_sets[$scope.configuration.current_command_set];
  }

  if(!$scope.command_set) {
    $location.path('/command_sets');
  }
  else {
    $scope.commands = $scope.command_set.commands;
    
    if ($scope.command_set.type == 'joystick') {
      $scope.joysticks = $scope.commands.filter(function(el){
        return el.type == 'stick';
      })
      $scope.joysticksButtons = $scope.commands.filter(function(el){
        return el.type == 'button';
      })
    }
  }

  $scope.commandUrl = function(command) {
    var api = $scope.configuration.api;

    var buildCommandUrl = function(api, command) {
      var url = api;

      url += '/api';

      if (command.robot) { url += '/robots/' + command.robot; }
      if (command.device) { url += '/devices/' + command.device; }

      url += '/commands/' + command.name;

      return url;
    }
    return buildCommandUrl(api, command);
  };

  $scope.execute = function(command, params) {

    if ($scope.configuration.api.match(/localhost/)) {
      if ($scope.popupVisible == false) {
        $scope.popupVisible = true;
        $ionicPopup.alert({
          title: "Invalid API URL",
          template: "Please check the API URL by choosing 'Connection' on the 'Settings' menu"
        }).then(function(res) {
          $scope.popupVisible = false;
        });
      }
      return false;
    }

    if(params) {
      angular.extend(command.params, params)
    }

    $scope.activityLog.showConnectionIndicator();

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
    $scope.activityLog.hideConnectionIndicator();
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
