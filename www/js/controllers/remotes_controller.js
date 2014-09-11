commander.controller('RemotesController', ['$scope', '$http', function($scope, $http) {
  $scope.configuration = JSON.parse(localStorage.commander);
  $scope.commands = $scope.configuration.commands;
  $scope.message = 'Import Commands';

  // WARNING: Once a remote commands provider is served, this method should be replaced with:
  //   $scope.remotes = [];

  $scope.remotes = [{
    label: 'Say hello',
    robot: 'pebble',
    device: 'pebble',
    name: 'sendNotification',
    params: {message: 'Hello'}
  }, {
    label: 'Say bye',
    robot: 'pebble',
    device: 'pebble',
    name: 'sendNotification',
    params: {message: 'Hello'}
  }, {
    label: 'Say cheers!',
    robot: 'pebble',
    device: 'pebble',
    name: 'sendNotification',
    params: {message: 'Hello'}
  }];

  $http({method: 'GET', url: '/remote_commands'}).
    success(function(data, status, headers, config) {
      $scope.remotes = data.remotes;
    }).
    error(function(data, status, headers, config) {
      $scope.message = 'Error: No Remote Commands available...';
    });

  $scope.saveRemotes = function(remotes) {
    angular.forEach(remotes, function(remote, index){
      if(remote.selected == true) {
        $scope.addRemote(remote);
      }
    });
  };

  $scope.addRemote = function(remote) {
    delete(remote.selected);
    $scope.configuration.commands.push(remote);
    $scope.saveConfiguration();
  };

  $scope.saveConfiguration = function() {
    localStorage.commander = JSON.stringify($scope.configuration);
  };
}]);

