'use strict';
angular.module('waid.core.strategy', ['waid.core', 'waid.core.services'])
  .service('waidCoreStrategy', function ($rootScope, $uibModal, waidCore, waidService, $location, $cookies, growl) {
    var emoticonsModalInstance = null;
    var termsAndConditionsModalInstance = null;
    var completeProfileModalInstance = null;
    var lostLoginModalInstance = null;
    var loginAndRegisterHomeModalInstance = null;
    var userProfileHomeModalInstance = null;

    waidCore.checkLoading = function(){
      if(waidService.running.length > 0) {
          return true;
      } 
      return false;
    }

    waidCore.logout = function() {
       waidService.userLogoutPost();
    };
    
    waidCore.logoutAll = function() {
      waidService.userLogoutAllPost();
    };

    waidCore.addEmoticon = function(emoticon) {
      var input = document.getElementById(this.targetId);
      input.value = [input.value.slice(0, input.selectionStart), emoticon, input.value.slice(input.selectionStart)].join('');
      input.focus();
      $rootScope.waid.closeEmoticonsModal();
    }

    waidCore.closeAllModals = function() {
      this.closeEmoticonsModal();
      this.closeTermsAndConditionsModal();
      this.closeCompleteProfileModal();
      this.closeLostLoginModal();
      this.closeLoginAndRegisterModal();
      this.closeUserProfileModal();
    };

    waidCore.openEmoticonsModal = function (targetId) {
      this.targetId = targetId;
      emoticonsModalInstance = $uibModal.open({
        animation: true,
        templateUrl: waidCore.config.getConfig('core.templates.emoticonsModal'),
        controller: 'WAIDCoreEmoticonModalCtrl',
        size: 'lg'
      });
    };

    waidCore.closeEmoticonsModal = function () {
      if (emoticonsModalInstance) {
        emoticonsModalInstance.dismiss('close');
      }
    };

    waidCore.openTermsAndConditionsModal = function (template) {
       termsAndConditionsModalInstance = $uibModal.open({
        animation: true,
        templateUrl: waidCore.config.getConfig('idm.templates.termsAndConditionsModal'),
        controller: 'WAIDCoreDefaultModalCtrl',
        size: 'lg'
      });
    };

    waidCore.closeTermsAndConditionsModal = function () {
      if (termsAndConditionsModalInstance) {
        termsAndConditionsModalInstance.dismiss('close');
      }
    };

    waidCore.openCompleteProfileModal = function () {
      completeProfileModalInstance = $uibModal.open({
        animation: true,
        templateUrl: waidCore.config.getConfig('idm.templates.completeProfile'),
        controller: 'WAIDCompleteProfileCtrl',
        size: 'lg'
      });
    };

    waidCore.closeCompleteProfileModal = function () {
      if (completeProfileModalInstance) {
        completeProfileModalInstance.dismiss('close');
      }
    };

    waidCore.openLostLoginModal = function () {
      lostLoginModalInstance = $uibModal.open({
        animation: true,
        templateUrl: waidCore.config.getConfig('idm.templates.lostLoginModal'),
        controller: 'WAIDCoreDefaultModalCtrl',
        size: 'lg'
      });
    };

    waidCore.closeLostLoginModal = function() {
      if (lostLoginModalInstance) {
        lostLoginModalInstance.dismiss('close');
      }
    };

    waidCore.openLoginAndRegisterHomeModal = function () {
      loginAndRegisterHomeModalInstance = $uibModal.open({
        animation: true,
        templateUrl: waidCore.config.getConfig('idm.templates.loginAndRegisterModal'),
        controller: 'WAIDCoreDefaultModalCtrl',
        size: 'lg'
      });
    };

    waidCore.closeLoginAndRegisterModal = function() {
       if (loginAndRegisterHomeModalInstance) {
        loginAndRegisterHomeModalInstance.dismiss('close');
      }
    };

    waidCore.openUserProfileHomeModal = function () {
      userProfileHomeModalInstance = $uibModal.open({
        animation: true,
        templateUrl: waidCore.config.getConfig('idm.templates.userProfileModal'),
        controller: 'WAIDCoreDefaultModalCtrl',
        size: 'lg'
      });
    };

    waidCore.closeUserProfileModal = function() {
      if (userProfileHomeModalInstance) {
        userProfileHomeModalInstance.dismiss('close');
      }
    }

    var initRetrieveData = function(accountId, applicationId) {
      waidService.publicAccountGet(accountId).then(function(){
        var application = data.main_application;
        delete data.main_application

        waidCore.account = data;
        // TODO retrieve full application info
        waidCore.application = {'id':applicationId};

        $cookies.putObject('account', waidCore.account);
        $cookies.putObject('application', waidCore.application);
      });
    }
    
    waidCore.init = function() {
      // Init if account and app are fixed
      if (waidCore.account.id && waidCore.application.id) {
        if ($cookies.getObject('account') && $cookies.getObject('application')) {
          try {
            waidCore.account = $cookies.getObject('account');
            waidCore.application = $cookies.getObject('application');
          } catch(err) {
            initRetrieveData(waidCore.account.id, waidCore.application.id);
          }
        } else {
          initRetrieveData(waidCore.account.id, waidCore.application.id);
        }
      } else {
        // Try to set by cookie
        if ($cookies.getObject('account') && $cookies.getObject('application')) {
            try {
              waidCore.account = $cookies.getObject('account');
              waidCore.application = $cookies.getObject('application');
            } catch(err) {
              waidCore.clearAccount();
              waidService._clearAuthorizationData();
            }
        } else {
          waidCore.clearAccount();
          waidService._clearAuthorizationData();
        }
      }
    }

    waidCore.loginCheck = function(data) {
      if (typeof data.profile_status != "undefined" && data.profile_status.length > 0) {
        if(data.profile_status.indexOf('profile_ok') !== -1) {
           growl.addSuccessMessage(waidCore.config.getConfig('core.translations.growlLoggedInSucces'));
           waidCore.closeAllModals();
        }

        if(typeof data.profile_status != "undefined" && data.profile_status.indexOf('missing_profile_data') !== -1) {
          waidCore.closeAllModals();
          waidCore.openCompleteProfileModal();
        }
      }
    };

    $rootScope.$on('waid.services.application.userCompleteProfile.post.ok', function(event, data) {
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

    $rootScope.$on('waid.services.application.userEmail.post.ok', function(event, data) {
      growl.addSuccessMessage("Nieuw e-mail adres toegevoegd, controleer je mail om deze te verifieren.",  {ttl: -1});
    });

    $rootScope.$on('waid.services.application.userProfile.patch.ok', function(event, data) {
      growl.addSuccessMessage("Profiel informatie opgeslagen");
    });

    $rootScope.$on('waid.services.application.userPassword.put.ok', function(event, data) {
      growl.addSuccessMessage("Wachtwoord is gewijzigd.");
    });

    $rootScope.$on('waid.services.application.userLostLogin.post.ok', function(event, data) {
      growl.addSuccessMessage("Instructies om in te loggen zijn naar jouw e-mail gestuurd.");
      waidCore.closeAllModals();
    });

    $rootScope.$on('waid.services.application.userRegister.post.ok', function(event, data) {
      growl.addSuccessMessage("Geregistreerd als nieuwe gebruiker! Controleer je mail om de account te verifieren.",  {ttl: -1});
    });

    $rootScope.$on('waid.services.application.userRegister.post.ok', function(event, data) {
      waidCore.closeAllModals();
    });

    $rootScope.$on('waid.services.application.userProfile.get.ok', function(event, data) {
      waidCore.user = data;
    });

    $rootScope.$on('waid.services.application.userLogout.post.ok', function(event, data) {
      waidCore.user = false;
      waidCore.closeAllModals();
    });

    $rootScope.$on('waid.services.application.userLogoutAll.post.ok', function(event, data) {
      waidCore.user = false;
      waidCore.closeAllModals();
    });

    $rootScope.$on('waid.services.application.userAutoLogin.get.ok', function(event, data) {
      waidCore.loginCheck(data);
    });

    $rootScope.$on('waid.services.application.userLogin.post.ok', function(event, data) {
      waidCore.loginCheck(data);
    });

  });
