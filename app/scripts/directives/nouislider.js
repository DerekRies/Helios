'use strict';

angular.module('HeliosApp')
  .directive('nouislider', [function () {
    return {
      restrict: 'A',
      scope: {
        'startMin': '=',
        'startMax': '=',
        'rangeMax': '=',
        'rangeMin': '='
      },
      link: function postLink(scope, element, attrs) {
        element.noUiSlider({
             range: [scope.rangeMin,scope.rangeMax]
            ,start: [scope.startMin,scope.startMax]
        }).change(function() {
            var vals = element.val();
            scope.$apply(function() {
                scope.startMin = parseFloat(vals[0],10);
                scope.startMax = parseFloat(vals[1],10);
            });
        });

      }
    };
  }]);