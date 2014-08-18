'use strict';

describe('ConfigController', function() {
  var ctrl;

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

  beforeEach(inject(function($controller) {
    ctrl = $controller('ConfigController');
  }));

  it('returns configuration', function() {
    expect(ctrl.configuration).toEqual({
      api: {
        host: 'http://localhost',
        port: '8080'
      },
      commands: []
    });
  });

  it('edits api values', function() {
    ctrl.editAPI('http://otherhost', '3000');

    expect(ctrl.configuration.api).toEqual({
      host: 'http://otherhost',
      port: '3000'
    });
  });

  it('adds a command', function() {
    ctrl.addCommand(1, {label: 'one'});
    ctrl.addCommand(2, {label: 'two'});

    expect(ctrl.configuration.commands).toEqual([undefined, {label: 'one'}, {label: 'two'}]);
  });

  it('removes a command', function() {
    ctrl.addCommand(0, {label: 'one'});
    ctrl.removeCommand(0);

    expect(ctrl.configuration.commands).toEqual([undefined]);
  });

});
