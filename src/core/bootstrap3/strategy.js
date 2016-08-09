'use strict';
angular.module('waid.core.strategy', [])
  .service('waidCoreStrategy', function ($rootScope, $uibModal) {
    var emoticonsModalInstance = null;
    var termsAndConditionsModalInstance = null;
    var completeProfileModalInstance = null;
    var lostLoginModalInstance = null;
    var loginAndRegisterHomeModalInstance = null;
    var userProfileHomeModalInstance = null;

    var service = {
        'openEmoticonsModal': function (text) {
          emoticonsModalInstance = $uibModal.open({
            animation: true,
            templateUrl: waid.config.getConfig('core.templates.emoticonsModal'),
            controller: 'WAIDCoreEmoticonModalCtrl',
            size: 'lg'
          });
        },
        'closeEmoticonsModal': function () {
          if (emoticonsModalInstance) {
            emoticonsModalInstance.dismiss('close');
          }
        },
        'openTermsAndConditionsModal': function (template) {
           termsAndConditionsModalInstance = $uibModal.open({
            animation: true,
            templateUrl: waid.config.getConfig('idm.templates.termsAndConditionsModal'),
            controller: 'WAIDCoreDefaultModalCtrl',
            size: 'lg'
          });
        },
        'closeTermsAndConditionsModal': function () {
          if (termsAndConditionsModalInstance) {
            termsAndConditionsModalInstance.dismiss('close');
          }
        },
        'openCompleteProfileModal': function () {
          completeProfileModalInstance = $uibModal.open({
            animation: true,
            templateUrl: waid.config.getConfig('idm.templates.completeProfile'),
            controller: 'WAIDCompleteProfileCtrl',
            size: 'lg'
          });
        },
        'closeCompleteProfileModal': function () {
          if (completeProfileModalInstance) {
            completeProfileModalInstance.dismiss('close');
          }
        },
        'openLostLoginModal': function () {
          lostLoginModalInstance = $uibModal.open({
            animation: true,
            templateUrl: waid.config.getConfig('idm.templates.lostLoginModal'),
            controller: 'WAIDCoreDefaultModalCtrl',
            size: 'lg'
          });
        },
        'closeLostLoginModal':function() {
          if (lostLoginModalInstance) {
            lostLoginModalInstance.dismiss('close');
          }
        },
        'openLoginAndRegisterHomeModal':function () {
          loginAndRegisterHomeModalInstance = $uibModal.open({
            animation: true,
            templateUrl: waid.config.getConfig('idm.templates.loginAndRegisterModal'),
            controller: 'WAIDCoreDefaultModalCtrl',
            size: 'lg'
          });
        },
        'closeLoginAndRegisterModal': function() {
           if (loginAndRegisterHomeModalInstance) {
            loginAndRegisterHomeModalInstance.dismiss('close');
          }
        },
        'openUserProfileHomeModal': function () {
          userProfileHomeModalInstance = $uibModal.open({
            animation: true,
            templateUrl: waid.config.getConfig('idm.templates.userProfileModal'),
            controller: 'WAIDCoreDefaultModalCtrl',
            size: 'lg'
          });
        },
        'closeUserProfileModal':function() {
          if (userProfileHomeModalInstance) {
            userProfileHomeModalInstance.dismiss('close');
          }
        }
    }
    return service;
  });
