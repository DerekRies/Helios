'use strict';

angular.module('HeliosApp')
  .factory('Kepler', ['$http', function ($http) {

    return {

      getSystems: function (searchParams) {
        if(searchParams){

        }
        return $http.get('/scripts/confirmed.json');
      },

      getPlanetsBySystem: function (system, searchParams) {
        if(searchParams){

        }
        var planets = [];
        return planets;
      },

    };
  }]);