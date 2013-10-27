'use strict';

describe('Service: Hubble', function () {

  // load the service's module
  beforeEach(module('HeliosApp'));

  // instantiate service
  var Hubble;
  beforeEach(inject(function (_Hubble_) {
    Hubble = _Hubble_;
  }));

  it('should do something', function () {
    expect(!!Hubble).toBe(true);
  });

});
