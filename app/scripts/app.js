'use strict';

angular.module('HeliosApp', [
    'ngRoute',
    'ngAnimate'
  ])
  .config(['$routeProvider', '$logProvider', function ($routeProvider, $logProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/welcome.html',
        controller: 'WelcomeCtrl'
      })
      .when('/system/:id', {
        templateUrl: 'views/system.html',
        controller: 'SystemCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    $logProvider.debugEnabled(true);
  }]);
