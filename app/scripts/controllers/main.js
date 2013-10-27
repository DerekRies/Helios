'use strict';

angular.module('HeliosApp')
  .controller('MainCtrl', function ($scope, Hubble) {

    $scope.menuCtrl = true;
    $scope.toggleMenu = function () {
        $scope.menuCtrl = $scope.menuCtrl === false ? true: false;
        //Hubble.toggleMenu();
    }

  });
