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
      controller: 'CommentsMainCtrl',
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
        return attrs.templateUrl || 'waid/user/mainprofilemenu.html'
      }
    }
  });