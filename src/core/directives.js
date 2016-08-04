'use strict';

angular.module('waid.core.directives', ['waid.core.controllers',])
  .directive('waid', function () {
  return {
    restrict: 'E',
      controller: 'WAIDCoreCtrl',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || waid.config.core.templates.core
      }
    }
  });