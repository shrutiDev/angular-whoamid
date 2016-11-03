'use strict';
angular.module('waid.idm', [
  'waid.core',
  'waid.idm.controllers',
  'waid.idm.directives'
]).run(function (waidCore, waidCoreStrategy, waidCoreAppStrategy, waidService) {
  waidCore.config.setConfig('idm', {
    'templates': {
      'profile': '/templates/idm/profile.html',
      'overview': '/templates/idm/overview.html',
      'userProfileNavbar': '/templates/idm/user-profile-navbar.html',
      'userProfileStatusButton': '/templates/idm/user-profile-status-button.html',
      'termsAndConditionsModal': '/templates/idm/terms-and-conditions-modal.html',
      'completeProfileModal': '/templates/idm/complete-profile-modal.html',
      'lostLoginModal': '/templates/idm/lost-login-modal.html',
      'loginAndRegisterModal': '/templates/idm/login-and-register-modal.html',
      'userProfileModal': '/templates/idm/user-profile-modal.html',
      'loginAndRegisterHome': '/templates/idm/login-and-register-home.html',
      'socialLogin': '/templates/idm/social-login.html',
      'login': '/templates/idm/login.html',
      'register': '/templates/idm/register.html',
      'lostLogin': '/templates/idm/lost-login.html',
      'userProfileMenu': '/templates/idm/user-profile-menu.html',
      'userProfileHome': '/templates/idm/user-profile-home.html'
    },
    'translations': {
      'edit': 'Wijzigen',
      'loggedin_success': 'Je bent succesvol ingelogd.',
      'complete_profile_intro': 'Om verder te gaan met jouw account hebben we wat extra gegevens nodig...',
      'complete_profile_email_allready_sent': 'Er was al een bevestigings e-mail naar je toe gestuurd. Heb je deze niet ontvangen? voer opnieuw een geldig e-mailadres in en dan word er een nieuwe activatie link toegestuurd.',
      'male': 'Man',
      'female': 'Vrouw',
      'emails': 'E-mail adressen',
      'avatar': 'Avatar',
      'display_name': 'Nickname',
      'date_of_birth': 'Geboortedatum',
      'gender': 'Geslacht',
      'overview': 'Overzicht',
      'main': 'Algemeen',
      'edit_overview': 'Algemene gegevens aanpassen',
      'interests': 'Interesses',
      'like_tags': 'Wat vind je leuk?',
      'like_tags_help': 'Probeer in kernwoorden te antwoorden, bijvoorbeeld: vakantie, Bali, fietsen, muziek, auto\'s, Audi etc. We proberen interessante content met deze woorden voor je te selecteren.',
      'dislike_tags': 'Wat vind je echt niet leuk?',
      'edit_interests': 'Interesses aanpassen',
      'email_addresses': 'E-mail adressen',
      'edit_email_addresses': 'E-mail adressen aanpassen',
      'username': 'Gebruikersnaam',
      'edit_username': 'Gebruikersnaam wijzigen',
      'password': 'Wachtwoord',
      'password_confirm': 'Wachtwoord bevestiging',
      'edit_password': 'Wachtwoord wijzigen',
      'login_and_register_home_social_login_title': 'Log in met jouw Social account',
      'login_and_register_home_login_title': 'Inloggen',
      'login_and_register_home_register_title': 'Registreren',
      'login_and_register_home_social_login_intro': '<p>Maak gebruik van jouw social media account bij Facebook, Twitter of LinkedIn om snel en gemakkelijk in te loggen.</p>',
      'login_and_register_modal_close_button': 'Sluiten',
      'login_and_register_modal_title': 'Inloggen of registreren',
      'profile_overview_title': 'Overzicht',
      'profile_main_title': 'Algemeen',
      'profile_interests_title': 'Interesses',
      'profile_emails_title': 'E-mail adressen',
      'profile_username_title': 'Gebruikersnaam',
      'profile_password_title': 'Wachtwoord',
      'profile_logout_title': 'Uitloggen',
      'complete_profile_modal_title': 'Bevestig uw gegevens',
      'complete_profile_modal_close_button': 'Niet verdergaan en uitloggen',
      'login_lost_login_link': 'Login gegevens kwijt?',
      'login_submit': 'Inloggen',
      'login_form_password_label': 'Wachtwoord',
      'login_form_username_label': 'Gebruikersnaam',
      'lost_login_modal_title': 'Login gegevens kwijt?',
      'lost_login_modal_close_button': 'Sluiten',
      'lost_login_submit_button': 'Inlog gegevens ophalen',
      'lost_lostin_form_email': 'E-mailadres',
      'register_form_username': 'Gebruikersnaam',
      'register_form_email': 'E-mailadres',
      'register_form_password': 'Wachtwoord',
      'register_submit_register': 'Registreren',
      'register_submit_register_complete': 'Registratie afronden',
      'terms_and_conditions_check': 'Ik ga akkoord met de <a ng-click="waid.openTermsAndConditionsModal()">algemene voorwaarden</a>.',
      'terms_and_condition_modal_title': 'Algemene voorwaarden',
      'terms_and_condition_modal_close': 'Sluiten'
    },
    'profileDefinition': {
      'fieldSet': [
        {
          'key': 'overview',
          'order': 10,
          'templateKey': 'overview'
        },
        {
          'key': 'main',
          'order': 20,
          'fieldDefinitions': [
            {
              'order': 10,
              'name': 'display_name',
              'labelKey': 'display_name',
              'type': 'input'
            },
            {
              'order': 20,
              'name': 'date_of_birth',
              'labelKey': 'date_of_birth',
              'type': 'date'
            },
            {
              'order': 30,
              'name': 'gender',
              'labelKey': 'gender',
              'type': 'gender'
            },
            {
              'order': 40,
              'name': 'avatar_thumb_50_50',
              'labelKey': 'avatar',
              'type': 'avatar'
            }
          ]
        },
        {
          'key': 'interests',
          'order': 30,
          'fieldDefinitions': [
            {
              'order': 10,
              'name': 'like_tags',
              'labelKey': 'like_tags',
              'helpKey': 'like_tags_help',
              'type': 'textarea'
            },
            {
              'order': 20,
              'name': 'dislike_tags',
              'labelKey': 'dislike_tags',
              'type': 'textarea'
            }
          ]
        },
        {
          'key': 'emails',
          'order': 40,
          'noSaveButton': true,
          'fieldDefinitions': [{
              'order': 10,
              'noLabel': true,
              'name': 'emails',
              'labelKey': 'emails',
              'type': 'multipleEmail'
            }]
        },
        {
          'key': 'username',
          'order': 50,
          'fieldDefinitions': [{
              'order': 10,
              'name': 'username',
              'labelKey': 'username',
              'type': 'input'
            }]
        },
        {
          'key': 'password',
          'order': 60,
          'fieldDefinitions': [
            {
              'order': 10,
              'name': 'password',
              'labelKey': 'password',
              'type': 'password'
            },
            {
              'order': 20,
              'name': 'password_confirm',
              'labelKey': 'password_confirm',
              'type': 'password',
              'hideFromOverview': true
            }
          ]
        }
      ]
    }
  });
});