'use strict';

angular.module('HeliosApp')
  .controller('MainCtrl',
           ['$scope', '$log', 'Kepler', 'heliosUtils',
   function ($scope,   $log,   Kepler,   utils) {


    $scope.filteredSystems = [];
    $scope.filters = {
      'composition_class': {
        'type': 'equality',
        'val': undefined,
        'active': false
      },
      'distance': {
        'type': 'inequality',
        'active': true,
        'minVal': 0.1,
        'maxVal': 10
      },
      'num_planets': {
        'type': 'inequality',
        'active': true,
        'minVal': 1,
        'maxVal': 7
      },
      'dec': {
        'type': 'inequality',
        'active': false,
        'minVal': 0,
        'maxVal': 50
      }
    };

    $scope.toggleMenu = function () {
      $scope.menuState = !$scope.menuState;
    };

    Kepler.getSystems()
      .success(function (data) {
        $scope.systems = _.map(data, function (val, key) {
          val.name = key;
          val.styleClassName = utils.mapTemperatureToClassName(val.stars[0].temperature);
          return val;
        });
        $scope.filterSystems();
      });


    $scope.filterSystems = function () {
      $scope.filteredSystems = _.filter($scope.systems, function (system) {
        return _.every(_.map($scope.filters, function (filter, key) {
          if(!filter.active) {
            return true;
          }
          if(filter.type === 'equality') {
            return system[key] === filter.val;
          }
          else {
            return system[key] >= filter.minVal && system[key] <= filter.maxVal;
          }
        }));
      });
    };

    $scope.$watch('filters', function () {
      $scope.filterSystems();
    }, true);

  }]);
