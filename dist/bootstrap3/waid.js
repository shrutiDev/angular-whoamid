'use strict';
angular.module('waid.core.app.strategy', [
  'waid.core',
  'waid.core.services',
  'ui.bootstrap',
  'angular-growl',
  'slugifier',
  'angular-confirm'
]).service('waidCoreAppStrategy', function ($q, $rootScope, $uibModal, waidCore, waidService, $location, $cookies, growl, Slug) {
  var emoticonsModalInstance = null;
  var termsAndConditionsModalInstance = null;
  var completeProfileModalInstance = null;
  var lostLoginModalInstance = null;
  var loginAndRegisterHomeModalInstance = null;
  var userProfileHomeModalInstance = null;
  var linkSocialProfileModalInstance = null;
  var loginCount = 0;



  var openLinkSocialProfileModal = function() {
    if (!linkSocialProfileModalInstance) {
      linkSocialProfileModalInstance = $uibModal.open({
        animation: true,
        templateUrl: waidCore.config.getTemplateUrl('idm', 'linkSocialProfileModal'),
        controller: 'WAIDIDMLinkSocialProfileCtrl',
        size: 'lg',
        backdrop: 'static'
      });
    }
  }

  var closeLinkSocialProfileModal = function (comment) {
    if (linkSocialProfileModalInstance) {
      linkSocialProfileModalInstance.dismiss('close');
      linkSocialProfileModalInstance = null
      $rootScope.$broadcast('waid.bootstrap3.strategy.closeLinkSocialProfileModal');
    }
  };

  var openEmoticonsModal = function (targetId, comment) {
    var input = document.getElementById(targetId);
    emoticonsModalInstance = $uibModal.open({
      animation: true,
      templateUrl: waidCore.config.getTemplateUrl('core', 'emoticonsModal'),
      controller: 'WAIDCoreEmoticonModalCtrl',
      resolve: {
        comment: function () {
          return comment;
        },
        selectionStart: function () {
          return input.selectionStart;
        }
      },
      size: 'lg',
      backdrop: 'static'
    });
    return emoticonsModalInstance.result;
  };
  var closeEmoticonsModal = function (comment) {
    if (emoticonsModalInstance) {
      if (typeof comment != 'undefined') {
        emoticonsModalInstance.close(comment);
      } else {
        emoticonsModalInstance.dismiss('close');
      }
      emoticonsModalInstance = null;
      $rootScope.$broadcast('waid.bootstrap3.strategy.closeEmoticonsModal');
    }
  };

  var openTermsAndConditionsModal = function (template) {
    termsAndConditionsModalInstance = $uibModal.open({
      animation: true,
      controller: 'WAIDIDMTermsAndConditionsCtrl',
      templateUrl: waidCore.config.getTemplateUrl('idm', 'termsAndConditionsModal'),
      size: 'lg',
      backdrop: 'static'
    });
  };
  var closeTermsAndConditionsModal = function () {
    if (termsAndConditionsModalInstance) {
      termsAndConditionsModalInstance.dismiss('close');
      termsAndConditionsModalInstance = null;
      $rootScope.$broadcast('waid.bootstrap3.strategy.closeTermsAndConditionsModal');
    }
  };
  var openCompleteProfileModal = function () {
    if (!completeProfileModalInstance) {
      completeProfileModalInstance = $uibModal.open({
        animation: true,
        templateUrl: waidCore.config.getTemplateUrl('idm', 'completeProfileModal'),
        controller: 'WAIDIDMCompleteProfileCtrl',
        size: 'lg',
        backdrop: 'static'
      });
    }
  };
  var closeCompleteProfileModal = function () {
    if (completeProfileModalInstance) {
      completeProfileModalInstance.dismiss('close');
      completeProfileModalInstance = null;
      $rootScope.$broadcast('waid.bootstrap3.strategy.closeCompleteProfileModal');
    }
  };
  var openLostLoginModal = function () {
    lostLoginModalInstance = $uibModal.open({
      animation: true,
      templateUrl: waidCore.config.getTemplateUrl('idm', 'lostLoginModal'),
      size: 'lg',
      backdrop: 'static'
    });
  };
  var closeLostLoginModal = function () {
    if (lostLoginModalInstance) {
      lostLoginModalInstance.dismiss('close');
      lostLoginModalInstance = null;
      $rootScope.$broadcast('waid.bootstrap3.strategy.closeLostLoginModal');
    }
  };
  var openLoginAndRegisterHomeModal = function () {
    loginAndRegisterHomeModalInstance = $uibModal.open({
      animation: true,
      templateUrl: waidCore.config.getTemplateUrl('idm', 'loginAndRegisterModal'),
      size: 'lg',
      backdrop: 'static'
    });
  };
  var closeLoginAndRegisterModal = function () {
    if (loginAndRegisterHomeModalInstance) {
      loginAndRegisterHomeModalInstance.dismiss('close');
      loginAndRegisterHomeModalInstance = null
      $rootScope.$broadcast('waid.bootstrap3.strategy.closeLoginAndRegisterModal');
    }
  };
  var openUserProfileHomeModal = function (fieldSet) {
    userProfileHomeModalInstance = $uibModal.open({
      animation: true,
      templateUrl: waidCore.config.getTemplateUrl('idm', 'userProfileModal'),
      size: 'lg',
      backdrop: 'static',
      controller : ["$scope", "currentFieldSet", function($scope, currentFieldSet) {
        $scope.currentFieldSet = currentFieldSet;
      }],
      resolve: {
        currentFieldSet: function () {
          return (typeof fieldSet == 'undefined') ? 'overview' : fieldSet;
        }
      }
    });
  };
  var closeUserProfileModal = function () {
    if (userProfileHomeModalInstance) {
      userProfileHomeModalInstance.dismiss('close');
      userProfileHomeModalInstance = null;
      $rootScope.$broadcast('waid.bootstrap3.strategy.closeUserProfileModal');
    }
  };


  var closeAllModals = function () {
    closeEmoticonsModal();
    closeTermsAndConditionsModal();
    closeCompleteProfileModal();
    closeLostLoginModal();
    closeLoginAndRegisterModal();
    closeUserProfileModal();
    closeLinkSocialProfileModal();
  };

  $rootScope.$on('waid.idm.strategy.openEmoticons', function (event, data) {
    openEmoticonsModal(data['targetId'], data['comment']);
  });

  $rootScope.$on('waid.core.strategy.openTermsAndConditions', function (event) {
    openTermsAndConditionsModal();
  });

  $rootScope.$on('waid.idm.strategy.openCompleteProfile', function (event) {
    openCompleteProfileModal();
  });

  $rootScope.$on('waid.idm.strategy.openLostLogin', function (event) {
    openLostLoginModal();
  });

  $rootScope.$on('waid.idm.strategy.openLoginAndRegisterHome', function (event) {
    openLoginAndRegisterHomeModal();
  });

  $rootScope.$on('waid.idm.strategy.openUserProfileHome', function (event, data) {
    openUserProfileHomeModal(data['fieldSet']);
  });

  $rootScope.$on('waid.idm.strategy.openLinkSocialProfile', function (event) {
    openLinkSocialProfileModal();
  });


  $rootScope.$on('waid.services.application.userCompleteProfile.post.ok', function (event, data) {
    // Reload profile info
    if (data.profile_status.indexOf('profile_ok') !== -1) {
      // Wait for data to be stored
      setTimeout(function () {
        waidService.authenticate();
      }, 1000);
    }
    closeCompleteProfileModal();
    if (data.profile_status.indexOf('email_is_not_verified') !== -1) {
      growl.addErrorMessage('Er is activatie e-mail verstuurd. Controleer je e-mail om de login te verifieren.', { ttl: -1 });
    }
  });

  $rootScope.$on('waid.core.strategy.profileCheck.completeProfile', function (event, data) {
    //console.log('waid.core.strategy.profileCheck.completeProfile');
    waidCore.openCompleteProfile();
  });

  $rootScope.$on('waid.core.strategy.profileCheck.linkProfile', function(event, data){
    //console.log('waid.core.strategy.profileCheck.linkProfile');
    waidCore.openLinkSocialProfile();
  });
  $rootScope.$on('waid.core.strategy.profileCheck.success', function (event, data) {
    //console.log('waid.core.strategy.profileCheck.success');
    growl.addSuccessMessage(waidCore.config.getConfig('idm.translations.loggedin_success'));
    closeAllModals();
  });
  $rootScope.$on('waid.services.application.userEmail.post.ok', function (event, data) {
    //console.log('waid.services.application.userEmail.post.ok');
    growl.addSuccessMessage('Nieuw e-mail adres toegevoegd, controleer je mail om deze te verifieren.', { ttl: -1 });
  });
  $rootScope.$on('waid.services.application.userProfile.patch.ok', function (event, data) {
    growl.addSuccessMessage('Profiel informatie opgeslagen');
  });
  $rootScope.$on('waid.services.application.userPassword.put.ok', function (event, data) {
    growl.addSuccessMessage('Wachtwoord is gewijzigd.');
  });
  $rootScope.$on('waid.services.application.userUsername.put.ok', function (event, data) {
    growl.addSuccessMessage('Gebruikersnaam is gewijzigd.');
  });
  $rootScope.$on('waid.services.application.userLostLogin.post.ok', function (event, data) {
    growl.addSuccessMessage('Instructies om in te loggen zijn naar jouw e-mail gestuurd.');
    //console.log('waid.services.application.userLostLogin.post.ok');
    closeAllModals();
  });
  $rootScope.$on('waid.services.application.userRegister.post.ok', function (event, data) {
    growl.addSuccessMessage('Je account is aangemaakt. Ga naar je mailbox om je account te verifiëren.', { ttl: -1 });
  });
  $rootScope.$on('waid.services.application.userRegister.post.ok', function (event, data) {
    //console.log('waid.services.application.userRegister.post.ok');
    closeAllModals();
  });
  $rootScope.$on('waid.services.application.userLogout.post.ok', function (event, data) {
    //console.log('waid.services.application.userLogout.post.ok');
    closeAllModals();
  });
  $rootScope.$on('waid.services.application.userLogoutAll.post.ok', function (event, data) {
    //console.log('waid.services.application.userLogoutAll.post.ok');
    closeAllModals();
  });
  $rootScope.$on('waid.idm.strategy.action.doNotLinkSocialProfile', function (event) {
    //console.log('waid.idm.strategy.action.doNotLinkSocialProfile');
    closeAllModals();
  });
  $rootScope.$on('waid.services.application.userLinkSocialProfile.post.ok', function (event, data) {
    closeAllModals();
  });

  $rootScope.$on('waid.services.application.userLogin.post.ok', function (event, data) {
    closeAllModals();
    //console.log('waid.services.application.userLogin.post.ok');
  });
  $rootScope.$on('waid.core.strategy.errorCode', function(event, data){
    growl.addErrorMessage(waidCore.config.getTranslation('idm', data.errorCode));
  });
  $rootScope.$on('waid.services.application.userLogin.post.error', function (event, data) {
    loginCount++;
    if (loginCount > 3) {
      waidCore.openLostLoginModal();
      loginCount = 0;
    }
  });
}).config([
  'growlProvider',
  function (growlProvider) {
    growlProvider.globalTimeToLive(5000);
  }
]);