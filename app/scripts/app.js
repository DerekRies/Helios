'use strict';

angular.module('HeliosApp', [
    'ngRoute'
    // 'ngAnimate'
  ])
  .config(function ($routeProvider, $logProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    $logProvider.debugEnabled(true);
  });
