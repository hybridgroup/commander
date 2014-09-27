'use strict';

describe('CommandSetsController', function(){
  var controller, http, httpBackend, scope, storage;

  beforeEach(module('commander'));

  beforeEach(inject(function($controller, $http, $httpBackend, $rootScope, LocalStorageService){
    storage = LocalStorageService;
    storage.clear()
    http = $http;
    httpBackend = $httpBackend;
    scope = $rootScope.$new();
    controller = $controller('CommandSetsController', {$scope: scope, $http: http, LocalStorageService: storage});
  }));

  it('sets $scope.commandSets from localStorage', function(){
    expect(scope.commandSets).toEqual(storage.get('command_sets'))
  });

  it('sets $scopeCommandSets from localStorage when local storage is updated', function(){
    expect(scope.commandSets).toEqual([])
    var sets = [{name:'cs1'}, {name: 'cs2'}];
    storage.set('command_sets', sets);
    expect(scope.commandSets).toEqual(sets)
  })

  describe('useCommandSet', function(){
    it("sets $scope.currentCommandSet and local storage's current_command_set to the current command set", function(){
      storage.set('command_sets', [{name: 'cs1'}, {name: 'cs2'}]);
      expect(scope.currentCommandSet).toEqual(undefined)
      scope.useCommandSet(1)
      expect(scope.currentCommandSet).toEqual(storage.get('current_command_set'))
    });
  });

  describe('getClass', function(){

    beforeEach(function(){
      storage.set('current_command_set', 1)
    });

    it('returns button-balanced when item is the current command set', function(){
      expect(scope.getClass(1)).toEqual('button-balanced');
    });

    it('returns button-energized when item is not the current command set', function(){
      expect(scope.getClass(0)).toEqual('button-energized');
    });
  });

  describe('getTitle', function(){

    beforeEach(function(){
      storage.set('current_command_set', 1)
    });

    it('returns "Use" when item is not the current command set', function(){
      expect(scope.getTitle(0)).toEqual('Use');
    });

    it('returns "Current" when item is the current command set', function(){
      expect(scope.getTitle(1)).toEqual('Current');
    });
  });

  describe('loadCommandSet', function(){
    describe('JSON response', function(){
      beforeEach(function(){
        // TODO: Get rid of this line, should not be here but hadn't time
        // to check it out: Rafael Magana <raf@hybridgroup.com>
        httpBackend.whenGET('templates/commands.html').respond({})
      })
      describe('when success', function(){
        it('adds command set to local storage', function(){
          //var json = {command_set: {name: 'waza', type:'list', commands:[{name: 'cmd', label: 'lbl'}]}};
          //httpBackend.expectGET('http://localhost:3001/api/command_set').respond(json)
          //expect(storage.commandSets()).toEqual([])
          //scope.loadCommandSet('http://localhost:3001/api/command_set')
          //expect(storage.commandSets()).toEqual([json.command_set])
          //httpBackend.flush();
        })
      });
      describe('when error', function(){});
    });
  });
});
