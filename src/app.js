'use strict';

angular.module('app', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'waid.controllers',
  'waid.services',
  'waid.directives',
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
      .when('/page/:page/', {
        templateUrl: 'app/templates/page.html',
        controller: 'WAIDPageCtrl'
      })
      .when('/', {
        templateUrl: 'app/templates/home.html',
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
      config.apiUrl,
      config.accountId,
      config.applicationId
    );
    waidService.authenticate();
  }])
  .controller('WAIDMasterCtrl', function ($scope, $rootScope, $location, $window, waidService, growl, $routeParams, $log,  $uibModal) {
    // Assume user is not logged in until we hear otherwise
    $rootScope.waid = {
      'logout' : function() {
        waidService.userLogoutPost();
      },
      'logoutAll' : function() {
        waidService.userLogoutAllPost();
      },
      'openLoginAndRegisterHomeModal' : function() {
        $scope.openLoginAndRegisterHomeModal();
      },
      'openUserProfileHomeModal' : function() {
        $scope.openUserProfileHomeModal();
      },
      'openLostLoginModal' : function() {
        $scope.openLostLoginModal();
      },
      'openTermsAndConditionsModal' : function() {
        $scope.openTermsAndConditionsModal();
      },
      'user': false
    };

    var waidAlCode = $location.search().waidAlCode; 
    if (waidAlCode) {
      waidService.userAutoLoginGet(waidAlCode).then(function(data) {
        
      });
    }

    waidService.userProfileGet();



    $scope.openTermsAndConditionsModal = function (template) {
       $scope.openTermsAndConditionsModalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/templates/terms-and-conditions-modal.html',
        controller: 'DefaultModalCtrl',
        size: 'lg',
        resolve: {
          application: function () {
            return $scope.application;
          }
        }
      });
    };

    $scope.closeTermsAndConditionsModal = function () {
      if ($scope.openTermsAndConditionsModalInstance) {
        $scope.openTermsAndConditionsModalInstance.dismiss('close');
      }
    }

    $scope.openCompleteProfileModal = function () {
      $scope.openCompleteProfileModalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/templates/complete-profile.html',
        controller: 'WAIDCompleteProfileCtrl',
        size: 'lg'
      });
    }

    $scope.closeCompleteProfileModal = function () {
      if ($scope.openCompleteProfileModalInstance) {
        $scope.openCompleteProfileModalInstance.dismiss('close');
      }
    }

    $scope.openLostLoginModal = function () {
      $scope.closeAllModals();
      $scope.lostLoginModalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/templates/lost-login-modal.html',
        controller: 'DefaultModalCtrl',
        size: 'lg'
      });
    }

    $scope.closeLostLoginModal = function() {
      if ($scope.lostLoginModalInstance) {
        $scope.lostLoginModalInstance.dismiss('close');
      }
    }

    $scope.openLoginAndRegisterHomeModal = function () {
      $scope.loginAndRegisterHomeModalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/templates/login-and-register-modal.html',
        controller: 'DefaultModalCtrl',
        size: 'lg'
      });
    }

    $scope.closeLoginAndRegisterModal = function() {
       if ($scope.loginAndRegisterHomeModalInstance) {
        $scope.loginAndRegisterHomeModalInstance.dismiss('close');
      }
    }

    $scope.openUserProfileHomeModal = function () {
      $scope.userProfileHomeModalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'app/templates/user-profile-modal.html',
        controller: 'DefaultModalCtrl',
        size: 'lg'
      });
    }

    $scope.closeUserProfileModal = function() {
      if ($scope.userProfileHomeModalInstance) {
        $scope.userProfileHomeModalInstance.dismiss('close');
      }
    }
  
    $scope.closeAllModals = function(){
      $scope.closeUserProfileModal();
      $scope.closeLoginAndRegisterModal();
      $scope.closeLostLoginModal();
      $scope.closeTermsAndConditionsModal();
    }

    $rootScope.authenticated = false;

    $rootScope.$on('waid.services.authenticate.ok', function(event, data) {
      $rootScope.authenticated = true;
    });

    $scope.loginCheck = function(data) {
      
      if (typeof data.profile_status != "undefined" && data.profile_status.length > 0) {
        if(data.profile_status.indexOf('profile_ok') !== -1) {
           growl.addSuccessMessage("Succesvol ingelogd.");
           $scope.closeAllModals();
        }

        if(typeof data.profile_status != "undefined" && data.profile_status.indexOf('missing_profile_data') !== -1) {
          $scope.closeAllModals();
          $scope.openCompleteProfileModal();
        }
      }
    };

    $rootScope.$on('waid.services.application.userAutoLogin.get.ok', function(event, data) {
      $scope.loginCheck(data);
    });

    $rootScope.$on('waid.services.application.userAutoLogin.get.error', function(event, data) {
    });

    $rootScope.$on('waid.services.application.userLogin.post.ok', function(event, data) {
      $scope.loginCheck(data);
    });

    $rootScope.$on('waid.services.application.userLogout.post.ok', function(event, data) {
      $rootScope.authenticated = false;
      $scope.waid.user = false;
      $scope.closeAllModals();
    });

    $rootScope.$on('waid.services.application.userLogoutAll.post.ok', function(event, data) {
      $rootScope.authenticated = false;
      $scope.waid.user = false;
      $scope.closeAllModals();
    });

    $scope.$on('waid.services.application.userProfile.get.ok', function(event, data) {
      $scope.waid.user = data;
    });

    $scope.$on('waid.services.application.userCompleteProfile.post.ok', function(event, data) {
      // Reload profile info
      if (data.profile_status.indexOf('profile_ok') !== -1) {
        // Wait for data to be stored
        setTimeout(function() {
          waidService.userProfileGet();
        }, 1000);
      }
      $scope.closeCompleteProfileModal();
      if(data.profile_status.indexOf('email_is_not_verified') !== -1) {
          growl.addErrorMessage("Er is activatie e-mail verstuurd. Controleer je e-mail om de login te verifieren.",  {ttl: -1});
          console.log('Do....');
      }
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
      $scope.closeAllModals();
    });
    $scope.$on('waid.services.application.userRegister.post.ok', function(event, data) {
      growl.addSuccessMessage("Geregistreerd als nieuwe gebruiker! Controleer je mail om de account te verifieren.",  {ttl: -1});
      $scope.isRegister = true;
    });

  });
