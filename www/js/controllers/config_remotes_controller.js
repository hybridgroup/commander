commander.controller('ConfigRemotesController', ['$scope', '$http', function($scope, $http) {
  $scope.configuration = JSON.parse(localStorage.commander);
  $scope.remotes_config = $scope.configuration.remote_address || {url: "http://localhost:8080"};

  $scope.editRemotesAPI = function(remotes_config) {
    $scope.configuration.remote_address = remotes_config;
    $scope.saveConfiguration();
  };

  $scope.saveConfiguration = function() {
    localStorage.commander = JSON.stringify($scope.configuration);
  };
}]);

