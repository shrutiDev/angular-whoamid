'use strict';
angular.module('waid.idm.directives', [
  'waid.core',
  'waid.idm.controllers'
]).directive('waidProfile', function (waidCore) {
  return {
    restrict: 'E',
    controller: 'WAIDIDMProfileCtrl',
    scope:{},
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('idm', 'profile');
    }
  };
}).directive('waidUserProfileNavbar', function (waidCore) {
  return {
    restrict: 'E',
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('idm', 'userProfileNavbar');
    }
  };
}).directive('waidUserProfileStatusButton', function (waidCore) {
  return {
    restrict: 'E',
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('idm', 'userProfileStatusButton');
    }
  };
}).directive('waidLoginAndRegisterHome', function (waidCore) {
  return {
    restrict: 'E',
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('idm', 'loginAndRegisterHome');
    }
  };
}).directive('waidLogin', function (waidCore) {
  return {
    restrict: 'E',
    controller:'WAIDIDMLoginCtrl',
    scope:{},
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('idm', 'login');
    }
  };
}).directive('waidRegister', function ($rootScope, waidCore) {
  return {
    restrict: 'E',
    controller: 'WAIDIDMRegisterCtrl',
    scope:{
      modus:'@'
    },
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('idm', 'register');
    }
  };
}).directive('waidSocialLogin', function (waidCore) {
  return {
    restrict: 'E',
    controller: 'WAIDIDMSocialCtrl',
    scope:{},
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('idm', 'socialLogin');
    }
  };
}).directive('waidLostLogin', function (waidCore) {
  return {
    restrict: 'E',
    controller: 'WAIDIDMLostLoginCtrl',
    scope:{},
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('idm', 'lostLogin');
    }
  };
});


