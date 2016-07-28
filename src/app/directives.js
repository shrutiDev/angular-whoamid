'use strict';

angular.module('waid.directives', ['waid.controllers',])
  .directive('waidComments', function () {
	return {
	  restrict: 'E',
      scope: {
        ordering:"@?",
        threadId:"@?",
        orderingEnabled:"=?",
      },
      controller: 'WAIDCommentsCtrl',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || 'waid/comments/main.html'
      }
    }
  })
  .directive('waidUserProfileMenu', function () {
  return {
    restrict: 'E',
      controller: 'UserProfileMenuCtrl',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || 'app/templates/user-profile-menu.html'
      }
    }
  })
  .directive('waidUserProfileButton', function () {
  return {
    restrict: 'E',
      controller: 'UserProfileMenuCtrl',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || 'app/templates/user-profile-button.html'
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