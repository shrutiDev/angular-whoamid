'use strict';

angular.module('app', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'waid',
  'waid.admin.controllers',
  'waid.admin.templates',
  'angular-growl',
  'ui.bootstrap',
  'angular-confirm',
  'textAngular',
  'slugifier',
  'monospaced.elastic'
])
.config(['growlProvider', function(growlProvider) {
    growlProvider.globalTimeToLive(5000);
}])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider, waidService) {
    $routeProvider
      .when('/social/error/:error/', {
        template: '',
        controller: 'ClientSocialError'
      })
      .when('/dashboard/', {
        templateUrl: 'waid/admin/dashboard.html'
      })
      .when('/comments/', {
        templateUrl: 'waid/admin/comments.html'
      })
      .when('/application/overview/', {
        templateUrl: 'waid/admin/application/overview.html'
      })
      .when('/application/detail/:applicationId/main/', {
        templateUrl: 'waid/admin/application/detail/main.html'
      })
      .when('/application/detail/:applicationId/overview/', {
        templateUrl: 'waid/admin/application/detail/overview.html'
      })
      .when('/application/detail/:applicationId/mail-settings/', {
        templateUrl: 'waid/admin/application/detail/mail-settings.html'
      })
      .when('/application/detail/:applicationId/social-login/', {
        templateUrl: 'waid/admin/application/detail/social-login.html'
      })
      .when('/page/overview/', {
        templateUrl: 'waid/page/overview.html'
      })
      .when('/account/overview/', {
        templateUrl: 'waid/admin/account/overview.html'
      })
      .when('/account/main/', {
        templateUrl: 'waid/admin/account/main.html'
      })
      .when('/info/terms-and-conditions/', {
        templateUrl: '/app/templates/terms-and-conditions.html',
      })
      .when('/info/privacy-policy/', {
        templateUrl: '/app/templates/privacy-policy.html',
      })
      .when('/info/cookie-policy/', {
        templateUrl: '/app/templates/cookie-policy.html',
      })
      .when('/info/copyright-policy/', {
        templateUrl: '/app/templates/copyright-policy.html',
      })
      .when('/', {
        templateUrl: '/app/templates/home.html'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);
