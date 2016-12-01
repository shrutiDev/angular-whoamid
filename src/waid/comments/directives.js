'use strict';
angular.module('waid.comments.directives', [
  'waid.core',
  'waid.comments.controllers'
]).directive('waidComments', function (waidCore, $window) {
  return {
    restrict: 'E',
    scope: {
      ordering: '@?',
      objectId: '@?',
      orderingEnabled: '@?'
    },
    controller: 'WAIDCommentsCtrl',
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('comments', 'commentsHome');
    },
    link: function ($scope, $element, attr){
      var isLoaded = false;

      // Main function to check if element is visible in viewport
      function elementInViewport(el) {
        var top = el.offsetTop;
        var left = el.offsetLeft;
        var width = el.offsetWidth;
        var height = el.offsetHeight;

        while(el.offsetParent) {
          el = el.offsetParent;
          top += el.offsetTop;
          left += el.offsetLeft;
        }
        var load = (
          top >= window.pageYOffset &&
          left >= window.pageXOffset &&
          (top + height) <= (window.pageYOffset + window.innerHeight) &&
          (left + width) <= (window.pageXOffset + window.innerWidth)
        );
        if (load) {
          $scope.loadComments();
          isLoaded = true;
        }
      };

      // on scroll check
      $(window).scroll(function(){
        if (!isLoaded) {
          elementInViewport($element[0]);
        }
      });

      // Intitial check
      elementInViewport($element[0]);
    }
  };
}).directive('waidCommentsOrderButton', function (waidCore) {
  return {
    restrict: 'E',
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('comments', 'commentsOrderButton');
    }
  };
}).directive('waidCommentsItem', function (waidCore) {
  return {
    scope:{
      'comment':'=',
      'markComment':'=',
      'editComment':'=',
      'deleteComment':'=',
      'voteComment':'=',
      'updateComment':'=',
      'addEmoji':'=',
      'waid':'='
    },
    restrict: 'E',
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('comments', 'commentsItem');
    }
  };
});