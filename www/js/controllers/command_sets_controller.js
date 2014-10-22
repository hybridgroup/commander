commander.controller('CommandSetsController', ['$scope', '$http', 'LocalStorageService', '$ionicNavBarDelegate', '$ionicPopup', '$ionicLoading', '$location', 'activityLogger', function($scope, $http, LocalStorageService, $ionicNavBarDelegate, $ionicPopup, $ionicLoading, $location, activityLogger) {

  // Local command sets
  $scope.$on(LocalStorageService.Event.updated, function(event, data){
    updateLocalCommandsView();
  });

  var updateLocalCommandsView = function() {
    $scope.commandSets = LocalStorageService.commandSets();
  }

  updateLocalCommandsView()

  $scope.useCommandSet = function(commandSetIndex) {
    if (!isCurrent(commandSetIndex)){
      activityLogger.clear();
    }
    LocalStorageService.set('current_command_set', commandSetIndex)
    $scope.currentCommandSet = commandSetIndex;
    $location.path('/command_sets/' + commandSetIndex);
  }

  // Presentation-related
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

  // Loader
  $scope.loadCommandSet = function(url) {
    $scope.showLoadingSpinner();

    if (!url) {
      $ionicPopup.alert({
        title: 'Error',
        template: 'Please specify an URL'
      });
      $scope.hideLoadingSpinner();
      return;
    }

    $http.get(url).success(function(data, status, headers, config){
    console.log("Calling get... success")
      var remoteSet = data.command_set

      if (!remoteSet) {
        console.log("Calling get... no command_set")
        $ionicPopup.alert({
          title: "JSON Error",
          template: 'Wrong JSON structure, you must wrap the command set definition in a "command_set" object.'
        });
        $scope.hideLoadingSpinner();
        return;
      }

      if (!remoteSet.name) {
        console.log("Calling get... no name")
        $ionicPopup.alert({
          title: "Command set definition error",
          template: 'The command set must have a name.'
        });
        $scope.hideLoader();
        return;
      }

      if (remoteSet.type != 'list' && remoteSet.type != 'd-pad')  {
        console.log("Calling get... bad type")
        $ionicPopup.alert({
          title: "Command set definition error",
          template: 'The command set must have a type (value must be either <b>list</b> or <b>d-pad</b>).'
        });
        $scope.hideLoadingSpinner();
        return;
      }

      if (!remoteSet.commands || !remoteSet.commands instanceof Array || remoteSet.commands.length == 0)  {
        console.log("Calling get... no commands array")
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
          console.log("Calling get... command does not have name or label")
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

    }).error(function(data, status, headers, config){
      console.log("Calling get... error")
      $ionicPopup.alert({
        title: 'Unknown Error',
        template: "Please make sure your server is running and that the URL is correct and try again."
      });
      $scope.hideLoadingSpinner();
    });
  }
}]);
