commander.controller('ConnectionsController', [ '$scope', '$http', 'LocalStorageService', '$location', 'activityLogger', '$ionicPopup', '$ionicListDelegate', function($scope, $http, LocalStorageService, $location, activityLogger, $ionicPopup, $ionicListDelegate) {

  // Local connections
  $scope.$on(LocalStorageService.Event.updated, function(event, data){
    updateLocalConnectionsView();
  });

  var updateLocalConnectionsView = function() {
    $scope.connections = LocalStorageService.connections();
  }

  updateLocalConnectionsView()

  $scope.useConnection = function(connectionIndex) {
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
