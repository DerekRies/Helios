'use strict';

angular.module('HeliosApp')
  .directive('saganGraphicsCanvas', ['graphics', function (graphics) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        graphics.setRenderTarget(element[0]);
      }
    };
  }]);
