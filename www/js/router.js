commander.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('command_sets_loader', {
      url: '/command_sets',
      templateUrl: 'templates/command_sets.html',
      controller: 'CommandSetsController'
    })

    .state('command_sets_current', {
      url: '/command_sets/current',
      templateUrl: 'templates/redirect.html',
      controller: 'CommandSetCurrentController'
    })

    .state('command_sets_index', {
      url: '/command_sets/:index',
      templateUrl: 'templates/commands.html',
      controller: 'CommandSetController'
    })

    .state('connections', {
      url: '/connections',
      templateUrl: 'templates/connections.html',
      controller: 'ConnectionsController'
    })

    .state('about', {
      url: '/about',
      templateUrl: 'templates/about.html'
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

    .state('activity_log', {
      url: '/log',
      templateUrl: 'templates/activity_log.html'
    });

  $urlRouterProvider.otherwise('/command_sets/current');
});
