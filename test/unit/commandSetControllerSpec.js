'use strict';

describe('CommandSetController', function() {
  var ctrl, httpBackend, scope, rootScope, command, singleCommand, robotCommand, deviceCommand, scopeUrls;

  var apiUrl = "http://localhost:8000";

  command = {
    label: 'Say hello',
    robot: 'pebble',
    device: 'pebble',
    name: 'sendNotification',
    params: {message: 'Hello'}
  };

  singleCommand = {
    label: 'MCP: Echo',
    robot: '',
    device: '',
    name: 'echo',
    params: ''
  };

  robotCommand = {
    label: 'TestBot: Echo',
    robot: 'TestBot',
    device: '',
    name: 'echo',
    params: ''
  };

  deviceCommand = {
    label: 'TestBot: Echo',
    robot: 'TestBot',
    device: 'TestDevice',
    name: 'echo',
    params: ''
  };

  scopeUrls = {
    'pebble/pebble/sendNotification' : '/api/robots/pebble/devices/pebble/commands/sendNotification',
    'echo' : '/api/commands/echo',
    'TestBot/echo' : '/api/robots/TestBot/commands/echo',
    'TestBot/TestDevice/echo' : '/api/robots/TestBot/devices/TestDevice/commands/echo'
  }

  beforeEach(module('commander'));

  describe('socketio protocol', function(){
    
    beforeEach(function() {
      localStorage.commander = JSON.stringify({
        current_command_set: 0,
        api: apiUrl,
        command_sets: [
          {
            name: "Pebble",
            type: "list",
            protocol: "socketio",
            commands: [command, singleCommand, robotCommand, deviceCommand]
          }
        ],
        log: ""
      });
    });

    beforeEach(inject(function($controller, $http, $httpBackend, $rootScope, $templateCache) {
      $templateCache.put('templates/redirect.html', '.<template-goes-here />');
      httpBackend = $httpBackend;
      scope = $rootScope.$new();
      rootScope = $rootScope;
      rootScope.sockets = {};
      ctrl = $controller('CommandSetController', {$scope:scope, $http:$http});
    }));

    describe('command initCommandSet:', function(){
      it('should initialize rootScope.sockets', function() {

        expect(rootScope.sockets['pebble/pebble']).not.toBeNull();
        expect(rootScope.sockets['pebble/pebble'].vent).not.toBeNull();
        expect(rootScope.sockets['pebble/pebble'].socket).not.toBeNull();

      });
    });

    describe('command execute:', function(){
      it('when succeed should set activity logger results', function() {

        scope.execute(command);
        expect(scope.activityLog.getLog()[0]).toEqual({ message : 'Command sendNotification sent.', status : 'socketio' });
        expect(scope.activityLog.status()).toEqual('socketio');

        scope.execute(singleCommand);
        expect(scope.activityLog.getLog()[0]).toEqual({ message : 'Command echo sent.', status : 'socketio' });
        expect(scope.activityLog.status()).toEqual('socketio');
      });
    });

  });

  describe('http protocol DEFAULT', function(){
    
    beforeEach(function() {
      localStorage.commander = JSON.stringify({
        current_command_set: 0,
        api: apiUrl,
        command_sets: [
          {
            name: "Pebble",
            type: "list",
            commands: [command, singleCommand, robotCommand, deviceCommand]
          }
        ],
        log: ""
      });
    });

    beforeEach(inject(function($controller, $http, $httpBackend, $rootScope, $templateCache) {
      $templateCache.put('templates/redirect.html', '.<template-goes-here />');
      httpBackend = $httpBackend;
      scope = $rootScope.$new();
      ctrl = $controller('CommandSetController', {$scope:scope, $http:$http});
    }));

    it('returns command', function() {
      expect(scope.commands).toEqual([command, singleCommand, robotCommand, deviceCommand]);
    });

    it('initialize activity logger vars', function() {
      expect(scope.activityLog.getLog()).toEqual([]);
      expect(scope.activityLog.status()).toEqual(null);
    });

    describe('command initCommandSet:', function(){
      it('should initialize rootScope.urls', function() {
        expect(scope.urls).toEqual(scopeUrls)
      });
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

        expect(scope.activityLog.getLog()[0]).toEqual({ message : 'Result of sendNotification: success', status : 'success' });
        expect(scope.activityLog.status()).toEqual('success');
      });

      it('when fails should set activity logger results', function() {
        scope.configuration.api = "http://127.0.0.1:8000";
        var expectedCommand = 'http://127.0.0.1:8000/api/robots/pebble/devices/pebble/commands/sendNotification';
        httpBackend.expectPOST(expectedCommand).respond(401);

        scope.execute(command);
        httpBackend.flush();

        expect(scope.activityLog.getLog()[0]).toEqual({ message : 'Error executing command: sendNotification', status : 'failed' });
        expect(scope.activityLog.status()).toEqual('failed');
      });
    });

    describe('logActivity:', function(){
      it('should set activity logger results', function() {
        // Success Activiy log
        scope.logActivity(true, command, {result:'success'});
        expect(scope.activityLog.getLog()[0]).toEqual({ message : 'Result of sendNotification: success', status : 'success' });
        expect(scope.activityLog.status()).toEqual('success');

        // Error Activiy log
        scope.logActivity(false, command, null);
        expect(scope.activityLog.getLog()[0]).toEqual({ message : 'Error executing command: sendNotification', status : 'failed' });
        expect(scope.activityLog.status()).toEqual('failed');
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

          var expectedUrl = apiUrl + '/api' + '/commands/' + singleCommand.name;
          expect(scope.commandUrl(singleCommand)).toEqual(expectedUrl)
        });

      });

      describe('when is a robot command', function(){

        it('should return an URL like api/robots/{robot}/commands/{command}', function(){

          var expectedUrl = apiUrl + '/api' + '/robots/' + robotCommand.robot + '/commands/' + robotCommand.name;
          expect(scope.commandUrl(robotCommand)).toEqual(expectedUrl)
        });

      });

      describe('when is a device command', function(){

        it('should return an URL like api/robots/{robot}/devices/{device}/commands/{command}', function(){

          var expectedUrl = apiUrl + '/api' + '/robots/' + deviceCommand.robot + '/devices/' + deviceCommand.device + '/commands/' + deviceCommand.name;
          expect(scope.commandUrl(deviceCommand)).toEqual(expectedUrl)
        });

      });

    })
  });
});
