'use strict';

angular.module('HeliosApp')
  .controller('MainCtrl',
           ['$scope', '$log', 'Kepler', 'heliosUtils',
   function ($scope,   $log,   Kepler,   utils) {

    $scope.columns = _.range(19);

    $scope.toggleMenu = function () {
      $scope.menuState = !$scope.menuState;
    };

    Kepler.getSystems()
      .success(function (data) {
        $log.debug(data);
        $scope.systems = _.map(data, function (val, key) {
          val.name = key;
          val.styleClassName = utils.mapTemperatureToClassName(val.stars[0].temperature);
          return val;
        });
      })
      .error(function (data) {

      });


  }]);
