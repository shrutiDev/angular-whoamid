'use strict';
angular.module('waid.core.directives', [
  'waid.core',
  'waid.core.controllers',
  'waid.core.services'
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
}).directive('waidTranslation', function (waidCore) {
  return {
    restrict: 'E',
    template: function(elem, attr){
      return waidCore.config.getTranslation(attr.module, attr.key)
    }
  };
}).directive('waidRenderTemplate', function (waidCore, waidService, $q) {
  return {
    restrict: 'E',
    template: function(elem, attr) {
      return attr.template;
    }
  };
});