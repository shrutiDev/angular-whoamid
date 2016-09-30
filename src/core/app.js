'use strict';
angular.module('waid', [
  'ngCookies',
  'waid.core',
  'waid.core.strategy',
  'waid.core.services',
  'waid.core.controllers',
  'waid.core.directives',
  'waid.idm',
  'waid.comments'
]).run(function (waidCore, waidCoreStrategy, waidCoreAppStrategy, waidService) {
  waidCore.config.setConfig('api', {
    'environment': {
      'development': { 'url': 'http://dev.whoamid.com:8000/nl/api' },
      'test': { 'url': 'http://test.whoamid.com:8001/nl/api' },
      'staging': { 'url': 'http://test.whoamid.com:8002/nl/api' },
      'production': { 'url': 'http://eu.whoamid.com/nl/api' }
    }  // 'accountId' : 'efa26bbd-33dc-4148-b135-a1e9234e0fef',
       // 'applicationId' : 'c7d23002-da7d-4ad3-a665-9ae9de276c9e',
  });
  waidCore.config.setConfig('core', {
    'templates': {
      'core': '/core/bootstrap3/templates/core.html',
      'emoticonsModal': '/core/bootstrap3/templates/emoticons-modal.html',
      'modalWindow' : '/core/bootstrap3/templates/modal/window.html'
    },
    'errorCodes': {
      'auth-cancelled': 'Authentication was canceled by the user.',
      'auth-failed': 'Authentication failed for some reason.',
      'auth-unknown-error': 'An unknown error stoped the authentication process.',
      'auth-missing-parameter': 'A needed parameter to continue the process was missing, usually raised by the services that need some POST data like myOpenID.',
      'auth-state-missing': 'The state parameter is missing from the server response.',
      'auth-state-forbidden': 'The state parameter returned by the server is not the one sent.',
      'auth-token-error': 'Unauthorized or access token error, it was invalid, impossible to authenticate or user removed permissions to it.',
      'auth-already-associated': 'A different user has already associated the social account that the current user is trying to associate.',
      'system-error': 'System error, failed for some reason.'
    },
    'translations': {
      'emoticons_people': 'Mensen',
      'emoticons_nature': 'Natuur',
      'emoticons_objects': 'Objecten',
      'emoticons_places': 'Plaatsen'
    }
  });
  waidService.initialize();
});