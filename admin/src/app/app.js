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
        templateUrl: 'waid/admin/dashboard.html',
        resolve: {
          authenticate: function(waidService){
            return waidService.authenticate();
          }
        }
      })
      .when('/application/overview/', {
        templateUrl: 'waid/admin/application/overview.html',
        resolve: {
          authenticate: function(waidService){
            return waidService.authenticate();
          }
        }
      })
      .when('/application/detail/:applicationId/main/', {
        templateUrl: 'waid/admin/application/detail/main.html',
        resolve: {
          authenticate: function(waidService){
            return waidService.authenticate();
          }
        }
      })
      .when('/application/detail/:applicationId/overview/', {
        templateUrl: 'waid/admin/application/detail/overview.html',
        resolve: {
          authenticate: function(waidService){
            return waidService.authenticate();
          }
        }
      })
      .when('/application/detail/:applicationId/mail-settings/', {
        templateUrl: 'waid/admin/application/detail/mail-settings.html',
        resolve: {
          authenticate: function(waidService){
            return waidService.authenticate();
          }
        }
      })
      .when('/application/detail/:applicationId/social-login/', {
        templateUrl: 'waid/admin/application/detail/social-login.html',
        resolve: {
          authenticate: function(waidService){
            return waidService.authenticate();
          }
        }
      })
      .when('/page/overview/', {
        templateUrl: 'waid/page/overview.html',
        resolve: {
          authenticate: function(waidService){
            return waidService.authenticate();
          }
        }
      })
      .when('/account/overview/', {
        templateUrl: 'waid/admin/account/overview.html',
        resolve: {
          authenticate: function(waidService){
            return waidService.authenticate();
          }
        }
      })
      .when('/account/main/', {
        templateUrl: 'waid/admin/account/main.html',
        resolve: {
          authenticate: function(waidService){
            return waidService.authenticate();
          }
        }
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
  }])
  .run(['waidService',function(waidService){
    if (window.location.port == '8000'){
      var apiUrl = waid.config.getConfig('api.environment.development.url');
    } else if (window.location.port == '8001') {
      var apiUrl = waid.config.getConfig('api.environment.test.url');
    } else if (window.location.port == '8002') {
      var apiUrl = waid.config.getConfig('api.environment.staging.url');
    } else {
      var apiUrl = waid.config.getConfig('api.environment.production.url');
    }

    waidService.initialize(apiUrl);
    waidService.authenticate();
  }]);
