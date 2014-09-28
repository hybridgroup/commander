commander.controller('CommandSetCurrentController', ['$scope', '$location', '$location', function($scope, $window, $location) {
  $scope.configuration = JSON.parse(localStorage.commander);
  $scope.current_command_set = $scope.configuration.current_command_set;

  $scope.redirect = function(){
    var current = $scope.current_command_set;
    var location = '/command_sets';

    if (current != null && current > -1) {
      location = location + '/' + $scope.current_command_set;
    }

    $location.path(location)
  }
}]);
