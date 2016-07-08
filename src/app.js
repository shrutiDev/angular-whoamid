'use strict';

angular.module('app', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'client.controllers',
  'waid.services',
  'angular-growl',
  'ui.bootstrap',
  'angular-confirm',
  'chart.js',
  'textAngular'
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
      .when('/profile/emails/', {
        templateUrl: 'waid/profile/emails.html',
        resolve: {
          authenticate: function(waidService){
            return waidService.authenticate();
          }
        }
      })
      .when('/profile/main/', {
        templateUrl: 'waid/profile/main.html',
        resolve: {
          authenticate: function(waidService){
            return waidService.authenticate();
          }
        }
      })
      .when('/profile/username/', {
        templateUrl: 'waid/profile/username.html',
        resolve: {
          authenticate: function(waidService){
            return waidService.authenticate();
          }
        }
      })
      .when('/profile/password/', {
        templateUrl: 'waid/profile/password.html',
        resolve: {
          authenticate: function(waidService){
            return waidService.authenticate();
          }
        }
      })
      .when('/profile/interests/', {
        templateUrl: 'waid/profile/interests.html',
        resolve: {
          authenticate: function(waidService){
            return waidService.authenticate();
          }
        }
      })
      .when('/profile/overview/', {
        templateUrl: 'waid/profile/overview.html',
        resolve: {
          authenticate: function(waidService){
            return waidService.authenticate();
          }
        }
      })
      .when('/al/:code/', {
        template: '',
        controller: 'AutoLoginCtrl'
      })
      .when('/', {
        templateUrl: 'waid/client/main.html',
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
      '/nl/api',
      config.accountId,
      config.applicationId
    );
    waidService.authenticate();
  }])
  .controller('MasterCtrl', function ($scope, $rootScope, $location, $window, waidService, growl, $routeParams, $log) {
    // Assume user is not logged in until we hear otherwise
    $rootScope.authenticated = false;
    $rootScope.showMenu = false;
    $rootScope.initialized = false;

    $rootScope.$on('waid.services.authenticate.ok', function(event, data) {
      $rootScope.authenticated = true;
      if ($location.path() == '/') {
        $location.path("/profile/overview/");
      }
    });

    $rootScope.$on('waid.services.authenticate.error', function(event, data) {
      if ($location.path() != '/') {
        $location.path("/");
      }
    });

    $rootScope.$watch('authenticated', function(){
      $scope.initVars();
    });


    $scope.initVars = function() {
      if ($rootScope.authenticated) {
        $rootScope.showMenu = true;
      } else {
        $rootScope.showMenu = false;
      }
    };

    $scope.loginCheck = function(data) {
      if (data.profile_status.length > 0) {
        if(data.profile_status.indexOf('email_is_not_verified') !== -1) {
          growl.addErrorMessage("Er is een activatie e-mail verstuurd. Controleer je e-mail om de login te verifieren.",  {ttl: -1});
          $location.path('/');
        }

        if(data.profile_status.indexOf('profile_ok') !== -1) {
          if ($location.path() != '/profile/overview/') {
            $location.path('/profile/overview/')
          }
        }
      }
    };

    $rootScope.$on('waid.services.application.userAutoLogin.get.ok', function(event, data) {
      $scope.loginCheck(data);
    });

    $rootScope.$on('waid.services.application.userAutoLogin.get.error', function(event, data) {
       $location.path("/");
    });

    $rootScope.$on('waid.services.application.userLogin.post.ok', function(event, data) {
      $scope.loginCheck(data);
    });

    $rootScope.$on('waid.services.application.userLogout.post.ok', function(event, data) {
      $rootScope.authenticated = false;
      $location.path("/");
    });
    $rootScope.$on('waid.services.application.userLogoutAll.post.ok', function(event, data) {
      $rootScope.authenticated = false;
      $location.path("/");
    });

    $scope.$on('waid.services.application.userProfile.get.ok', function(event, data) {
      $scope.userProfile = data;
    });

    $scope.$on('waid.services.application.userEmail.post.ok', function(event, data) {
      growl.addSuccessMessage("Nieuw e-mail adres toegevoegd, controleer je mail om deze te verifieren.",  {ttl: -1});
    });

    $scope.$on('waid.services.application.userProfile.patch.ok', function(event, data) {
      growl.addSuccessMessage("Profiel informatie opgeslagen");
    });

    $scope.$on('waid.services.application.userPassword.put.ok', function(event, data) {
      growl.addSuccessMessage("Wachtwoord is gewijzigd.");
    });

     $scope.$on('waid.services.application.userLostLogin.post.ok', function(event, data) {
      growl.addSuccessMessage("Instructies om in te loggen zijn naar jouw e-mail gestuurd.");
    });
    $scope.$on('waid.services.application.userRegister.post.ok', function(event, data) {
      growl.addSuccessMessage("Geregistreerd als nieuwe gebruiker! Controleer je mail om de account te verifieren.",  {ttl: -1});
      $scope.isRegister = true;
    });
    $scope.$on('waid.services.application.userCompleteProfile.post.ok', function(event, data) {
      $scope.loginCheck(data);
    });

    $scope.getMenuActiveClass = function (path) {
      return ($location.path().substr(0, path.length) === path) ? 'active' : '';
    }
  });
