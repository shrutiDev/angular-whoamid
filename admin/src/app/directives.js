'use strict';
angular.module('waid.admin.directives', [
  'waid',
  'waid.admin.controllers'
]).directive('waidAdminApplicationEmailAction', function (waidCore) {
  return {
    scope: {
      'application': '=',
      'fieldName': '@'
    },
    'controller':'AdminApplicationEmailActionCtrl',
    restrict: 'E',
    templateUrl: function (elem, attrs) {
      return '/app/templates/application-email-action.html'
    }
  };
});