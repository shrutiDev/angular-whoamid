'use strict';
angular.module('waid.core.app.strategy', [
  'waid.core',
  'waid.core.services',
  'ui.bootstrap',
  'angular-growl'
]).service('waidCoreAppStrategy', function ($rootScope, $uibModal, waidCore, waidService, $location, $cookies, growl) {
  var emoticonsModalInstance = null;
  var termsAndConditionsModalInstance = null;
  var completeProfileModalInstance = null;
  var lostLoginModalInstance = null;
  var loginAndRegisterHomeModalInstance = null;
  var userProfileHomeModalInstance = null;
  waidCore.checkIfModalIsOpen = function (modal) {
    if (modal == 'completeProfile' && completeProfileModalInstance) {
      return true;
    }
    return false;
  };
  waidCore.closeAllModals = function () {
    this.closeEmoticonsModal();
    this.closeTermsAndConditionsModal();
    this.closeCompleteProfileModal();
    this.closeLostLoginModal();
    this.closeLoginAndRegisterModal();
    this.closeUserProfileModal();
  };
  waidCore.openEmoticonsModal = function (targetId) {
    $rootScope.targetId = targetId;
    emoticonsModalInstance = $uibModal.open({
      animation: true,
      templateUrl: waidCore.config.getConfig('core.templates.emoticonsModal'),
      controller: 'WAIDCoreEmoticonModalCtrl',
      size: 'lg',
      backdrop: 'static'
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
      size: 'lg',
      backdrop: 'static'
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
      controller: 'WAIDIDMCompleteProfileCtrl',
      size: 'lg',
      backdrop: 'static'
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
      size: 'lg',
      backdrop: 'static'
    });
  };
  waidCore.closeLostLoginModal = function () {
    if (lostLoginModalInstance) {
      lostLoginModalInstance.dismiss('close');
    }
  };
  waidCore.openLoginAndRegisterHomeModal = function () {
    loginAndRegisterHomeModalInstance = $uibModal.open({
      animation: true,
      templateUrl: waidCore.config.getConfig('idm.templates.loginAndRegisterModal'),
      size: 'lg',
      backdrop: 'static'
    });
  };
  waidCore.closeLoginAndRegisterModal = function () {
    if (loginAndRegisterHomeModalInstance) {
      loginAndRegisterHomeModalInstance.dismiss('close');
    }
  };
  waidCore.openUserProfileHomeModal = function () {
    userProfileHomeModalInstance = $uibModal.open({
      animation: true,
      templateUrl: waidCore.config.getConfig('idm.templates.userProfileModal'),
      size: 'lg',
      backdrop: 'static'
    });
  };
  waidCore.closeUserProfileModal = function () {
    if (userProfileHomeModalInstance) {
      userProfileHomeModalInstance.dismiss('close');
    }
  };
  $rootScope.$on('waid.services.request.error', function (event, data) {
    if (waidService.token && waidCore.checkIfModalIsOpen('completeProfile') == false) {
      waidService.userCompleteProfileGet().then(function (data) {
        waidCore.loginCheck(data);
      });
    }
  });
  $rootScope.$on('waid.services.application.userCompleteProfile.post.ok', function (event, data) {
    // Reload profile info
    if (data.profile_status.indexOf('profile_ok') !== -1) {
      // Wait for data to be stored
      setTimeout(function () {
        waidService.authenticate();
      }, 1000);
    }
    waidCore.closeCompleteProfileModal();
    if (data.profile_status.indexOf('email_is_not_verified') !== -1) {
      growl.addErrorMessage('Er is activatie e-mail verstuurd. Controleer je e-mail om de login te verifieren.', { ttl: -1 });
    }
  });
  $rootScope.$on('waid.core.strategy.loginCheck.completeProfile', function (event, data) {
    waidCore.closeAllModals();
    waidCore.openCompleteProfileModal();
  });
  $rootScope.$on('waid.core.strategy.loginCheck.success', function (event, data) {
    growl.addSuccessMessage(waidCore.config.getConfig('idm.translations.loggedin_success'));
    waidCore.closeAllModals();
  });
  $rootScope.$on('waid.services.application.userEmail.post.ok', function (event, data) {
    growl.addSuccessMessage('Nieuw e-mail adres toegevoegd, controleer je mail om deze te verifieren.', { ttl: -1 });
  });
  $rootScope.$on('waid.services.application.userProfile.patch.ok', function (event, data) {
    waidCore.user = data;
    growl.addSuccessMessage('Profiel informatie opgeslagen');
  });
  $rootScope.$on('waid.services.application.userProfile.get.ok', function (event, data) {
    waidCore.user = data;
  });
  $rootScope.$on('waid.services.application.userPassword.put.ok', function (event, data) {
    growl.addSuccessMessage('Wachtwoord is gewijzigd.');
  });
  $rootScope.$on('waid.services.application.userUsername.put.ok', function (event, data) {
    growl.addSuccessMessage('Gebruikersnaam is gewijzigd.');
  });
  $rootScope.$on('waid.services.application.userLostLogin.post.ok', function (event, data) {
    growl.addSuccessMessage('Instructies om in te loggen zijn naar jouw e-mail gestuurd.');
    waidCore.closeAllModals();
  });
  $rootScope.$on('waid.services.application.userRegister.post.ok', function (event, data) {
    growl.addSuccessMessage('Geregistreerd als nieuwe gebruiker! Controleer je mail om de account te verifieren.', { ttl: -1 });
  });
  $rootScope.$on('waid.services.application.userRegister.post.ok', function (event, data) {
    waidCore.closeAllModals();
  });
  $rootScope.$on('waid.services.application.userLogout.post.ok', function (event, data) {
    waidCore.closeAllModals();
  });
  $rootScope.$on('waid.services.application.userLogoutAll.post.ok', function (event, data) {
    waidCore.closeAllModals();
  });
  $rootScope.$on('waid.services.application.userAutoLogin.get.ok', function (event, data) {
    waidCore.loginCheck(data);
  });
  $rootScope.$on('waid.services.application.userLogin.post.ok', function (event, data) {
    waidCore.loginCheck(data);
  });
});