'use strict';

angular.module('app', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'waid.demo.controllers',
  'angular-growl',
  'ui.bootstrap',
  'angular-confirm',
  'textAngular',
  'slugifier',
  'monospaced.elastic',
  'iso.directives'
])
.config(['growlProvider', function(growlProvider) {
    growlProvider.globalTimeToLive(5000);
}])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
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
