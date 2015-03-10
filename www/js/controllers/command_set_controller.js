commander.controller('CommandSetController', ['$scope', '$rootScope', '$http', '$stateParams', '$location', 'activityLogger', 'LocalStorageService', '$ionicPopup', function($scope, $rootScope, $http, $stateParams, $location, activityLogger, LocalStorageService, $ionicPopup) {
  $scope.configuration = JSON.parse(localStorage.commander);
  $scope.activityLog = activityLogger;
  $scope.popupVisible = false;

  // Used for http connections
  $rootScope.urls = {};

  if ($stateParams && $stateParams.index){
    $scope.index = $stateParams.index;
    $scope.command_set = $scope.configuration.command_sets[$scope.index];
  }else{
    $scope.command_set = $scope.configuration.command_sets[$scope.configuration.current_command_set];
  }

  $scope.activityLog.hideConnectionIndicator();

  $scope.initCommandSet = function(){
    $scope.commands = $scope.command_set.commands;
    if ($scope.command_set.protocol && $scope.command_set.protocol === 'socketio'){
      angular.forEach($scope.commands, function(command, index){
        
        var socketUrl = "";
        var socketName = "";
        if(command.device){
          socketName = command.robot + '/' + command.device;
          socketUrl = '/api/robots/' + command.robot + '/devices/' + command.device;
        }
        else {
          socketName = command.robot;
          socketUrl = '/api/robots/' + command.robot;
        }

        if(!$rootScope.sockets[socketName]){
          $scope.activityLog.showConnectionIndicator();
          $rootScope.sockets[socketName] = io($scope.configuration.api + socketUrl, {multiplex:false}).connect();

          $rootScope.sockets[socketName].on('connect', function(obj) {
            $scope.$apply(function(){
              $scope.activityLog.hideConnectionIndicator();
              $scope.activityLog.saveLog('socketio', 'Socket Connected: ' + $rootScope.sockets[socketName].nsp);  
            });
          });
          $rootScope.sockets[socketName].on('reconnect_error', function(obj) {
            $scope.$apply(function(){
              $scope.activityLog.showConnectionIndicator();
              $scope.activityLog.saveLog(false, 'Connection Error:' + $rootScope.sockets[socketName].nsp);  
            });
          });
        }
      });
    }
    else {
      angular.forEach($scope.commands, function(command, index){

        var commandUrl = "";
        var commandName = "";
        if(command.device){
          commandName = command.robot + '/' + command.device + '/' + command.name;
          commandUrl = '/api/robots/' + command.robot + '/devices/' + command.device + '/commands/' + command.name;
        }
        else if(command.robot){ 
          commandName = command.robot + '/' + command.name;
          commandUrl = '/api/robots/' + command.robot + '/commands/' + command.name;
        }
        else { 
          commandName = command.name;
          commandUrl = '/api/commands/' + command.name;
        }

        if(!$rootScope.urls[commandName]){
          $rootScope.urls[commandName] = commandUrl;
        }
      });
    }

    if ($scope.command_set.type == 'joystick') {
      $scope.joysticks = $scope.commands.filter(function(el){
        return el.type == 'stick';
      })
      $scope.buttons = $scope.commands.filter(function(el){
        return el.type == 'button';
      })
    }

    if ($scope.command_set.type == 'd-pad') {
      $scope.buttons = $scope.commands;
    }
  }
  else {
    if($location.path()!='/log'){
      $scope.initCommandSet();
    }  
  }

  $scope.commandUrl = function(command) {
    if(command.device){
      return $scope.configuration.api + $rootScope.urls[command.robot + '/' + command.device + '/' + command.name];
    }
    else if(command.robot){
      return $scope.configuration.api + $rootScope.urls[command.robot + '/' + command.name];
    }
    else {
      return $scope.configuration.api + $rootScope.urls[command.name];
    }
  };
  
  $scope.execute = function(command, params) {

    if(params) {
      angular.extend(command.params, params)
    }

    if ($scope.command_set.protocol && $scope.command_set.protocol === 'socketio'){
      if(command.device){
        $rootScope.sockets[command.robot + '/' + command.device].emit(command.name, command.params);  
      }
      else {
        $rootScope.sockets[command.robot].emit(command.name, command.params);
      }
      $scope.activityLog.saveLog('socketio', 'Command ' + command.name + ' sent.');
    }
    else {
      if ($scope.configuration.api.match(/localhost/)) {
        if ($scope.popupVisible == false) {
          $scope.popupVisible = true;
          $ionicPopup.alert({
            title: "API URL",
            template: "The API URL is not set. Please enter a valid API URL by choosing 'Connection' on the 'Settings' menu."
          }).then(function(res) {
            $scope.popupVisible = false;
            $location.path("/connection");
          });
        }
        return false;
      }

      $scope.activityLog.showConnectionIndicator();
      $http.post($scope.commandUrl(command), command.params)
        .success(function(data, status, headers, config){
          $scope.logActivity(true, command, data);
        })
        .error(function(data, status, headers, config){
          $scope.logActivity(false, command, data);
        });
    }

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
