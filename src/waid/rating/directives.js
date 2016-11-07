'use strict';
angular.module('waid.rating.directives', [
  'waid.core',
  'waid.rating.controllers'
]).directive('waidRating', function (waidCore) {
  return {
    restrict: 'E',
    scope: { objectId: '@?' },
    controller: 'WAIDRatingCtrl',
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('rating', 'ratingWidget');
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
          $scope.loadRating();
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
});