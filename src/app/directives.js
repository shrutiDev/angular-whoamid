'use strict';

angular.module('waid.directives', ['waid.controllers',])
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
        return attrs.templateUrl || 'app/templates/comments-home.html'
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
        return attrs.templateUrl || 'app/templates/user-profile-navbar.html'
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
        return attrs.templateUrl || 'app/templates/user-profile-status-button.html'
      }
    }
  })
  .directive('waidCommentsOrderButton', function () {
  return {
    restrict: 'E',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || 'app/templates/comments-order-button.html'
      }
    }
  });