'use strict';

describe('Service: heliosUtils', function () {

  // load the service's module
  beforeEach(module('HeliosApp'));

  // instantiate service
  var heliosUtils;
  beforeEach(inject(function (_heliosUtils_) {
    heliosUtils = _heliosUtils_;
  }));

  it('should do something', function () {
    expect(!!heliosUtils).toBe(true);
  });

});
