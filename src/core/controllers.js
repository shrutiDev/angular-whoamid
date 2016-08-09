'use strict';

angular.module('waid.core.controllers', ['waid.core.services', 'waid.idm.controllers', 'waid.core.strategy'])
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
  .controller('WAIDCoreCtrl', function ($scope, $rootScope, $location, $window, waidService, growl, $routeParams, $log,  waidCoreStrategy, $cookies) {
    // Assume user is not logged in until we hear otherwise
    $rootScope.waid = {
      'logout' : function() {
        waidService.userLogoutPost();
      },
      'logoutAll' : function() {
        waidService.userLogoutAllPost();
      },
      'openLoginAndRegisterHomeModal' : function() {
        waidCoreStrategy.openLoginAndRegisterHomeModal();
      },
      'openUserProfileHomeModal' : function() {
        waidCoreStrategy.openUserProfileHomeModal();
      },
      'openLostLoginModal' : function() {
        this.closeAllModals();
        waidCoreStrategy.openLostLoginModal();
      },
      'openTermsAndConditionsModal' : function() {
        waidCoreStrategy.openTermsAndConditionsModal();
      },
      'openEmoticonsModal':function(text) {
        waidCoreStrategy.openEmoticonsModal(text);
      },
      'closeEmoticonsModal':function(){
        waidCoreStrategy.closeEmoticonsModal();
      },
      'closeAllModals':function(){
        waidCoreStrategy.closeUserProfileModal();
        waidCoreStrategy.closeLoginAndRegisterModal();
        waidCoreStrategy.closeLostLoginModal();
        waidCoreStrategy.closeTermsAndConditionsModal();
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

    $rootScope.authenticated = false;

    $rootScope.$on('waid.services.authenticate.ok', function(event, data) {
      $rootScope.authenticated = true;
    });

    $scope.loginCheck = function(data) {
      
      if (typeof data.profile_status != "undefined" && data.profile_status.length > 0) {
        if(data.profile_status.indexOf('profile_ok') !== -1) {
           growl.addSuccessMessage(waid.config.getConfig('core.translations.growlLoggedInSucces'));
           $rootScope.waid.closeAllModals();
        }

        if(typeof data.profile_status != "undefined" && data.profile_status.indexOf('missing_profile_data') !== -1) {
          $rootScope.waid.closeAllModals();
          $rootScope.openCompleteProfileModal();
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
      $rootScope.waid.closeAllModals();
    });

    $rootScope.$on('waid.services.application.userLogoutAll.post.ok', function(event, data) {
      $rootScope.authenticated = false;
      $rootScope.waid.user = false;
      $rootScope.waid.closeAllModals();
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
      $rootScope.waid.closeAllModals();
    });
    $scope.$on('waid.services.application.userRegister.post.ok', function(event, data) {
      growl.addSuccessMessage("Geregistreerd als nieuwe gebruiker! Controleer je mail om de account te verifieren.",  {ttl: -1});
      $scope.isRegister = true;
    });

    // Main init
    $scope.initWaid();
  });