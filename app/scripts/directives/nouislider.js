'use strict';

angular.module('HeliosApp')
  .directive('nouislider', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      scope: {
        'startMin': '=',
        'startMax': '=',
        'rangeMax': '=',
        'rangeMin': '='
      },
      link: function postLink(scope, element, attrs) {
        console.log(scope.startMax, scope.startMin);
        element.noUiSlider({
             range: [scope.rangeMin,scope.rangeMax]
            ,start: [scope.startMin,scope.startMax]
        }).change(function() {
            var vals = element.val();
            scope.$apply(function() {
                scope.startMin = parseFloat(vals[0],10);
                scope.startMax = parseFloat(vals[1],10);
            });
            console.log(scope);
        });

      }
    };
  }]);