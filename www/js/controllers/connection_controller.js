commander.controller('ConnectionController', [ '$scope', '$ionicPopup', function($scope, $ionicPopup) {
  $scope.configuration = JSON.parse(localStorage.commander);
  $scope.api = $scope.configuration.api;

  $scope.saveConfiguration = function() {
    localStorage.commander = JSON.stringify($scope.configuration);
  };

  $scope.editAPI = function(api) {
    $scope.configuration.api = api;
    $scope.saveConfiguration();
    $ionicPopup.alert({
      title: 'API URL updated:',
      template: api
    });
  };
}]);
