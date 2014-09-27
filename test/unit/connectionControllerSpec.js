'use strict';

describe('ConnectionController', function() {
  var ctrl, scope;

  beforeEach(function() {
    localStorage.commander = JSON.stringify({
      api: 'http://localhost:8080/api/endpoint'
    });
  });

  beforeEach(module('commander'));

  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controller('ConnectionController', {$scope:scope});
  }));

  it('returns configuration', function() {
    expect(scope.configuration).toEqual({
      api: 'http://localhost:8080/api/endpoint'
    });
  });

  it('edits api values', function() {
    scope.editAPI('http://otherhost');

    expect(scope.configuration.api).toEqual('http://otherhost');
  });
});
