'use strict';

describe('CommandSetController', function() {
  var ctrl, httpBackend, scope, command;

  var apiUrl = "http://localhost:8000";

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
    $templateCache.put('templates/redirect.html', '.<template-goes-here />');
    httpBackend = $httpBackend;
    scope = $rootScope.$new();
    ctrl = $controller('CommandSetController', {$scope:scope, $http:$http});
  }));

  it('returns command', function() {
    expect(scope.commands).toEqual([command]);
  });

  it('initialize activity logger vars', function() {
    expect(scope.activityLog.getLog()).toEqual([]);
    expect(scope.activityLog.status()).toEqual(null);
  });
  
  describe('command execute:', function(){
    it('should return false if API URL is invalid', function() {
      var result = scope.execute(command);
      expect(result).toEqual(false)
    });

    it('should return true if API URL is valid', function() {
      scope.configuration.api = "http://127.0.0.1:8000";
      var result = scope.execute(command);
      expect(result).toEqual(true)
    });

    it('when succeed should set activity logger results', function() {
      scope.configuration.api = "http://127.0.0.1:8000";
      var expectedCommand = 'http://127.0.0.1:8000/api/robots/pebble/devices/pebble/commands/sendNotification';
      httpBackend.expectPOST(expectedCommand).respond(200, {result:'success'});

      scope.execute(command);
      httpBackend.flush();

      expect(scope.activityLog.getLog()[0]).toEqual({ message : 'Result of sendNotification: success', status : true });
      expect(scope.activityLog.status()).toEqual(true);
    });

    it('when fails should set activity logger results', function() {
      scope.configuration.api = "http://127.0.0.1:8000";
      var expectedCommand = 'http://127.0.0.1:8000/api/robots/pebble/devices/pebble/commands/sendNotification';
      httpBackend.expectPOST(expectedCommand).respond(401);

      scope.execute(command);
      httpBackend.flush();

      expect(scope.activityLog.getLog()[0]).toEqual({ message : 'Error executing command: sendNotification', status : false });
      expect(scope.activityLog.status()).toEqual(false);
    });
  });

  describe('logActivity:', function(){
    it('should set activity logger results', function() {
      // Success Activiy log
      scope.logActivity(true, command, {result:'success'});
      expect(scope.activityLog.getLog()[0]).toEqual({ message : 'Result of sendNotification: success', status : true });
      expect(scope.activityLog.status()).toEqual(true);

      // Error Activiy log
      scope.logActivity(false, command, null);
      expect(scope.activityLog.getLog()[0]).toEqual({ message : 'Error executing command: sendNotification', status : false });
      expect(scope.activityLog.status()).toEqual(false);
    });
  });

  describe('isValid:', function(){
    it('returns true when command is valid', function() {
      expect(scope.isValid(command)).toEqual(true);
    });

    it('returns false when command is not valid', function() {
      var false_command = {label: "False command"}
      expect(scope.isValid(false_command)).toEqual(false);
    });
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

        var expectedUrl = apiUrl + '/api' + '/commands/' + mcpCommand.name;
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

        var expectedUrl = apiUrl + '/api' + '/robots/' + mcpCommand.robot + '/commands/' + mcpCommand.name;
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

        var expectedUrl = apiUrl + '/api' + '/robots/' + mcpCommand.robot + '/devices/' + mcpCommand.device + '/commands/' + mcpCommand.name;
        expect(scope.commandUrl(mcpCommand)).toEqual(expectedUrl)
      });

    });

  })
});
