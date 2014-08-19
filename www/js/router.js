commander.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('commands', {
      url: '/commands',
      templateUrl: 'templates/commands.html',
      controller: 'CommanderController'
    })
    .state('config', {
      url: '/config',
      templateUrl: 'templates/config.html',
      controller: 'ConfigController'
    })
    .state('add-command', {
      url: '/add',
        templateUrl: 'templates/add_command.html',
        controller: 'ConfigController'
    });

  $urlRouterProvider.otherwise('/commands');
});