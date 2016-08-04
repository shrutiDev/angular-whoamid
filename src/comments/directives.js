'use strict';

angular.module('waid.comments.directives', ['waid.comments.controllers',])
  .directive('waidComments', function () {
  return {
    restrict: 'E',
      scope: {
        ordering:"@?",
        threadId:"@?",
        orderingEnabled:"=?"
      },
      controller: 'WAIDCommentsCtrl',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || waid.config.getConfig('comments.templates.commentsHome')
      }
    }
  })
  .directive('waidCommentsOrderButton', function () {
  return {
    restrict: 'E',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || waid.config.getConfig('comments.templates.commentsOrderButton')
      }
    }
  });