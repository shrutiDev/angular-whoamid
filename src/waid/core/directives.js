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
      return attrs.templateUrl || waidCore.config.getTemplateUrl('core', 'core');
    }
  };
}).directive('waidTermsAndContitions', function (waidCore) {
  return {
    restrict: 'E',
    template: waidCore.config.getTranslation('core', 'terms_and_conditions')
  };
});