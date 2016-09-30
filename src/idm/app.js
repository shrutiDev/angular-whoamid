'use strict';
angular.module('waid.idm', [
  'waid.core',
  'waid.idm.controllers',
  'waid.idm.directives',
]).run(function (waidCore, waidCoreStrategy, waidCoreAppStrategy, waidService) {
  waidCore.config.setConfig('idm', {
    'templates': {
      'userProfileNavbar': '/idm/bootstrap3/templates/user-profile-navbar.html',
      'userProfileStatusButton': '/idm/bootstrap3/templates/user-profile-status-button.html',
      'termsAndConditionsModal': '/idm/bootstrap3/templates/terms-and-conditions-modal.html',
      'completeProfileModal': '/idm/bootstrap3/templates/complete-profile-modal.html',
      'lostLoginModal': '/idm/bootstrap3/templates/lost-login-modal.html',
      'loginAndRegisterModal': '/idm/bootstrap3/templates/login-and-register-modal.html',
      'userProfileModal': '/idm/bootstrap3/templates/user-profile-modal.html',
      'loginAndRegisterHome' : '/idm/bootstrap3/templates/login-and-register-home.html',
      'socialLogin': '/idm/bootstrap3/templates/social-login.html',
      'login': '/idm/bootstrap3/templates/login.html',
      'register': '/idm/bootstrap3/templates/register.html',
      'lostLogin': '/idm/bootstrap3/templates/lost-login.html',
      'userProfileMenu': '/idm/bootstrap3/templates/user-profile-menu.html',
      'userProfileHome': '/idm/bootstrap3/templates/user-profile-home.html'
    },
    'translations': {
      'loggedin_success': 'Succesvol ingelogd.',
      'complete_profile_intro': 'Om verder te gaan met jouw account hebben we wat extra gegevens nodig...',
      'male': 'Man',
      'female': 'Vrouw',
      'avatar': 'Avatar',
      'nickname': 'Nickname',
      'date_of_birth': 'Geboortedatum',
      'gender':'Geslacht',
      'overview':'Overzicht',
      'edit_overview':'Algemene gegevens aanpassen',
      'interests':'Interesses',
      'fun':'Leuk',
      'not_fun':'Niet leuk',
      'edit_interests':'Interesses aanpassen',
      'email_addresses':'E-mail adressen',
      'edit_email_addresses': 'E-mail adressen aanpassen',
      'username':'Gebruikersnaam',
      'edit_username':'Gebruikersnaam wijzigen',
      'password':'Wachtwoord',
      'edit_password':'Wachtwoord wijzigen',
      'login_and_register_home_social_login_title':'Social login/registratie',
      'login_and_register_home_login_title':'Inloggen',
      'login_and_register_home_register_title':'Registreren',
      'login_and_register_home_social_login_intro':'<p>Social login zorgt ervoor dat je snel kan aanmelden met jouw social media account.</p><p>Je word doorverwezen naar de social account met verdere informatie en instructies.</p><p>Zodra je daar akkoord geeft word je weer doorverwezen naar deze site en is jouw account aangemaakt!</p>',
      'login_and_register_modal_close_button':'Sluiten',
      'login_and_register_modal_title':'Inloggen of registreren'
    }
  });
});