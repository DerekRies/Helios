'use strict';

angular.module('HeliosApp')
  .controller('MainCtrl', function ($scope, Hubble) {

    $scope.toggleMenu = function () {
      $scope.menuState = !$scope.menuState;
    }

  });
