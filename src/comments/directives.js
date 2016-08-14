'use strict';
angular.module('waid.comments.directives', [
  'waid.core',
  'waid.comments.controllers'
]).directive('waidComments', function (waidCore) {
  return {
    restrict: 'E',
    scope: {
      ordering: '@?',
      threadId: '@?',
      orderingEnabled: '=?'
    },
    controller: 'WAIDCommentsCtrl',
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getConfig('comments.templates.commentsHome');
    }
  };
}).directive('waidCommentsOrderButton', function (waidCore) {
  return {
    restrict: 'E',
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getConfig('comments.templates.commentsOrderButton');
    }
  };
});