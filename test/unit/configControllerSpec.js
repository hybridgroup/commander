'use strict';

describe('ConfigController', function() {
  var ctrl, scope;

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
    $controller('ConfigController', {$scope:scope});
  }));

  it('returns configuration', function() {
    expect(scope.configuration).toEqual({
      api: {
        host: 'http://localhost',
        port: '8080'
      },
      commands: []
    });
  });

  it('edits api values', function() {
    scope.editAPI('http://otherhost', '3000');

    expect(scope.configuration.api).toEqual({
      host: 'http://otherhost',
      port: '3000'
    });
  });

  it('adds a command', function() {
    scope.addCommand(1, {label: 'one'});
    scope.addCommand(2, {label: 'two'});

    expect(scope.configuration.commands).toEqual([undefined, {label: 'one'}, {label: 'two'}]);
  });

  it('removes a command', function() {
    scope.addCommand(0, {label: 'one'});
    scope.removeCommand(0);

    expect(scope.configuration.commands).toEqual([undefined]);
  });

});
