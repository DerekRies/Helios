'use strict';

angular.module('HeliosApp')
  .controller('MainCtrl', function ($scope) {

    $scope.toggleMenu = function () {
      $scope.menuState = !$scope.menuState;
    };

    $scope.makeArray = function (x) {
      console.log(x);
      var arr = [];
      for(var i = 0; i <= x; i++) {
        arr.push(i);
      }
      console.log(arr);
      return arr;
    };

    $scope.columns = $scope.makeArray(19);

  });
