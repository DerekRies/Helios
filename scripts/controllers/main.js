'use strict';

angular.module('HeliosApp')
  .controller('MainCtrl',
           ['$scope', '$log', 'Kepler', 'heliosUtils', '$timeout', '$location', 'graphics',
   function ($scope,   $log,   Kepler,   utils, $timeout, $location, graphics) {

    // $scope.menuState = $scope.sidebarState = true;

    // $scope.numStars = [
    //   {val: 1},
    //   {val: 2}
    // ];

    function getActiveSystemNameIfExists () {
      var path = $location.path();
      var pathSystemIndex = path.indexOf('system');
      if(pathSystemIndex !== -1) {
        return path.substr(pathSystemIndex + 7);
      }
      else {
        return false;
      }
    }

    $scope.filteredSystems = [];
    $scope.filters = {
      'composition_class': {
        'type': 'equality',
        'target': 'system',
        'val': undefined,
        'active': false
      },
      'distance': {
        'type': 'inequality',
        'target': 'system',
        'active': true,
        'minVal': 0,
        'maxVal': 10,
        'cap': 10
      },
      'num_planets': {
        'type': 'inequality',
        'target': 'system',
        'active': true,
        'minVal': 0,
        'maxVal': 7,
        'cap': 7
      },
      'dec': {
        'type': 'inequality',
        'target': 'system',
        'active': false,
        'minVal': 0,
        'maxVal': 50
      },
      'radius': {
        'type': 'inequality',
        'target': 'star',
        'active': false,
        'minVal': 0,
        'maxVal': 50,
        'cap': 50
      },
      'num_stars': {
        'type': 'equality',
        'target': 'system',
        'val': 1,
        'active': false
      }
    };


    Kepler.getSystems()
      .then(function (data) {
        $scope.systems = _.map(data, function (val, key) {
          if(key === 'Kepler-65'){
            console.log(val, val.stars[0].temperature);
          }
          val.name = key;
          val.styleClassName = utils.mapTemperatureToClassName(val.stars[0].temperature);
          return val;
        });
        $scope.filterSystems();
      });

    $scope.$on('$routeChangeSuccess', function () {
      var activeSystemName = getActiveSystemNameIfExists();
      if(activeSystemName){
        Kepler.getSystem(activeSystemName)
          .then(function (data) {
            $scope.activeSystem = data;
          });
      }
      else{
        $scope.activeSystem = {
          'name': 'Select a System'
        };
      }
    });


    var cleanFilters = _.clone($scope.filters, true);
    $scope.toggleMenu = function () {
      $scope.menuState = !$scope.menuState;
      graphics.setPause($scope.menuState);
    };

    $scope.toggleSidebar = function () {
      $scope.sidebarState = !$scope.sidebarState;
    };

    $scope.goToSystem = function (system) {
      $location.path('/system/' + system.name);
      $scope.toggleMenu();
    };

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