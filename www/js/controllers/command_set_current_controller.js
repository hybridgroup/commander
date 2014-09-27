commander.controller('CommandSetCurrentController', ['$scope', '$window', '$location', function($scope, $window, $location) {
  $scope.configuration = JSON.parse(localStorage.commander);
  $scope.current_command_set = $scope.configuration.current_command_set;

  $scope.redirect = function(){
    if ($scope.current_command_set > -1){
      $window.location.href = "/#/command_sets/" + $scope.current_command_set;
    }else{
      $window.location.href = "/#/command_sets/";
    }
  }
}]);
