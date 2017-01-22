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



  waidCore.openLinkSocialProfileModal = function() {
    if (!linkSocialProfileModalInstance) {
      linkSocialProfileModalInstance = $uibModal.open({
        appendTo: angular.element(document).find('#waid'),
        animation: true,
        templateUrl: waidCore.config.getTemplateUrl('idm', 'linkSocialProfileModal'),
        controller: 'WAIDIDMLinkSocialProfileCtrl',
        size: 'lg',
        backdrop: 'static'
      });
    }
  }

  waidCore.closeLinkSocialProfileModal = function (comment) {
    if (linkSocialProfileModalInstance) {
      linkSocialProfileModalInstance.dismiss('close');
      linkSocialProfileModalInstance = null
      $rootScope.$broadcast('waid.bootstrap3.strategy.closeLinkSocialProfileModal');
    }
  };

  waidCore.openEmoticonsModal = function (targetId, comment) {
    var input = document.getElementById(targetId);
    emoticonsModalInstance = $uibModal.open({
      appendTo: angular.element(document).find('#waid'),
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
  waidCore.closeEmoticonsModal = function (comment) {
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

  waidCore.openTermsAndConditionsModal = function (template) {
    termsAndConditionsModalInstance = $uibModal.open({
      appendTo: angular.element(document).find('#waid'),
      animation: true,
      controller: 'WAIDIDMTermsAndConditionsCtrl',
      templateUrl: waidCore.config.getTemplateUrl('idm', 'termsAndConditionsModal'),
      size: 'lg',
      backdrop: 'static'
    });
  };
  waidCore.closeTermsAndConditionsModal = function () {
    if (termsAndConditionsModalInstance) {
      termsAndConditionsModalInstance.dismiss('close');
      termsAndConditionsModalInstance = null;
      $rootScope.$broadcast('waid.bootstrap3.strategy.closeTermsAndConditionsModal');
    }
  };
  waidCore.openCompleteProfileModal = function () {
    if (!completeProfileModalInstance) {
      completeProfileModalInstance = $uibModal.open({
        appendTo: angular.element(document).find('#waid'),
        animation: true,
        templateUrl: waidCore.config.getTemplateUrl('idm', 'completeProfileModal'),
        controller: 'WAIDIDMCompleteProfileCtrl',
        size: 'lg',
        backdrop: 'static'
      });
    }
  };
  waidCore.closeCompleteProfileModal = function () {
    if (completeProfileModalInstance) {
      completeProfileModalInstance.dismiss('close');
      completeProfileModalInstance = null;
      $rootScope.$broadcast('waid.bootstrap3.strategy.closeCompleteProfileModal');
    }
  };
  waidCore.openLostLoginModal = function () {
    lostLoginModalInstance = $uibModal.open({
      appendTo: angular.element(document).find('#waid'),
      animation: true,
      templateUrl: waidCore.config.getTemplateUrl('idm', 'lostLoginModal'),
      size: 'lg',
      backdrop: 'static'
    });
  };
  waidCore.closeLostLoginModal = function () {
    if (lostLoginModalInstance) {
      lostLoginModalInstance.dismiss('close');
      lostLoginModalInstance = null;
      $rootScope.$broadcast('waid.bootstrap3.strategy.closeLostLoginModal');
    }
  };
  waidCore.openLoginAndRegisterHomeModal = function () {
    loginAndRegisterHomeModalInstance = $uibModal.open({
      appendTo: angular.element(document).find('#waid'),
      animation: true,
      templateUrl: waidCore.config.getTemplateUrl('idm', 'loginAndRegisterModal'),
      size: 'lg',
      backdrop: 'static'
    });
  };
  waidCore.closeLoginAndRegisterModal = function () {
    if (loginAndRegisterHomeModalInstance) {
      loginAndRegisterHomeModalInstance.dismiss('close');
      loginAndRegisterHomeModalInstance = null
      $rootScope.$broadcast('waid.bootstrap3.strategy.closeLoginAndRegisterModal');
    }
  };
  waidCore.openUserProfileHomeModal = function (fieldSet) {
    userProfileHomeModalInstance = $uibModal.open({
      appendTo: angular.element(document).find('#waid'),
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
  waidCore.closeUserProfileModal = function () {
    if (userProfileHomeModalInstance) {
      userProfileHomeModalInstance.dismiss('close');
      userProfileHomeModalInstance = null;
      $rootScope.$broadcast('waid.bootstrap3.strategy.closeUserProfileModal');
    }
  };


  waidCore.closeAllModals = function () {
    this.closeEmoticonsModal();
    this.closeTermsAndConditionsModal();
    this.closeCompleteProfileModal();
    this.closeLostLoginModal();
    this.closeLoginAndRegisterModal();
    this.closeUserProfileModal();
    this.closeLinkSocialProfileModal();
  };

  $rootScope.$on('waid.idm.strategy.openEmoticons', function (event, data) {
    waidCore.openEmoticonsModal(data['targetId'], data['comment']);
  });

  $rootScope.$on('waid.core.strategy.openTermsAndConditions', function (event) {
    waidCore.openTermsAndConditionsModal();
  });

  $rootScope.$on('waid.idm.strategy.openCompleteProfile', function (event) {
    waidCore.openCompleteProfileModal();
  });

  $rootScope.$on('waid.idm.strategy.openLostLogin', function (event) {
    waidCore.openLostLoginModal();
  });

  $rootScope.$on('waid.idm.strategy.openLoginAndRegisterHome', function (event) {
    waidCore.openLoginAndRegisterHomeModal();
  });

  $rootScope.$on('waid.idm.strategy.openUserProfileHome', function (event, data) {
    waidCore.openUserProfileHomeModal(data['fieldSet']);
  });

  $rootScope.$on('waid.idm.strategy.openLinkSocialProfile', function (event) {
    waidCore.openLinkSocialProfileModal();
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
    if (data.profile_status.indexOf('profile_ok') !== -1) {
      growl.addSuccessMessage('Je bent succesvol ingelogd.');
    } else {
      if (data.profile_status.indexOf('email_is_not_verified') !== -1) {
        growl.addErrorMessage('Er is activatie e-mail verstuurd. Controleer je e-mail om de login te verifieren.', { ttl: -1 });
      }
    }
  });

  $rootScope.$on('waid.core.strategy.profileCheck.completeProfile', function (event, data) {
    //console.log('waid.core.strategy.profileCheck.completeProfile');
    waidCore.openCompleteProfile();
  });

  $rootScope.$on('waid.services.application.userAutoLogin.get.ok', function (event, data) {
    var lastProfileFieldSet = waidCore.getLastProfileFieldSet();
    if (lastProfileFieldSet) {
      waidCore.openUserProfileHome(lastProfileFieldSet);
    }
    if (data.profile_status.indexOf('profile_ok') !== -1) {
      growl.addSuccessMessage('Je bent succesvol ingelogd.');
    }
  });

  $rootScope.$on('waid.services.application.userAutoLogin.get.error', function (event, data) {
    growl.addErrorMessage('Kon niet automatisch inloggen. Ons excuus voor het ongemak.');
  });

  $rootScope.$on('waid.core.strategy.profileCheck.linkProfile', function(event, data){
    //console.log('waid.core.strategy.profileCheck.linkProfile');
    waidCore.openLinkSocialProfile();
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
    waidCore.closeAllModals();
  });
  $rootScope.$on('waid.services.application.userRegister.post.ok', function (event, data) {
    growl.addSuccessMessage('Je account is aangemaakt. Ga naar je mailbox om je account te verifiëren.', { ttl: -1 });
  });
  $rootScope.$on('waid.services.application.userRegister.post.ok', function (event, data) {
    //console.log('waid.services.application.userRegister.post.ok');
    waidCore.closeLoginAndRegisterModal();
  });
  $rootScope.$on('waid.services.application.userLogout.post.ok', function (event, data) {
    //console.log('waid.services.application.userLogout.post.ok');
    waidCore.closeAllModals();
  });
  $rootScope.$on('waid.services.application.userLogoutAll.post.ok', function (event, data) {
    //console.log('waid.services.application.userLogoutAll.post.ok');
    waidCore.closeAllModals();
  });
  $rootScope.$on('waid.idm.strategy.action.doNotLinkSocialProfile', function (event) {
    //console.log('waid.idm.strategy.action.doNotLinkSocialProfile');
    // Remove inactive linked social profiles
    waidService.userLinkSocialProfileDelete();
    waidCore.closeLinkSocialProfileModal();
  });

  $rootScope.$on('waid.services.application.userLinkSocialProfile.post.ok', function (event, data) {
    if (data.profile_status.indexOf('profile_ok') !== -1) {
      growl.addSuccessMessage('Je bent succesvol ingelogd.');
    }
    waidCore.closeLinkSocialProfileModal();
  });


  $rootScope.$on('waid.services.application.userLogin.post.ok', function (event, data) {
    waidCore.closeLoginAndRegisterModal();
    if (data.profile_status.indexOf('profile_ok') !== -1) {
      growl.addSuccessMessage('Je bent succesvol ingelogd.');
    }
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