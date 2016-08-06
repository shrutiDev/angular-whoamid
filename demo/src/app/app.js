'use strict';

angular.module('app', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'waid',
  'waid.demo.controllers',
  'angular-growl',
  'ui.bootstrap',
  'angular-confirm',
  'slugifier',
  'monospaced.elastic',
  'iso.directives'
])
.config(['growlProvider', function(growlProvider) {
    growlProvider.globalTimeToLive(5000);
}])
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
