angular.module('waid', [
  'waid.templates',

  'waid.core',
  'waid.core.strategy',
  'waid.core.services',
  'waid.core.controllers',
  'waid.core.directives',

  'waid.idm.controllers',
  'waid.idm.directives',

  'waid.comments.controllers',
  'waid.comments.directives'
]).run(function(waidCore, waidCoreStrategy, waidService) {
    
  waidCore.config.setConfig('api', {
    'environment' : {
      'development':{
        'url': 'http://dev.whoamid.com:8000/nl/api'
      },
      'test':{
        'url': 'http://test.whoamid.com:8001/nl/api'
      },
      'staging':{
        'url': 'http://test.whoamid.com:8002/nl/api'
      },
      'production':{
        'url': 'http://eu.whoamid.com/nl/api'
      }
    }
    // 'accountId' : 'efa26bbd-33dc-4148-b135-a1e9234e0fef',
    // 'applicationId' : 'c7d23002-da7d-4ad3-a665-9ae9de276c9e',
  });


  waidCore.config.setConfig('core', {
    'templates':{
      'core': '/core/templates/core.html',
      'emoticonsModal':'/core/templates/emoticons-modal.html'
    },
    'errorCodes':{
      'auth-cancelled' : 'Authentication was canceled by the user.',
      'auth-failed' : 'Authentication failed for some reason.',
      'auth-unknown-error' : 'An unknown error stoped the authentication process.',
      'auth-missing-parameter' : 'A needed parameter to continue the process was missing, usually raised by the services that need some POST data like myOpenID.',
      'auth-state-missing' : 'The state parameter is missing from the server response.',
      'auth-state-forbidden' : 'The state parameter returned by the server is not the one sent.',
      'auth-token-error' : 'Unauthorized or access token error, it was invalid, impossible to authenticate or user removed permissions to it.',
      'auth-already-associated' : 'A different user has already associated the social account that the current user is trying to associate.',
      'system-error' : 'System error, failed for some reason.'
    }
  });


  waidCore.config.setConfig('comments', {
    'templates':{
      'commentsHome': '/comments/templates/comments-home.html',
      'commentsOrderButton': '/comments/templates/comments-order-button.html'
    }
  });



  waidCore.config.setConfig('idm', {
    'templates':{
      'userProfileNavbar':'/idm/templates/user-profile-navbar.html',
      'userProfileStatusButton': '/idm/templates/user-profile-status-button.html',
      'termsAndConditionsModal': '/idm/templates/terms-and-conditions-modal.html',
      'completeProfile': '/idm/templates/complete-profile.html',
      'lostLoginModal': '/idm/templates/lost-login-modal.html',
      'loginAndRegisterModal':'/idm/templates/login-and-register-modal.html',
      'userProfileModal':'/idm/templates/user-profile-modal.html'
    },
    'translations':{
      'complete_profile_intro': 'Om verder te gaan met jouw account hebben we wat extra gegevens nodig...'
    }
  });

  waidCore.config.patchConfig('comments', {
    'translations':{
      'title':'Comments',
      'notLoggedInText':'Om comments te plaatsen dien je een account te hebben, login of registreer je snel!',
      'postCommentButton':'Plaats comment',
      'actionDropdownTitle':'Opties',
      'editCommentTitle':'Aanpassen',
      'markCommentSpamTitle':'Markeer als spam',
      'commentMarkedAsSpam':'Gemarkeerd als spam!',
      'deleteCommentTitle':'Verwijderen',
      'confirmDeleteContentBody': 'Weet u zeker dat je de comment wilt verwijderen?',
      'confirmDeleteContentTitle':'Comment verwijderen?',
      'updateCommentButton':'Aanpassen',
      'voteOrderNewestFirst':'Nieuwste eerst',
      'voteOrderOldestFirst':'Oudste eerst',
      'voteOrderTopFirst':'Top comments'
    }
  });

  waidCore.config.patchConfig('core', {
    'translations':{
      'growlLoggedInSucces': "Succesvol ingelogd.",
      'emoticons':{
        'people':'Mensen',
        'nature':'Natuur',
        'objects':'Objecten',
        'places':'Plaatsen'
      }
    }
   });

  waidService.initialize();
});


