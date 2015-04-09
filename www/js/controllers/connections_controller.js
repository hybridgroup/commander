commander.controller('ConnectionsController', [ '$scope', '$rootScope', '$http', 'LocalStorageService', '$location', 'activityLogger', '$ionicPopup', '$ionicListDelegate', function($scope, $rootScope, $http, LocalStorageService, $location, activityLogger, $ionicPopup, $ionicListDelegate) {

  // Local connections
  $scope.$on(LocalStorageService.Event.updated, function(event, data){
    updateLocalConnectionsView();
  });

  var updateLocalConnectionsView = function() {
    $scope.connections = LocalStorageService.connections();
  }

  updateLocalConnectionsView()

  $scope.closeOpenSockets = function(){
    var localSets = LocalStorageService.commandSets();
    var currentCommandSet = LocalStorageService.get('current_command_set')
    var command_set = localSets[currentCommandSet];

    if ($rootScope.sockets && command_set && command_set.protocol && command_set.protocol === 'socketio'){
      angular.forEach(command_set.commands, function(command, index){
        if(command.device && $rootScope.sockets[command.robot + '/' + command.device]){
          $rootScope.sockets[command.robot + '/' + command.device].disconnect();
          $rootScope.sockets[command.robot + '/' + command.device] = null;
        }
        else if($rootScope.sockets[command.robot]){
          $rootScope.sockets[command.robot].disconnect();
          $rootScope.sockets[command.robot] = null;
        }
      });
      $rootScope.sockets = {};
    }
    if ($rootScope.mqtts && command_set && command_set.protocol && command_set.protocol === 'mqtt'){
      angular.forEach(command_set.commands, function(command, index){
        if(command.device && $rootScope.mqtts[command.robot + '/' + command.device]){
          $rootScope.mqtts[command.robot + '/' + command.device].end();
          $rootScope.mqtts[command.robot + '/' + command.device] = null;
        }
        else if($rootScope.mqtts[command.robot]){
          $rootScope.mqtts[command.robot].end();
          $rootScope.mqtts[command.robot] = null;
        }
      });
      $rootScope.mqtts = {}; 
    }
  }

  $scope.useConnection = function(connectionIndex) {
    $scope.closeOpenSockets();

    if (!isCurrent(connectionIndex)){
      activityLogger.clear();
    }
    LocalStorageService.set('current_connection', connectionIndex);
    $scope.currentConnection = connectionIndex;
    LocalStorageService.set('api', $scope.connections[connectionIndex]);
    $location.path('/command_sets/current');
  }

  $scope.removeConnection = function(connectionIndex) {
    var localSets = LocalStorageService.connections();
    var currentConnection = LocalStorageService.get('current_connection')

    localSets.splice(connectionIndex, 1);
    LocalStorageService.set('connections', localSets);

    if (isCurrent(connectionIndex) ) {
      LocalStorageService.set('current_connection', 0)
      $scope.currentConnection = 0;
    }
    else if (currentConnection == localSets.length) {
      LocalStorageService.set('current_connection', currentConnection - 1)
      $scope.currentConnection = currentConnection - 1;
    }
    $ionicListDelegate.closeOptionButtons();
  }

  // Presentation-related
  $scope.getClass = function(connectionIndex) {
    return  isCurrent(connectionIndex) ? "button-stable" : "button-balanced";
  }

  $scope.getTitle = function(connectionIndex) {
    return isCurrent(connectionIndex) ? "Current" : "Use";
  }

  var isCurrent = function(connectionIndex) {
    currentConnection = LocalStorageService.get('current_connection')
    return currentConnection == connectionIndex;
  }

  $scope.saveConnection = function(connectionIndex, newUrl){
    if (!newUrl) {
      $ionicPopup.alert({
        title: 'Error',
        template: 'Please specify a valid URL'
      });
      return false;
    }
    $scope.connections[connectionIndex] = newUrl;
    LocalStorageService.set('connections', $scope.connections);
    return true;
  }

  $scope.addConnection = function(apiUrl) {
    if (!apiUrl) {
      $ionicPopup.alert({
        title: 'Error',
        template: 'Please specify a valid URL'
      });
      return;
    }

    var localSets = LocalStorageService.connections();

    // Add new connection or update an existing one
    var indexToUpdate = null;
    var templateMessage = null;

    for(i = 0; i < localSets.length; i++){
      if(localSets[i].name == apiUrl) {
        indexToUpdate = i;
      }
    }

    if(indexToUpdate == null) {
      localSets.push(apiUrl);
      templateMessage = "added";
    } else {
      localSets[indexToUpdate] = apiUrl;
      templateMessage = "updated";
    }

    LocalStorageService.set('connections', localSets);

    $ionicPopup.alert({
      title: "Success",
      template: '<b>' + apiUrl + '</b> connection was successfuly ' + templateMessage + '.'
    });
  }

}]);
