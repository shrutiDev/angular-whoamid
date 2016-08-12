'use strict';

angular.module('waid.idm.directives', ['waid.core', 'waid.idm.controllers',])
  .directive('waidUserProfileNavbar', function (waidCore) {
  return {
    restrict: 'E',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || waidCore.config.idm.templates.userProfileNavbar
      }
    }
  })
  .directive('waidUserProfileStatusButton', function (waidCore) {
  return {
    restrict: 'E',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || waidCore.config.idm.templates.userProfileStatusButton
      }
    }
  });