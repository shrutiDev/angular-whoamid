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
      'complete_profile_email_allready_sent':'Er was al een bevestigings e-mail naar je toe gestuurd. Heb je deze niet ontvangen? voer opnieuw een geldig e-mail adres in en dan word er een nieuwe activatie link toegestuurd.',
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
      'login_and_register_modal_title':'Inloggen of registreren',
      'profile_overview_title':'Overzicht',
      'profile_main_title':'Algemeen',
      'profile_interests_title':'Interesses',
      'profile_emails_title':'E-mail adressen',
      'profile_username_title':'Gebruikersnaam',
      'profile_password_title':'Wachtwoord',
      'profile_logout_title':'Uitloggen',
      'complete_profile_modal_title':'Bevestig uw gegevens',
      'complete_profile_modal_close_button':'Niet verdergaan en uitloggen',
      'login_lost_login_link':'Login gegevens kwijt?',
      'login_submit':'Inloggen',
      'login_form_password_label':'Wachtwoord',
      'login_form_username_label':'Gebruikersnaam',
      'lost_login_modal_title':'Login gegevens kwijt?',
      'lost_login_modal_close_button':'Sluiten',
      'lost_login_submit_button':'Inlog gegevens ophalen',
      'lost_lostin_form_email':'E-mail',
      'register_form_username':'Username',
      'register_form_email':'E-Mail',
      'register_form_password':'Wachtwoord',
      'register_submit_register':'Registreren',
      'register_submit_register_complete':'Registratie afronden'
    },
    'profile': {
      'fieldSet': [
        {
          'key':'overview',
          'order':10,
          'template':'overview.html'
        },
        {
          'key': 'main',
          'order':20,
          'fields':['title', 'nickname', 'date_of_birth']
        },
        {
          'key':'interests',
          'order':30,
          'fields':['like','dislike']
        },
        {
          'key':'emails',
          'order':40,
          'fields':['like','dislike']
        },
        {
          'key':'username',
          'order':50,
          'fields':['like','dislike']
        },
        {
          'key':'password',
          'order':60,
          'fields':['like','dislike']
        }
      ],
      'fieldDefinitions': [
        {
          'name': 'firsname',
          'type': 'BooleanField',
          'storeType':'metadata',
          'default': false,
          'autoValue': 'now',
          'validators': [
            {
              'type': 'length',
              'min': 1,
              'max': 10
            }
          ]
        },
        {
          'name': 'email',
          'type': 'EmailField',
          'storeType':'system',
          
          'fieldDefinitions':[
            {
              'name':'email',
              'type':'system',
              'order':1
            }
          ],
          'validators': [
            {
              'type': 'length',
              'min': 1,
              'max': 10
            }
          ]
        }
      ]
    }
  });
});