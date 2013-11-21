'use strict';

angular.module('HeliosApp')
  .controller('MainCtrl',
           ['$scope', '$log', 'Kepler', 'heliosUtils', '$timeout',
   function ($scope,   $log,   Kepler,   utils, $timeout) {

    $scope.menuState = $scope.sidebarState = true;

    $scope.numStars = [
      {val: 1},
      {val: 2}
    ];

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
        'minVal': 0,
        'maxVal': 10,
        'cap': 10
      },
      'num_planets': {
        'type': 'inequality',
        'active': true,
        'minVal': 0,
        'maxVal': 7,
        'cap': 7
      },
      'dec': {
        'type': 'inequality',
        'active': false,
        'minVal': 0,
        'maxVal': 50
      },
      'ra': {
        'type': 'inequality',
        'active': true,
        'minVal': 0,
        'maxVal': 22.8869,
        'cap': 22.8869
      },
      'num_stars': {
        'type': 'equality',
        'val': 1,
        'active': false
      }
    };

    var cleanFilters = _.clone($scope.filters, true);

    $scope.toggleMenu = function () {
      $scope.menuState = !$scope.menuState;
    };

    $scope.toggleSidebar = function () {
      $scope.sidebarState = !$scope.sidebarState;
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

    $scope.clearFilters = function () {
      $scope.filters = _.clone(cleanFilters, true);
    };

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