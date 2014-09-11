'use strict';

describe('RemotesController', function() {
  var scope;

  beforeEach(function() {
    localStorage.commander = JSON.stringify({
      api: {
        host: 'http://localhost',
        port: '8080'
      },
      commands: []
    });
  });

  beforeEach(module('commander'));

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controller('RemotesController', {$scope:scope});
  }));

  it('adds remote commands', function() {
    scope.saveRemotes([{label: 'uno', selected: true}, {label: 'dos', selected: false}]);

    expect(scope.configuration.commands).toEqual([{label: 'uno'}]);
  });

  it('edits a command', function() {
    scope.addRemote({label: 'one', selected: true});
    scope.addRemote({label: 'two', selected: false});

    expect(scope.configuration.commands).toEqual([{label: 'one'}, {label: 'two'}]);
  });

});
