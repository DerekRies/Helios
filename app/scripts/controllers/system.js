'use strict';

angular.module('HeliosApp')
  .controller('SystemCtrl', [ '$scope', '$routeParams', function ($scope, $routeParams) {
    $scope.id = $routeParams.id;
  }]);