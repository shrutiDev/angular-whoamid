'use strict';

angular.module('waid.core.controllers', ['waid.core.services', 'waid.idm.controllers'])
  .controller('WAIDCoreDefaultModalCtrl', function ($scope, $location, waidService,  $uibModalInstance) {
    $scope.close = function () {
      $uibModalInstance.dismiss('close');
    };
  })
  .controller('WAIDCoreEmoticonModalCtrl', function($scope, $rootScope){
    $scope.addEmoticon = function(emoticon) {
      $scope.text = emoticon;
    }
  })
  .controller('WAIDCoreCtrl', function ($scope, $rootScope, $location, $window, waidService, growl, $routeParams, $log,  $uibModal, $cookies) {
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
      'openEmoticonsModal':function(text) {
        $scope.openEmoticonsModal();
      },
      'closeEmoticonsModal':function(text){
        $scope.closeEmoticonsModal();
      },
      'getTranslation': function(module, key) {
      	if (typeof waid.config[module].translations[key] != 'undefined') {
      		return waid.config[module].translations[key];
      	} 
      	return 'Unknown key `' + key + '` for module `' + module + '`';
      },
      'clearAccount': function() {
        $scope.clearAccount();
      },
      'clearUser': function(){
        $scope.clearUser();
      },
      'getConfig': function(key) {
        console.log(key);
        return waid.config.getConfig(key);
      },
      'user': false,
      'account': false,
      'application': false
    };

    $scope.checkLoading = function(){
      if(waidService.running.length > 0) {
          return true;
      } 
      return false;
    }
    $rootScope.waid.account = {'id':angular.isDefined($scope.accountId) ? $scope.accountId : false};
    $rootScope.waid.application = {'id':angular.isDefined($scope.applicationId) ? $scope.applicationId : false};


    $rootScope.$watch('waid', function(waid){

      if (typeof waid != "undefined" && waid.account && waid.application) {
        waidService.authenticate();

        var waidAlCode = $location.search().waidAlCode; 
        if (waidAlCode) {
          waidService.userAutoLoginGet(waidAlCode).then(function(data) {
            $location.search('waidAlCode', null);
          });
        }
        

      }
    }, true);

    $scope.initRetrieveData = function(accountId, applicationId) {
      waidService.publicAccountGet(accountId).then(function(){
        var application = data.main_application;
        delete data.main_application

        $rootScope.waid.account = data;
        // TODO retrieve full application info
        $rootScope.waid.application = {'id':applicationId};

        $cookies.putObject('account', $rootScope.waid.account);
        $cookies.putObject('application', $rootScope.waid.application);
      });
    }

    $scope.initWaid = function() {
      // Init if account and app are fixed
      if ($scope.accountId && $scope.applicationId) {
        if ($cookies.getObject('account') && $cookies.getObject('application')) {
          try {
            $rootScope.waid.account = $cookies.getObject('account');
            $rootScope.waid.application = $cookies.getObject('application');
          } catch(err) {
            $scope.initRetrieveData($scope.accountId, $scope.applicationId);
          }
        } else {
          $scope.initRetrieveData($scope.accountId, $scope.applicationId);
        }
      } else {
        // Try to set by cookie
        if ($cookies.getObject('account') && $cookies.getObject('application')) {
            try {
              $rootScope.waid.account = $cookies.getObject('account');
              $rootScope.waid.application = $cookies.getObject('application');
            } catch(err) {
              $rootScope.waid.clearAccount();
              waidService._clearAuthorizationData();
            }
        } else {
          $rootScope.waid.clearAccount();
          waidService._clearAuthorizationData();
        }
      }
    }

    $scope.clearAccount = function() {
      $cookies.remove('account');
      $cookies.remove('application');
      $rootScope.waid.account = false;
      $rootScope.waid.application = false;
      $rootScope.waid.user = false;
      waidService._clearAuthorizationData();
    }


    $scope.clearUser = function() {
      $rootScope.waid.user = false;
      waidService._clearAuthorizationData();
    }

    $scope.openEmoticonsModal = function (text) {
       $scope.openEmoticonsModalInstance = $uibModal.open({
        animation: true,
        templateUrl: waid.config.getConfig('core.templates.emoticonsModal'),
        controller: 'WAIDCoreEmoticonModalCtrl',
        size: 'lg'
      });
    };

    $scope.closeEmoticonsModal = function () {
      if ($scope.openEmoticonsModalInstance) {
        $scope.openEmoticonsModalInstance.dismiss('close');
      }
    }

    $scope.openTermsAndConditionsModal = function (template) {
       $scope.openTermsAndConditionsModalInstance = $uibModal.open({
        animation: true,
        templateUrl: waid.config.getConfig('idm.templates.termsAndConditionsModal'),
        controller: 'WAIDCoreDefaultModalCtrl',
        size: 'lg'
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
        templateUrl: waid.config.getConfig('idm.templates.completeProfile'),
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
        templateUrl: waid.config.getConfig('idm.templates.lostLoginModal'),
        controller: 'WAIDCoreDefaultModalCtrl',
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
        templateUrl: waid.config.getConfig('idm.templates.loginAndRegisterModal'),
        controller: 'WAIDCoreDefaultModalCtrl',
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
        templateUrl: waid.config.getConfig('idm.templates.userProfileModal'),
        controller: 'WAIDCoreDefaultModalCtrl',
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
           growl.addSuccessMessage(waid.config.getConfig('core.translations.growlLoggedInSucces'));
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
      $rootScope.waid.user = false;
      $scope.closeAllModals();
    });

    $rootScope.$on('waid.services.application.userLogoutAll.post.ok', function(event, data) {
      $rootScope.authenticated = false;
      $rootScope.waid.user = false;
      $scope.closeAllModals();
    });

    $scope.$on('waid.services.application.userProfile.get.ok', function(event, data) {
      $rootScope.waid.user = data;
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

    // Main init
    $scope.initWaid();
  });