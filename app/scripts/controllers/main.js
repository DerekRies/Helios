'use strict';

angular.module('HeliosApp')
  .controller('MainCtrl',
           ['$scope', '$log', 'Kepler',
   function ($scope,   $log,   Kepler) {

    $scope.columns = _.range(19);

    $scope.toggleMenu = function () {
      $scope.menuState = !$scope.menuState;
    };

    Kepler.getSystems()
      .success(function (data) {
        $log.debug(data);
        $scope.systems = _.map(data, function (val, key) {
          val.name = key;
          return val;
        });
      })
      .error(function (data) {

      });


  }]);
