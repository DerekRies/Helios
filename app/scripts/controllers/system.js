'use strict';

angular.module('HeliosApp')
  .controller('SystemCtrl',
        ['$scope', '$routeParams', 'graphics', 'Kepler',
function ($scope, $routeParams, graphics, Kepler) {

    $scope.id = $routeParams.id;
    Kepler.getSystem($scope.id)
      .then(function (data) {
        console.log(data.stars[0].temperature);
        graphics.loadSystem(data);
      })

  }]);