'use strict';

describe('ConnectionsController', function() {
  var controller, http, httpBackend, scope, storage;

  var singleConnection = [
    {
      url:'http://127.0.0.1:8080',
      auth:'none',
      user: null,
      password: null,
      token: null,
      tokenHeader: null
    }
  ]

  var doubleConnection = [
    {
      url:'http://127.0.0.1:8080',
      auth:'none',
      user: null,
      password: null,
      token: null,
      tokenHeader: null
    },
    {
      url:'http://127.0.0.1:8081',
      auth:'none',
      user: null,
      password: null,
      token: null,
      tokenHeader: null
    }
  ]

  var tripleConnection = [
    {
      url:'http://127.0.0.1:8080',
      auth:'none',
      user: null,
      password: null,
      token: null,
      tokenHeader: null
    },
    {
      url:'http://127.0.0.1:8081',
      auth:'none',
      user: null,
      password: null,
      token: null,
      tokenHeader: null
    },
    {
      url:'http://127.0.0.1:8082',
      auth:'none',
      user: null,
      password: null,
      token: null,
      tokenHeader: null
    }
  ]

  beforeEach(module('commander'));

  beforeEach(inject(function($controller, $http, $httpBackend, $rootScope, LocalStorageService){
    storage = LocalStorageService;
    storage.clear();
    http = $http;
    httpBackend = $httpBackend;
    scope = $rootScope.$new();
    controller = $controller('ConnectionsController', {$scope: scope, $http: http, LocalStorageService: storage});
  }));

  it('sets $scope.connections from localStorage', function(){
    expect(scope.connections).toEqual(storage.get('connections'));
  });

  it('sets $scopeConnections from localStorage when local storage is updated', function(){
    expect(scope.connections).toEqual([]);
    storage.set('connections', doubleConnection);
    expect(scope.connections).toEqual(doubleConnection);
  })

  describe('useConnection', function(){
    it("sets $scope.currentConnection and local storage's current_connection to the current connection", function(){
      storage.set('connections', doubleConnection);
      expect(scope.currentConnection).toEqual(undefined);
      scope.useConnection(1);
      expect(scope.currentConnection).toEqual(storage.get('current_connection'));
    });
  });

  describe('getClass', function(){

    beforeEach(function(){
      storage.set('current_connection', 1);
    });

    it('returns button-stable when item is the current connection', function(){
      expect(scope.getClass(1)).toEqual('button-stable');
    });

    it('returns button-balanced when item is not the current connection', function(){
      expect(scope.getClass(0)).toEqual('button-balanced');
    });
  });

  describe('getTitle', function(){

    beforeEach(function(){
      storage.set('current_connection', 1);
    });

    it('returns "Use" when item is not the current connection', function(){
      expect(scope.getTitle(0)).toEqual('Use');
    });

    it('returns "Current" when item is the current connection', function(){
      expect(scope.getTitle(1)).toEqual('Current');
    });
  });


  describe('removeConnection', function(){
    it("should delete connection", function(){
      storage.set('connections', doubleConnection);
      expect(scope.connections.length).toEqual(2);
      scope.removeConnection(1);
      expect(scope.connections.length).toEqual(1);
    });

    it("if deleted connection was the current one, should delete connection and set the first connection on the list as the new current", function(){
      storage.set('connections', tripleConnection);
      expect(scope.connections.length).toEqual(3);
      scope.useConnection(1);
      expect(scope.currentConnection).toEqual(storage.get('current_connection'));
      expect(scope.currentConnection).toEqual(1);
      scope.removeConnection(1);
      expect(scope.currentConnection).toEqual(storage.get('current_connection'));
      expect(scope.currentConnection).toEqual(0);
    });

    it("if deleted connection is not current, but the current is the last one on the list, should delete connection and set the current to the last one on the new list", function(){
      storage.set('connections', tripleConnection);
      expect(scope.connections.length).toEqual(3);
      scope.useConnection(2);
      expect(scope.currentConnection).toEqual(storage.get('current_connection'));
      expect(scope.currentConnection).toEqual(2);
      scope.removeConnection(0);
      expect(scope.currentConnection).toEqual(storage.get('current_connection'));
      expect(scope.currentConnection).toEqual(1);
    });
  });

  describe('saveConnection', function(){
    it("should update the connection", function(){
      storage.set('connections', doubleConnection);
      expect(scope.connections[0]).toEqual({url:'http://127.0.0.1:8080',auth:'none',user: null,password: null,token: null,tokenHeader: null});
      expect(scope.connections[1]).toEqual({url:'http://127.0.0.1:8081',auth:'none',user: null,password: null,token: null,tokenHeader: null});
      doubleConnection[0].url = 'http://127.0.0.1:3000';
      scope.saveConnection(doubleConnection[0], 0)
      expect(scope.connections[0]).toEqual({url:'http://127.0.0.1:3000',auth:'none',user: null,password: null,token: null,tokenHeader: null});
    });

    it("should add a new connection", function(){
      storage.set('connections', doubleConnection);
      expect(scope.connections.length).toEqual(2);
      scope.saveConnection({url:'http://127.0.0.1:3000',auth:'none'}, null);
      expect(scope.connections.length).toEqual(3);
    });
  });


});
