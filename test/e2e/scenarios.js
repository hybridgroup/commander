'use strict';

describe('Commander App', function() {

  describe('commands screen', function() {

    beforeEach(function() {
      browser.get('/');
    });

    it('has a ready message', function() {
      var message = element(by.css('.message')).getText();

      expect(message).toEqual('Ready...');
    });
  });

});
