'use strict';

angular.module('app', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'waid.templates',
  'waid.core.services',
  'waid.idm.controllers',
  'waid.idm.directives',
  'waid.admin.controllers',
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

      .when('/', {
        templateUrl: 'waid/admin/home.html',
        resolve: {
          authenticate: function(waidService){
            // Authenticate, if logged in then you can redirect the user
            waidService.authenticate();
            // Just return true, otherwhise it will not load
            return true
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }])
  .run(['waidService',function(waidService){
    waidService.initialize(
      waid.config.getConfig('api.url')
    );
    waidService.authenticate();
  }]);
