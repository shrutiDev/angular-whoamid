'use strict';

angular.module('waid.idm.directives', ['waid.idm.controllers',])
  .directive('waid', function () {
  return {
    restrict: 'E',
      controller: 'WAIDIdmCtrl',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || waid.config.idm.templates.idm
      }
    }
  })
  .directive('waidComments', function () {
	return {
	  restrict: 'E',
      scope: {
        ordering:"@?",
        threadId:"@?",
        orderingEnabled:"=?",
        waid:"="
      },
      controller: 'WAIDCommentsCtrl',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || waid.config.idm.templates.commentsHome
      }
    }
  })
  .directive('waidUserProfileNavbar', function () {
  return {
    scope: {
      waid:"="
    },
    restrict: 'E',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || waid.config.idm.templates.userProfileNavbar
      }
    }
  })
  .directive('waidUserProfileStatusButton', function () {
  return {
    scope: {
      waid:"="
    },
    restrict: 'E',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || waid.config.idm.templates.userProfileStatusButton
      }
    }
  })
  .directive('waidCommentsOrderButton', function () {
  return {
    restrict: 'E',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || waid.config.idm.templates.commentsOrderButton
      }
    }
  });