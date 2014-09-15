commander.controller('RemotesController', ['$scope', '$http', function($scope, $http) {
  $scope.configuration = JSON.parse(localStorage.commander);
  $scope.commands = $scope.configuration.commands;
  $scope.remotes_config = $scope.configuration.remote_address || {host: "", port: ""};
  $scope.message = 'Import Commands';
  var remotes_config = $scope.remotes_config;

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

  var url = remotes_config.host + ':' + remotes_config.port + '/api/remote_commands';

  $http({method: 'GET', url: url}).
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

  $scope.editRemotesAPI = function(remotes_config) {
    $scope.configuration.remote_address = remotes_config;
    $scope.saveConfiguration();
  };

  $scope.saveConfiguration = function() {
    localStorage.commander = JSON.stringify($scope.configuration);
  };
}]);

