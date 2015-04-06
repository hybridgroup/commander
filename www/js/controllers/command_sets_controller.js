commander.controller('CommandSetsController', ['$scope', '$rootScope', '$http', 'LocalStorageService', '$ionicNavBarDelegate', '$ionicPopup', '$ionicLoading', '$ionicListDelegate', '$location', 'activityLogger', function($scope, $rootScope, $http, LocalStorageService, $ionicNavBarDelegate, $ionicPopup, $ionicLoading, $ionicListDelegate, $location, activityLogger) {
  // Local command sets
  $scope.$on(LocalStorageService.Event.updated, function(event, data){
    updateLocalCommandsView();
  });

  $scope.editMode = 'json';

  var updateLocalCommandsView = function() {
    $scope.commandSets = LocalStorageService.commandSets();
    $scope.currentConnection = LocalStorageService.api();
    $scope.connections = LocalStorageService.connections();
  }

  updateLocalCommandsView()

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
  }

  $scope.useCommandSet = function(commandSetIndex) {
    $scope.closeOpenSockets();

    if (!isCurrent(commandSetIndex)){
      activityLogger.clear();
    }
    LocalStorageService.set('current_command_set', commandSetIndex)
    $scope.currentCommandSet = commandSetIndex;
    $location.path('/command_sets/' + commandSetIndex);
  }

  $scope.removeCommandSet = function(commandSetIndex) {
    $scope.closeOpenSockets();

    var localSets = LocalStorageService.commandSets();
    var currentCommandSet = LocalStorageService.get('current_command_set')

    localSets.splice(commandSetIndex, 1);
    LocalStorageService.set('command_sets', localSets);

    if (isCurrent(commandSetIndex) ) {
      LocalStorageService.set('current_command_set', 0)
      $scope.currentCommandSet = 0;
    }
    else if (currentCommandSet == localSets.length) {
      LocalStorageService.set('current_command_set', currentCommandSet - 1)
      $scope.currentCommandSet = currentCommandSet - 1;
    }
    $ionicListDelegate.closeOptionButtons();
  }

  // Presentation-related
  $scope.showFromJson = function(){
    if($scope.editMode === 'json'){
      $scope.editMode = 'connection';
    }
    else{
      $scope.editMode = 'json';
    }
  }
  $scope.showFromConnection = function(){
    if($scope.editMode === 'connection'){
      $scope.editMode = 'json';
    }
    else{
      $scope.editMode = 'connection';
    }
  }

  $scope.getClass = function(commandSetIndex) {
    return  isCurrent(commandSetIndex) ? "button-stable" : "button-balanced";
  }

  $scope.getTitle = function(commandSetIndex) {
    return isCurrent(commandSetIndex) ? "Current" : "Use";
  }

  var isCurrent = function(commandSetIndex) {
    currentCommandSet = LocalStorageService.get('current_command_set')
    return currentCommandSet == commandSetIndex;
  }

  $scope.showLoadingSpinner = function() {
    $ionicLoading.show({
      template: "<i class='ion-loading-c'></i>"
    });
  };
  $scope.hideLoadingSpinner = function(){
    $ionicLoading.hide();
  };

  $scope.buildCommandSet = function(robot){
    var commands = [];
    angular.forEach(robot.commands, function(command, index){
      commands.push({
        label: command,
        robot: robot.name,
        device: '',
        name: command,
        params:{}
      });
    });
    var command_set = {
      type: 'list',
      protocol: robot.protocol || 'http',
      name: robot.name + ' Commands',
      commands: commands
    }
    return command_set;
  }

  $scope.saveCommandSet = function(remoteSet){
    if (!remoteSet) {
      $ionicPopup.alert({
        title: "JSON Error",
        template: 'Wrong JSON structure, you must wrap the command set definition in a "command_set" object.'
      });
      $scope.hideLoadingSpinner();
      return;
    }

    if (!remoteSet.name) {
      $ionicPopup.alert({
        title: "Command set definition error",
        template: 'The command set must have a name.'
      });
      $scope.hideLoader();
      return;
    }

    if (remoteSet.type != 'list' && remoteSet.type != 'd-pad' && remoteSet.type != 'joystick')  {
      $ionicPopup.alert({
        title: "Command set definition error",
        template: 'The command set must have a type (value must be either <b>list</b> or <b>d-pad</b>).'
      });
      $scope.hideLoadingSpinner();
      return;
    }

    if (!remoteSet.commands || !remoteSet.commands instanceof Array || remoteSet.commands.length == 0)  {
      $ionicPopup.alert({
        title: "Command set definition error",
        template: 'Please define at least one command.'
      });
      $scope.hideLoadingSpinner();
      return;
    }

    for(i = 0; i < remoteSet.commands.length; i++){
      command = remoteSet.commands[i];
      if (!command.name || !command.label) {
        $ionicPopup.alert({
          title: "Command definition error",
          template: 'Commands must have at least a name and a label. Please fix the problem and try again.'
        });
        $scope.hideLoadingSpinner();
        return;
      }
    }

    var localSets = LocalStorageService.commandSets();

    // Add new command set or update an existing one?
    var indexToUpdate = null;
    var templateMessage = null;

    for(i = 0; i < localSets.length; i++){
      if(localSets[i].name == remoteSet.name) {
        indexToUpdate = i;
      }
    }

    if(indexToUpdate == null) {
      localSets.push(remoteSet);
      templateMessage = "loaded";
    } else {
      localSets[indexToUpdate] = remoteSet;
      templateMessage = "updated";
    }

    LocalStorageService.set('command_sets', localSets);

    $ionicPopup.alert({
      title: "Success",
      template: '<b>' + remoteSet.name + '</b> command set was successfuly ' + templateMessage + '.'
    });

    $scope.hideLoadingSpinner();
  }

  // Loader
  $scope.loadCommandSetFromConnection = function() {
    $scope.showLoadingSpinner();

    $http.get($scope.currentConnection + '/api').success(function(data, status, headers, config){
      var remoteSet = null;

      if (data.command_set) {
        remoteSet = data.command_set;
      }
      else{
        if (data.MCP && data.MCP.robots[0]){
          remoteSet = $scope.buildCommandSet(data.MCP.robots[0]);
        }
        else if (data.robot){
          remoteSet = $scope.buildCommandSet(data.robot);
        }
        else if (data.commands){
          angular.extend(data, {name: url.match(/robots\/(.*)\/commands/)[1]})
          remoteSet = $scope.buildCommandSet(data);
        }
      }

      $scope.saveCommandSet(remoteSet)
      

    }).error(function(data, status, headers, config){
      socket = io($scope.currentConnection + '/api/robots', {multiplex:false});

      socket.on('reconnect_error', function(obj) {
        $scope.$apply(function(){
          socket.disconnect();
          $ionicPopup.alert({
            title: 'Unknown Error',
            template: "Please make sure your server is running and that the URL is correct and try again."
          });
          $scope.hideLoadingSpinner();
        });
      });
      socket.on('robots', function(robots) {
        if (robots.length > 0){
          robot = io($scope.currentConnection + '/api/robots/' + robots[0], {multiplex:false});
          robot.on('reconnect_error', function(obj) {
            $scope.$apply(function(){
              robot.disconnect();
              socket.disconnect();
              $ionicPopup.alert({
                title: 'Unknown Error',
                template: "Please make sure your server is running and that the URL is correct and try again."
              });
              $scope.hideLoadingSpinner();
            });
          });
          robot.on('commands', function(commands) {
            if (commands.length > 0){
              $scope.$apply(function(){
                var data = {
                  name: robots[0],
                  protocol: 'socketio',
                  commands: commands
                }
                var remoteSet = $scope.buildCommandSet(data);
                $scope.saveCommandSet(remoteSet)
                robot.disconnect();
                socket.disconnect();
              });
            }
            else{
              $scope.$apply(function(){
                robot.disconnect();
                socket.disconnect();
                $ionicPopup.alert({
                  title: 'Unknown Error',
                  template: "Please make sure your server is running and that the URL is correct and try again."
                });
                $scope.hideLoadingSpinner();
              });
            }
          });
          robot.connect();
          robot.emit('commands')
        }
        else {
          $scope.$apply(function(){
            socket.disconnect()
            $ionicPopup.alert({
              title: 'Unknown Error',
              template: "Please make sure your server is running and that the URL is correct and try again."
            });
            $scope.hideLoadingSpinner();
          });
        }
      });
      socket.connect();
    });
  }

  $scope.loadCommandSet = function(url) {
    $scope.showLoadingSpinner();

    if (!url) {
      $ionicPopup.alert({
        title: 'Error',
        template: 'Please specify a valid URL'
      });
      $scope.hideLoadingSpinner();
      return;
    }

    $http.get(url).success(function(data, status, headers, config){
      var remoteSet = null;

      if (data.command_set) {
        remoteSet = data.command_set;
      }
      else{
        if (data.MCP && data.MCP.robots[0]){
          remoteSet = $scope.buildCommandSet(data.MCP.robots[0]);
        }
        else if (data.robot){
          remoteSet = $scope.buildCommandSet(data.robot);
        }
        else if (data.commands){
          angular.extend(data, {name: url.match(/robots\/(.*)\/commands/)[1]})
          remoteSet = $scope.buildCommandSet(data);
        }
      }

      $scope.saveCommandSet(remoteSet)
      

    }).error(function(data, status, headers, config){
      $ionicPopup.alert({
        title: 'Unknown Error',
        template: "Please make sure your server is running and that the URL is correct and try again."
      });
      $scope.hideLoadingSpinner();
    });
  }
}]);
