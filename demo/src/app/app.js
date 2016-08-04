'use strict';

angular.module('app', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'waid.templates',

  'waid.core.services',
  'waid.core.controllers',
  'waid.core.directives',

  'waid.idm.controllers',
  'waid.idm.directives',

  'waid.comments.controllers',
  'waid.comments.directives',
  
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
  }])
  .run(['waidService',function(waidService){
    if (window.location.port == '8080'){
      var apiUrl = waid.config.getConfig('api.environment.development.url');
    } else if (window.location.port == '8001') {
      var apiUrl = waid.config.getConfig('api.environment.test.url');
    } else if (window.location.port == '8002') {
      var apiUrl = waid.config.getConfig('api.environment.staging.url');
    } else {
      var apiUrl = waid.config.getConfig('api.environment.production.url');
    }

    waidService.initialize(
      apiUrl,
      'efa26bbd-33dc-4148-b135-a1e9234e0fef',
      'c7d23002-da7d-4ad3-a665-9ae9de276c9e'
    );
    waidService.authenticate();
  }]);
