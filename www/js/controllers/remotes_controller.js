commander.controller('RemotesController', ['$scope', '$http', '$ionicNavBarDelegate', '$ionicPopup', function($scope, $http, $ionicNavBarDelegate, $ionicPopup) {
  $scope.configuration = JSON.parse(localStorage.commander);
  $scope.commands = $scope.configuration.commands;
  $scope.remotes_config = $scope.configuration.remote_address || {url: "http://localhost:8080"};
  $scope.message = 'Import Commands';
  $scope.remotes = [];

  $scope.getRemoteCommands = function() {
    var url = $scope.remotes_config.url;

    $http({method: 'GET', url: url}).
      success(function (data, status, headers, config) {
        $scope.remotes = data.commands;
        $scope.alert_title = 'Commands imported from:';
        $scope.alert_message = url;
      }).
      error(function (data, status, headers, config) {
        $scope.alert_title = 'Error:';
        $scope.alert_message = 'No Remote Commands available.';
      });
  };

  if(!$scope.remotes_config.url){
    $scope.alert_title = 'Alert:';
    $scope.alert_message = 'The commands will be imported from an external endpoint that returns a JSON structure, please set the endpoint first.';
  }else{
    $scope.getRemoteCommands();
  }

  console.log($scope.alert_title);
  console.log($scope.alert_message);

  $scope.saveRemotes = function(remotes) {
    angular.forEach(remotes, function(remote, index){
      if(remote.selected == true) {
        $scope.addRemote(remote);
      }
    });
  };

  $scope.findCommand = function(command) {
    for (var i = 0; i < $scope.commands.length; i++) {
      if ($scope.commands[i].label === command.label) {
        return true;
      }
    }
    return false;
  };

  $scope.addRemote = function(remote) {
    delete(remote.selected);
    if(!$scope.findCommand(remote)){
      $scope.configuration.commands.push(remote);
      $scope.saveConfiguration();
    }
  };

  $scope.editRemotesAPI = function(remotes_config) {
    $scope.configuration.remote_address = remotes_config;
    $scope.saveConfiguration();
  };

  $scope.saveConfiguration = function() {
    localStorage.commander = JSON.stringify($scope.configuration);
  };

  $scope.goBack = function() {
    $ionicNavBarDelegate.back();
  };

  $scope.reload = function() {
    $scope.getRemoteCommands();

    $ionicPopup.alert({
      title: 'Success!',
      template: 'Your import commands list has been reloaded.'
    });
  };
}]);

