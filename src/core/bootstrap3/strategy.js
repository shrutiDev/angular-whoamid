'use strict';
angular.module('waid.core.strategy', ['waid.core', 'waid.core.services'])
  .service('waidCoreStrategy', function ($rootScope, $uibModal, waidCore, waidService, $location) {
    var emoticonsModalInstance = null;
    var termsAndConditionsModalInstance = null;
    var completeProfileModalInstance = null;
    var lostLoginModalInstance = null;
    var loginAndRegisterHomeModalInstance = null;
    var userProfileHomeModalInstance = null;


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

    $rootScope.$watch('waid', function(waid){
      if (typeof waid != "undefined" && !waid.isInit) {
        if (waid.account && waid.application) {
          waid.isInit = true;
          waidService.authenticate();
          var waidAlCode = $location.search().waidAlCode; 
          if (waidAlCode) {
            waidService.userAutoLoginGet(waidAlCode).then(function(data) {
              $location.search('waidAlCode', null);
            });
          }
        }
      }
    }, true);

  });
