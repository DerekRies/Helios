'use strict';

describe('Directive: graphicsTarget', function () {

  // load the directive's module
  beforeEach(module('HeliosApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<graphics-target></graphics-target>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the graphicsTarget directive');
  }));
});
