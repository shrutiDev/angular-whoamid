'use strict';
angular.module('waid.core.directives', [
  'waid.core',
  'waid.core.controllers'
]).directive('waid', function (waidCore) {
  return {
    scope: {
      'config': '@',
      'applicationId': '@',
      'accountId': '@'
    },
    restrict: 'E',
    controller: 'WAIDCoreCtrl',
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.core.templates.core;
    }
  };
});