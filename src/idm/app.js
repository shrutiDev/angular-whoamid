'use strict';
angular.module('waid.idm', [
  'waid.templates',
  'waid.core',
  'waid.idm.controllers',
  'waid.idm.directives'
]).run(function (waidCore, waidCoreStrategy, waidCoreAppStrategy, waidService) {
  waidCore.config.setConfig('idm', {
    'templates': {
      'userProfileNavbar': '/idm/templates/user-profile-navbar.html',
      'userProfileStatusButton': '/idm/templates/user-profile-status-button.html',
      'termsAndConditionsModal': '/idm/templates/terms-and-conditions-modal.html',
      'completeProfile': '/idm/templates/complete-profile.html',
      'lostLoginModal': '/idm/templates/lost-login-modal.html',
      'loginAndRegisterModal': '/idm/templates/login-and-register-modal.html',
      'userProfileModal': '/idm/templates/user-profile-modal.html'
    },
    'translations': {
      'loggedin_success': 'Succesvol ingelogd.',
      'complete_profile_intro': 'Om verder te gaan met jouw account hebben we wat extra gegevens nodig...',
      'male': 'Man',
      'female': 'Vrouw'
    }
  });
});