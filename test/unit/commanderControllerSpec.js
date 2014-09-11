'use strict';

describe('CommanderController', function() {
  var ctrl, httpBackend, scope, command;

  command = {
    label: 'Say hello',
    robot: 'pebble',
    device: 'pebble',
    name: 'sendNotification',
    params: {message: 'Hello'}
  };

  beforeEach(function() {
    localStorage.commander = JSON.stringify({
      api: {
        host: 'http://localhost',
        port: '8080'
      },
      commands: [command]
    });
  });

  beforeEach(module('commander'));

  beforeEach(inject(function($controller, $http, $httpBackend, $rootScope, $templateCache) {
    $templateCache.put('templates/commands.html', '.<template-goes-here />');
    httpBackend = $httpBackend;
    scope = $rootScope.$new();
    ctrl = $controller('CommanderController', {$scope:scope, $http:$http});
  }));

  it('returns command', function() {
    expect(scope.commands).toEqual([command]);
  });

  it('executes command correctly', function() {
    var expectedCommand = 'http://localhost:8080/api/robots/pebble/devices/pebble/commands/sendNotification';
    httpBackend.expectPOST(expectedCommand).respond({result: 'ok'});

    scope.execute(command);
    httpBackend.flush();

    expect(scope.message).toEqual('Result of sendNotification: ok');
  });

  it('returns true when command is valid', function() {
    expect(scope.isValid(command)).toEqual(true);
  });

  it('returns false when command is not valid', function() {
    var false_command = {label: "False command"}
    expect(scope.isValid(false_command)).toEqual(false);
  });
});
