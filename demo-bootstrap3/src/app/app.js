'use strict';

angular.module('app', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'waid',
  'waid.demo.controllers',
  'monospaced.elastic',
  'iso.directives'
])
.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider, waidService) {
  $routeProvider
    .when('/article/:id/', {
      templateUrl: '/demo/templates/article-view.html',
      controller: 'WAIDArticleCtrl'
    })
    .when('/', {
      templateUrl: '/demo/templates/home.html'
    })
    .otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
}]);
