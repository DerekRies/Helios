'use strict';

angular.module('HeliosApp')
  .factory('Kepler', ['$http','$q', function ($http, $q) {

    var systems;

    $http.get('/scripts/confirmed.json').success(function (data) {
      systems = data;
    });

    return {

      getSystems: function (searchParams) {
        var deferred = $q.defer();

        function checkSystems () {
          if(typeof systems !== 'undefined') {
            deferred.resolve(systems);
            return;
          }
          setTimeout(function () {
            checkSystems();
          }, 250);
        }

        checkSystems();
        return deferred.promise;
      },

      getSystem: function (name) {
        var deferred = $q.defer();

        function checkSystems () {
          if(typeof systems !== 'undefined') {
            deferred.resolve(systems[name]);
            return;
          }
          setTimeout(function () {
            checkSystems();
          }, 250);
        }

        checkSystems();
        return deferred.promise;
      },

      getPlanetsBySystem: function (system, searchParams) {
        if(searchParams){

        }
        var planets = [];
        return planets;
      },

    };
  }]);
