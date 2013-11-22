'use strict';

describe('Service: graphics', function () {

  // load the service's module
  beforeEach(module('HeliosApp'));

  // instantiate service
  var graphics;
  beforeEach(inject(function (_graphics_) {
    graphics = _graphics_;
  }));

  it('should do something', function () {
    expect(!!graphics).toBe(true);
  });

});
