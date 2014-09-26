commander.config(function($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
  $stateProvider
    .state('command_set', {
      url: '/current_command_set',
      templateUrl: 'templates/redirect.html',
      controller: 'CurrentCommanderSetController'
    })

    .state('command_sets_index', {
      url: '/command_sets/:index',
      templateUrl: 'templates/commands.html',
      controller: 'CommanderSetController'
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
    });

  $urlRouterProvider.otherwise('/current_command_set');
});