'use strict';

angular.module('HeliosApp')
  .filter('range', function () {
    return function (input, params) {

      var filterArray = [];
      var secondFilter = [];
      angular.copy(input, filterArray);

      angular.forEach(params, function (param) {
        secondFilter = [];
        angular.forEach(filterArray, function (item) {
          if(item[param] <= param) {
            secondFilter.push(item);
          }
        });
        filterArray = secondFilter;
      });
      return filterArray;
    };
  });
