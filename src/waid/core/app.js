'use strict';
angular.module('waid', [
  'ngCookies',
  'waid.core',
  'waid.core.strategy',
  'waid.core.services',
  'waid.core.controllers',
  'waid.core.directives',
  'waid.idm',
  'waid.comments',
  'waid.rating',
  'monospaced.elastic',
  'LocalStorageModule'
]).run(function (waidCore, waidCoreStrategy, waidCoreAppStrategy, waidService) {
  waidCore.config.baseTemplatePath = '';
  waidCore.config.version = '0.0.37';
  waidCore.config.setConfig('api', {
    'environment': {
      'development': { 'url': 'dev.whoamid.com:8000/nl/api' },
      'test': { 'url': 'test.whoamid.com:8001/nl/api' },
      'staging': { 'url': 'test.whoamid.com:8002/nl/api' },
      'production': { 'url': 'eu.whoamid.com/nl/api' }
    }  // 'accountId' : 'efa26bbd-33dc-4148-b135-a1e9234e0fef',
       // 'applicationId' : 'c7d23002-da7d-4ad3-a665-9ae9de276c9e',
  });
  waidCore.config.setConfig('core', {
    'templates': {
      'core': '/templates/core/core.html',
      'emoticonsModal': '/templates/core/emoticons-modal.html',
      'modalWindow': '/templates/core/modal/window.html'
    },
    'translations': {
      'emoticons_people': 'Mensen',
      'emoticons_nature': 'Natuur',
      'emoticons_objects': 'Objecten',
      'emoticons_places': 'Plaatsen',
      'terms_and_conditions': ''
    }
  });
  if (window.location.port == '8080' || window.location.port == '8000') {
    var url = waidCore.config.getConfig('api.environment.development.url');
  } else if (window.location.port == '8001') {
    var url = waidCore.config.getConfig('api.environment.test.url');
  } else if (window.location.port == '8002') {
    var url = waidCore.config.getConfig('api.environment.staging.url');
  } else {
    var url = waidCore.config.getConfig('api.environment.production.url');
  }
  waidService.initialize(url);
});