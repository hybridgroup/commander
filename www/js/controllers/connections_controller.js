commander.controller('ConnectionsController', [ '$scope', '$rootScope', '$http', 'LocalStorageService', '$location', 'activityLogger', '$ionicPopup', '$ionicListDelegate', 'base64Service', function($scope, $rootScope, $http, LocalStorageService, $location, activityLogger, $ionicPopup, $ionicListDelegate, base64Service) {
  $rootScope.editConnectionMode = false;
  $scope.connectionForm = {url:'',auth:'none',user: null,password: null,token: null,tokenHeader: null};
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
      LocalStorageService.set('api', $scope.connections[0]);
    }
    else if (currentConnection == localSets.length) {
      LocalStorageService.set('current_connection', currentConnection - 1)
      $scope.currentConnection = currentConnection - 1;
      LocalStorageService.set('api', $scope.connections[currentConnection - 1]);
    }
    $ionicListDelegate.closeOptionButtons();
  }

  $scope.editConnection = function(connectionIndex){
    $scope.connectionForm = $scope.connections[connectionIndex];
    $rootScope.editConnectionMode = true;
    $scope.editIndex = connectionIndex;
  }

  $scope.cancelEditConnection = function(){
    $scope.connectionForm = {url:'',auth:'none',user: null,password: null,token: null,tokenHeader: null};
    $rootScope.editConnectionMode = false;
    $scope.editIndex = null;
  }

  $scope.saveConnection = function(connectionForm, connectionIndex) {
    if (!connectionForm.url) {
      $ionicPopup.alert({
        title: 'Error',
        template: 'Please specify a valid URL'
      });
      return;
    }

    var newConnection = {
      url: connectionForm.url,
      auth: connectionForm.auth,
      user: null,
      password: null,
      token: null,
      tokenHeader: null
    }

    if (connectionForm.auth == 'basic'){
      if(!connectionForm.user || !connectionForm.password){
        $ionicPopup.alert({
          title: 'Error',
          template: 'Please specify a valid user and password'
        });
        return;
      }
      var token = connectionForm.user + ':' + connectionForm.password;
      newConnection.token = base64Service.encode(token);
      newConnection.tokenHeader = 'Basic ' + newConnection.token;
      newConnection.user = connectionForm.user;
      newConnection.password = connectionForm.password;
    }

    if (connectionForm.auth == 'oauth2'){
      if(!connectionForm.token){
        $ionicPopup.alert({
          title: 'Error',
          template: 'Please specify a valid access token'
        });
        return;
      }
      newConnection.token = connectionForm.token;
      newConnection.tokenHeader = 'Bearer ' + newConnection.token;
    }

    var localSets = LocalStorageService.connections();
    // Add new connection or update an existing one
    var indexToUpdate = null;
    var templateMessage = null;

    if(connectionIndex == null) {
      localSets.push(newConnection);
      templateMessage = "added";
    } else {
      localSets[connectionIndex] = newConnection;
      templateMessage = "updated";
    }

    LocalStorageService.set('connections', localSets);

    $scope.connectionForm = {url:'',auth:'none',user:'',password:'',token:''}
    $rootScope.editConnectionMode = false;
    $scope.editIndex = null;

    $ionicPopup.alert({
      title: "Success",
      template: '<b>' + newConnection.url + '</b> connection was successfuly ' + templateMessage + '.'
    });
  }

}]);
