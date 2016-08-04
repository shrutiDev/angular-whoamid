'use strict';

angular.module('waid.idm.directives', ['waid.idm.controllers',])
  .directive('waidUserProfileNavbar', function () {
  return {
    restrict: 'E',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || waid.config.idm.templates.userProfileNavbar
      }
    }
  })
  .directive('waidUserProfileStatusButton', function () {
  return {
    restrict: 'E',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || waid.config.idm.templates.userProfileStatusButton
      }
    }
  });