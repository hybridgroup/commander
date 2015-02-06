commander.controller('CommandSetCurrentController', ['$scope', '$location', '$location', '$ionicViewService', function($scope, $window, $location, $ionicViewService) {
  $scope.configuration = JSON.parse(localStorage.commander);
  $scope.current_command_set = $scope.configuration.current_command_set;
  $scope.current_connection = $scope.configuration.current_connection;

  $scope.redirect = function(){
    var current = $scope.current_command_set;
    var location = '/command_sets';

    if (current != null && current > -1) {
      location = location + '/' + $scope.current_command_set;
    }
    $ionicViewService.nextViewOptions({
      disableBack: true
    });
    $location.path(location)
  }
}]);
