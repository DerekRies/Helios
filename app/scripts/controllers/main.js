'use strict';

angular.module('HeliosApp')
  .controller('MainCtrl',
           ['$scope', '$log', 'Kepler',
   function ($scope,   $log,   Kepler) {

    $scope.columns = _.range(10);

    $scope.toggleMenu = function () {
      $scope.menuState = !$scope.menuState;
    };

    Kepler.getSystems()
      .success(function (data) {
        console.log(data);
      })
      .error(function (data) {

      });


  }]);
