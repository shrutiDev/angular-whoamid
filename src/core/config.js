waid.config.setConfig('api', {
  'environment' : {
    'development':{
      'url': 'http://dev.whoamid.com:8000/nl/api'
    },
    'test':{
      'url': 'http://api.test.whoamid.com:8001/nl/api'
    },
    'staging':{
      'url': 'http://api.test.whoamid.com:8002/nl/api'
    },
    'production':{
      'url': 'http://api.whoamid.com/nl/api'
    }
  },
  // 'accountId' : 'efa26bbd-33dc-4148-b135-a1e9234e0fef',
  // 'applicationId' : 'c7d23002-da7d-4ad3-a665-9ae9de276c9e',
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


waid.config.setConfig('core', {
  'templates':{
    'core': '/core/templates/core.html',
  }
});

