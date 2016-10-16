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
    }
  };
});