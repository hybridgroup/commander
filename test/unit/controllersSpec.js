'use strict';

describe('CommanderController', function() {
  var ctrl, httpBackend;

  beforeEach(function() {
    localStorage.commander = JSON.stringify({
      api: {
        host: 'http://localhost',
        port: '8080'
      },
      commands: [{
        label: 'Say hello',
        robot: 'pebble',
        device: 'pebble',
        name: 'sendNotification',
        params: {message: 'Hello'}
      }]
    });
  });

  beforeEach(module('commander'));

  beforeEach(inject(function($controller, $http, $httpBackend) {
    httpBackend = $httpBackend;
    ctrl = $controller('CommanderController', {$http:$http});
  }));

  it('returns command labels', function() {
    expect(ctrl.labels).toEqual(['Say hello']);
  });

  it('executes command correctly', function() {
    var expectedCommand = 'http://localhost:8080/api/robots/pebble/devices/pebble/commands/sendNotification';
    httpBackend.expectPOST(expectedCommand).respond({result: 'ok'});

    ctrl.execute(0);
    httpBackend.flush();

    expect(ctrl.message).toEqual('Result of sendNotification: ok');
  });

});
