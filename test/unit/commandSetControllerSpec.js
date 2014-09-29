'use strict';

describe('CommandSetController', function() {
  var ctrl, httpBackend, scope, command;

  var apiUrl = "http://localhost:8000/api";

  command = {
    label: 'Say hello',
    robot: 'pebble',
    device: 'pebble',
    name: 'sendNotification',
    params: {message: 'Hello'}
  };

  beforeEach(function() {
    localStorage.commander = JSON.stringify({
      current_command_set: 0,
      api: apiUrl,
      command_sets: [
        {
          name: "Pebble",
          type: "list",
          commands: [command]
        }
      ],
      log: ""
    });
  });

  beforeEach(module('commander'));

  beforeEach(inject(function($controller, $http, $httpBackend, $rootScope, $templateCache) {
    $templateCache.put('templates/commands.html', '.<template-goes-here />');
    httpBackend = $httpBackend;
    scope = $rootScope.$new();
    ctrl = $controller('CommandSetController', {$scope:scope, $http:$http});
  }));

  it('returns command', function() {
    expect(scope.commands).toEqual([command]);
  });

  it('executes command correctly', function() {
    var expectedCommand = 'http://localhost:8000/api/robots/pebble/devices/pebble/commands/sendNotification';
    httpBackend.expectPOST(expectedCommand).respond({result: 'ok'});

    expect(scope.execute(command)).toEqual(true);
  });

  it('returns true when command is valid', function() {
    expect(scope.isValid(command)).toEqual(true);
  });

  it('returns false when command is not valid', function() {
    var false_command = {label: "False command"}
    expect(scope.isValid(false_command)).toEqual(false);
  });

  describe('#commandUrl', function(){

    describe('when is a MCP command', function(){

      it('should return an URL like api/commands/{command}', function(){

        var mcpCommand = {
          label: 'MCP: Echo',
          robot: '',
          device: '',
          name: 'echo',
          params: ''
        };

        var expectedUrl = apiUrl + '/commands/' + mcpCommand.name;
        expect(scope.commandUrl(mcpCommand)).toEqual(expectedUrl)
      });

    });

    describe('when is a robot command', function(){

      it('should return an URL like api/robots/{robot}/commands/{command}', function(){

        var mcpCommand = {
          label: 'TestBot: Echo',
          robot: 'TestBot',
          device: '',
          name: 'echo',
          params: ''
        };

        var expectedUrl = apiUrl + '/robots/' + mcpCommand.robot + 
                                   '/commands/' + mcpCommand.name;
        expect(scope.commandUrl(mcpCommand)).toEqual(expectedUrl)
      });

    });

    describe('when is a device command', function(){

      it('should return an URL like api/robots/{robot}/devices/{device}/commands/{command}', function(){

        var mcpCommand = {
          label: 'TestBot: Echo',
          robot: 'TestBot',
          device: 'TestDevice',
          name: 'echo',
          params: ''
        };

        var expectedUrl = apiUrl + '/robots/' + mcpCommand.robot +
                                   '/devices/' + mcpCommand.device +
                                   '/commands/' + mcpCommand.name;
        expect(scope.commandUrl(mcpCommand)).toEqual(expectedUrl)
      });

    });

  })
});