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

    .state('connection', {
      url: '/connection',
      templateUrl: 'templates/connection.html',
      controller: 'ConfigController'
    })

    .state('remotes', {
      url: '/remotes',
      templateUrl: 'templates/remotes.html',
      controller: 'RemotesController'
    })

    .state('remotes_config', {
      url: '/remotes_config',
      templateUrl: 'templates/remotes_config.html',
      controller: 'ConfigRemotesController'
    })

    .state('add-command', {
      url: '/add',
        templateUrl: 'templates/add_command.html',
        controller: 'ConfigController'
    })

    .state('edit-command', {
      url: '/edit/:index',
        templateUrl: 'templates/add_command.html',
        controller: 'ConfigController'
    })

    .state('log', {
      url: '/log',
        templateUrl: 'templates/log.html'
    });

  $urlRouterProvider.otherwise('/commands');
});