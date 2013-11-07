'use strict';

describe('Service: Kepler', function () {

  // load the service's module
  beforeEach(module('HeliosApp'));

  // instantiate service
  var Kepler;
  beforeEach(inject(function (_Kepler_) {
    Kepler = _Kepler_;
  }));

  it('should do something', function () {
    expect(!!Kepler).toBe(true);
  });

});
