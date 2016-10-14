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
  'waid.rating'
]).run(function (waidCore, waidCoreStrategy, waidCoreAppStrategy, waidService) {
  waidCore.config.baseTemplatePath = '';
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
      'modalWindow' : '/templates/core/modal/window.html'
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
      'emoticons_places': 'Plaatsen',
      'terms_and_conditions':'<p><b>{{ waid.application.name }}</b> besteedt continue zorg en aandacht aan de samenstelling van de inhoud op onze sites. Op onze sites worden diverse interactiemogelijkheden aangeboden. De redactie bekijkt de berichten en reacties, die naar onze fora worden gestuurd niet vooraf - tenzij uitdrukkelijk anders aangegeven. Berichten die evident onrechtmatig zijn, worden zo spoedig mogelijk verwijderd. Het kan evenwel voorkomen dat u dergelijke berichten korte tijd aantreft. Wij distantiÃ«ren ons nadrukkelijk van deze berichten en verontschuldigen ons er bij voorbaat voor. Het is mogelijk dat de informatie die op de sites wordt gepubliceerd onvolledig is of onjuistheden bevat. Het is niet altijd mogelijk fouten te voorkomen. {{ waid.application.name }} is niet verantwoordelijk voor meningen en boodschappen van gebruikers van (forum)pagina\'s. De meningen en boodschappen op de forumpagina\'s geven niet de mening of het beleid van {{ waid.application.name }} weer. Ditzelfde geldt voor informatie van derden waarvan u via links op onze websites kennisneemt. Wij sluiten alle aansprakelijkheid uit voor enigerlei directe of indirecte schade, van welke aard dan ook, die voortvloeit uit het gebruik van informatie die op of via onze websites is verkregen. {{ waid.application.name }} behoudt zich het recht voor - tenzij schriftelijk anders overeengekomen met de auteur - ingezonden materiaal te verwijderen in te korten en/of aan te passen. Dit geldt zowel voor tekst als muziek- en beeldmateriaal. Deze website is alleen bedoeld voor eigen raadpleging via normaal browser-bezoek. Het is derhalve niet toegestaan om de website op geautomatiseerde wijze te (laten) raadplegen, bijvoorbeeld via scripts, spiders en/of bots. Eventuele hyperlinks dienen bezoekers rechtstreeks te leiden naar de context, waarbinnen de publieke omroep content aanbiedt. Video- en audiostreams mogen bijvoorbeeld alleen worden vertoond via een link naar een omroeppagina of embedded omroepplayer. Overneming, inframing, herpublicatie, bewerking of toevoeging zijn niet toegestaan. Eveneens is het niet toegestaan technische beveiligingen te omzeilen of te verwijderen, of dit voor anderen mogelijk te maken. {{ waid.application.name }} kan besluiten (delen van ) bijdragen van gebruikers op internetsites te publiceren c.q. over te nemen in andere media, bijvoorbeeld maar niet beperkt tot televisie, radio, internetsites, mobiele informatiedragers en printmedia. Door bijdragen te leveren op fora en andere {{ waid.application.name }} vergelijkbare internetsites stemmen bezoekers op voorhand onvoorwaardelijk en eeuwigdurend in met bovengenoemd gebruik van (delen van) hun bijdragen. Wanneer rechtens komt vast te staan dat {{ waid.application.name }} daartoe gehouden is, zal {{ waid.application.name }} mogen overgaan tot het aan derde(n) verstrekken van naam, adres, woonplaats of ip-nummer van een bezoeker/gebruiker.</p>'
    }
  });
  waidService.initialize();
});
'use strict';
angular.module('waid.core', ['ngCookies',]).service('waidCore', function ($rootScope, $cookies) {
  var waid = angular.isDefined($rootScope.waid) ? $rootScope.waid : {};
  waid.config = {};
  waid.config.mergeRecursive = function (obj1, obj2) {
    for (var p in obj2) {
      try {
        // Property in destination object set; update its value.
        if (obj2[p].constructor == Object) {
          obj1[p] = this.mergeRecursive(obj1[p], obj2[p]);
        } else {
          obj1[p] = obj2[p];
        }
      } catch (e) {
        obj1[p] = obj2[p];
      }
    }
    return obj1;
  };
  waid.config.patchConfig = function (key, config) {
    this[key] = this.mergeRecursive(this[key], config);
  };
  waid.config.setConfig = function (key, config) {
    this[key] = config;
  };
  waid.config.getTemplateUrl = function (module, key) {
    if (typeof this[module]['templates'][key] == 'undefined') {
      console.log(key + ' template does not exist!');
    }
    return waid.config.baseTemplatePath + this[module]['templates'][key];
  };
  waid.config.getTemplate = function(url) {
    return waid.config.baseTemplatePath + url;
  };
  waid.config.getTranslation = function (module, key) {
    return this[module]['translations'][key];
  };
  waid.config.getConfig = function (key) {
    if (key.indexOf('.') !== -1) {
        var parts = key.split('.');
    } else {
        var parts = new Array(key);
    }
    if (parts.length > 0) {
      var config = this;
      for (var i = 0; i < parts.length; i++) {
        if (typeof config[parts[i]] !== 'undefined') {
          if (typeof config[parts[i]] == 'object') {
            // set new config
            config = config[parts[i]];
            continue;
          } else {
            return config[parts[i]];
          }
        } else {
          return false;
        }
      }
    }
    return this[key];
  };
  // waid.isAuthenticated = function () {
  //   if (waid.user && waid.account && waid.application) {
  //     return true;
  //   }
  //   return false;
  // };
  waid.closeAllModals = function () {
    waid.closeUserProfileModal();
    waid.closeLoginAndRegisterModal();
    waid.closeLostLoginModal();
    waid.closeTermsAndConditionsModal();
  };
  waid.clearWaidData = function () {
    $rootScope.waid.account = false;
    $rootScope.waid.application = false;
    $rootScope.waid.user = false;
    $rootScope.waid.isLoggedIn = false;
    $cookies.remove('waid', {'path':'/'});
  };

  waid.saveWaidData = function() {
    var waid = {
      'account':$rootScope.waid.account,
      'application':$rootScope.waid.application,
      'token':$rootScope.waid.token
    }
    $cookies.putObject('waid', waid, { 'path': '/' });
  }

  waid.getWaidData = function() {
    var waid = $cookies.getObject('waid');
    if (waid) {
      return waid;
    }
    return false;
  }

  waid.utils = {};
  waid.user = false;
  waid.account = false;
  waid.application = false;
  waid.isInit = false;
  waid.isLoggedIn = false;

  $rootScope.waid = waid;
  return waid;
});
'use strict';
angular.module('waid.core.strategy', [
  'waid.core',
  'waid.core.services'
]).service('waidCoreStrategy', function ($rootScope, waidCore, waidService, $location, $cookies) {
  waidCore.checkLoading = function () {
    if (waidService.running.length > 0) {
      return true;
    }
    return false;
  };

  waidCore.getAlCodeUrl = function() {
      var url = $location.absUrl();
      if ($location.$$html5 == false) {
        if ($location.absUrl().indexOf('#') == -1) {
          url += '#';
        }
      }
      if ($location.absUrl().indexOf('?') == -1 || $location.absUrl().indexOf('#')) {
        url += '?waidAlCode=[code]';
      } else {
        url += '&waidAlCode=[code]';
      }
      return url;
  };

  waidCore.logout = function () {
    waidService.userLogoutPost();
    waidService.user = false;
    waidCore.isLoggedIn = false;
  };

  waidCore.logoutAll = function () {
    waidService.userLogoutAllPost();
    waidService.user = false;
    waidCore.isLoggedIn = false;
  };

  waidCore.addEmoticon = function (emoticon) {
    var input = document.getElementById($rootScope.targetId);
    input.focus();
    input.value = [
      input.value.slice(0, input.selectionStart),
      emoticon,
      input.value.slice(input.selectionStart)
    ].join('');
    input.focus();
    $rootScope.waid.closeEmoticonsModal();
  };

  // Retrieve basic account and application data
  waidCore.initRetrieveData = function (accountId, applicationId) {
    waidService.publicAccountGet(accountId).then(function (data) {
      var application = data.main_application;
      delete data.main_application;

      waidCore.account = data;
      waidCore.application = application;

      waidService.applicationGet().then(function(data){
        waidCore.application = data;
      });

      waidCore.saveWaidData();
    });
  };

  // Main initializer for waid
  waidCore.initialize = function () {
    // Check url params to set account and application manually
    var waidAccountId = $location.search().waidAccountId;
    var waidApplicationId = $location.search().waidApplicationId;

    // Set fingerpint
    new Fingerprint2().get(function (result, components) {
        waidService.fp = result;
    });

    if (waidAccountId && waidApplicationId) {
      waidCore.account.id = waidAccountId;
      waidCore.application.id = waidApplicationId;
    }
    // Init if account and app are fixed
    if (waidCore.account.id && waidCore.application.id) {
      // Try to set by cookie
      var waid = waidCore.getWaidData();
      if (waid && waid.account && waid.account.id == waidCore.account.id 
        && waid.application && waid.application.id == waidCore.application.id) {
        try {
          waidCore.account = waid.account;
          waidCore.application = waid.application;
          waidCore.token = waid.token;
        } catch (err) {
          waidCore.initRetrieveData(waidCore.account.id, waidCore.application.id);
        }
      } else {
        waidCore.initRetrieveData(waidCore.account.id, waidCore.application.id);
      }
    } else {
      // Try to set by cookie
      var waid = waidCore.getWaidData();
      if (waid && waid.account && waid.application) {
        try {
          waidCore.account = waid.account;
          waidCore.application = waid.application;
          waidCore.token = waid.token;
        } catch (err) {
          waidCore.clearWaidData();
          waidService._clearAuthorizationData();
        }
      } else {
        waidCore.clearWaidData();
        waidService._clearAuthorizationData();
      }
    }
  };

  //
  waidCore.loginCheck = function (data) {
    if (typeof data.profile_status != 'undefined' && data.profile_status.length > 0) {
      if (data.profile_status.indexOf('profile_ok') !== -1) {
        $rootScope.$broadcast('waid.core.strategy.loginCheck.success', data);
      }
      if (typeof data.profile_status != 'undefined' && data.profile_status.indexOf('missing_profile_data') !== -1) {
        $rootScope.$broadcast('waid.core.strategy.loginCheck.completeProfile', data);
      }
    }
  };

  $rootScope.$watch('waid', function (waid) {
    
    if (typeof waid != 'undefined') {
      if (!waid.isInit && waid.account && waid.application) {
        if (waid.token && !waid.isLoggedIn) {
          waidService.authenticate().then(function(){
             waid.isLoggedIn = true;
             waid.isInit = true;
          }, function(){
             waid.isLoggedIn = false;
             waid.isInit = true;
          })
        } else {
          waid.isLoggedIn = false;
          waid.isInit = true;
        }
      }

      var waidAlCode = $location.search().waidAlCode;
      if (waidAlCode) {
        waidService.userAutoLoginGet(waidAlCode).then(function (data) {
          $location.search('waidAlCode', null);
        });
      }
      
    }
  }, true);
});
'use strict';
angular.module('waid.core.services', ['waid.core']).service('waidService', function ($q, $http, $cookies, $rootScope, $location, waidCore, $window) {
  var service = {
    'API_URL': '',
    'apiVersion': 'v1',
    'token': null,
    'authenticated': false,
    'fp': '',
    'running': [],
    'request': function (args) {
      var that = this;
      // Set CSRFToken
      $http.defaults.headers.common['X-CSRFToken'] = $cookies.get('csrftoken');
      // Set authorization token
      if (waidCore.token != null && waidCore.token != '' && waidCore.token != 'null') {
        $http.defaults.headers.common.Authorization = 'Token ' + waidCore.token;
      } else {
        $http.defaults.headers.common.Authorization = null;
      }
      $http.defaults.headers.common.FPID = this.fp;
      // Extend headers
      var headers = {};
      if (typeof args.headers != 'undefined') {
        angular.extend(headers, args.headers);
      }
      params = args.params || {};
      args = args || {};
      var deferred = $q.defer(), url = this.API_URL + args.url, method = args.method || 'GET', params = params, data = args.data || {};
      that.running.push(url);
      // Fire the request, as configured.
      $http({
        url: url,
        method: method.toUpperCase(),
        headers: headers,
        params: params,
        data: data
      }).success(angular.bind(this, function (data, status, headers, config) {
        //$rootScope.waid.isLoading = false;
        var index = this.running.indexOf(url);
        if (index > -1) {
          this.running.splice(index, 1);
        }
        deferred.resolve(data, status);
      })).error(angular.bind(this, function (data, status, headers, config) {
        var index = this.running.indexOf(url);
        if (index > -1) {
          this.running.splice(index, 1);
        }
        // Set request status
        if (data) {
          data.status = status;
        }
        if (typeof data != 'undefined' && typeof data.error != 'undefined' && data.error.code != 'undefined' && data.error.code == 'invalid_authentication_credentials') {
          that._clearAuthorizationData();
        }
        // Forbidden, send out event..
        if (status == 403) {
          $rootScope.$broadcast('waid.services.request.error', data);
        }
        if (status == 0) {
          if (data == '') {
            data = {};
            data.status = 0;
            data.non_field_errors = ['Could not connect. Please try again.'];
          }
          // or if the data is null, then there was a timeout.
          if (data == null) {
            // Inject a non field error alerting the user
            // that there's been a timeout error.
            data = {};
            data.status = 0;
            data.non_field_errors = ['Server timed out. Please try again.'];
          }
        }
        deferred.reject(data, status, headers, config);
      }));
      return deferred.promise;
    },
    '_login': function (token) {
      waidCore.token = token;
      waidCore.isLoggedIn = true;
      waidCore.saveWaidData();
      this.authenticate();
    },
    '_clearAuthorizationData': function () {
      this.authenticated = false;
      waidCore.token = null;
    },
    '_makeFileRequest': function (method, path, broadcast, data) {
      var deferred = $q.defer();
      this.request({
        'method': method,
        'url': path,
        'data': data,
        'headers': { 'Content-Type': undefined }
      }).then(function (data) {
        $rootScope.$broadcast('waid.services.' + broadcast + '.' + method.toLowerCase() + '.ok', data);
        deferred.resolve(data);
      }, function (data) {
        $rootScope.$broadcast('waid.services.' + broadcast + '.' + method.toLowerCase() + '.error', data);
        deferred.reject(data);
      });
      return deferred.promise;
    },
    '_makeRequest': function (method, path, broadcast, data) {
      var deferred = $q.defer();
      this.request({
        'method': method,
        'url': path,
        'data': data
      }).then(function (data) {
        $rootScope.$broadcast('waid.services.' + broadcast + '.' + method.toLowerCase() + '.ok', data);
        deferred.resolve(data);
      }, function (data) {
        $rootScope.$broadcast('waid.services.' + broadcast + '.' + method.toLowerCase() + '.error', data);
        deferred.reject(data);
      });
      return deferred.promise;
    },
    '_getAdminUrl': function (url) {
      return '/admin/' + this.apiVersion + '/' + waidCore.account.id + url;
    },
    '_getAppUrl': function (url) {
      return '/application/' + this.apiVersion + '/' + waidCore.account.id + '/' + $rootScope.waid.application.id + url;
    },
    '_getPublicUrl': function (url) {
      return '/public/' + this.apiVersion + url;
    },
    'userRegisterPost': function (data) {
      if (typeof data.return_url == 'undefined' || data.return_url == '') {
        data.return_url = waidCore.getAlCodeUrl();
      }
      return this._makeRequest('POST', this._getAppUrl('/user/register/'), 'application.userRegister', data);
    },
    'userCompleteProfilePost': function (data) {
      if (typeof data.return_url == 'undefined' || data.return_url == '') {
        data.return_url = waidCore.getAlCodeUrl();
      }
      return this._makeRequest('POST', this._getAppUrl('/user/complete-profile/'), 'application.userCompleteProfile', data);
    },
    'userCompleteProfileGet': function () {
      return this._makeRequest('GET', this._getAppUrl('/user/complete-profile/'), 'application.userCompleteProfile');
    },
    'userLoginPost': function (data) {
      this._clearAuthorizationData();
      var that = this;
      return this._makeRequest('POST', this._getAppUrl('/user/login/'), 'application.userLogin', data).then(function (data) {
        that._login(data.token);
        return data;
      });
    },
    'userAutoLoginGet': function (code) {
      var that = this;
      this._clearAuthorizationData();
      return this._makeRequest('GET', this._getAppUrl('/user/autologin/' + code + '/'), 'application.userAutoLogin').then(function (data) {
        that._login(data.token);
        return data;
      });
    },
    'userLostLoginPost': function (data) {
      this._clearAuthorizationData();
      return this._makeRequest('POST', this._getAppUrl('/user/lost-login/'), 'application.userLostLogin', data);
    },
    'userLogoutPost': function () {
      var that = this;
      return this._makeRequest('POST', this._getAppUrl('/user/logout/'), 'application.userLogout').then(function (data) {
        that._clearAuthorizationData();
        waidCore.user = false;
        return data;
      });
    },
    'userLogoutAllPost': function () {
      var that = this;
      return this._makeRequest('POST', this._getAppUrl('/user/logout-all/'), 'application.userLogoutAll').then(function (data) {
        that._clearAuthorizationData();
        waidCore.user = false;
        return data;
      });
    },
    'userProfileGet': function () {
      return this._makeRequest('GET', this._getAppUrl('/user/profile/'), 'application.userProfile');
    },
    'userPasswordPut': function (data) {
      return this._makeRequest('PUT', this._getAppUrl('/user/password/'), 'application.userPassword', data);
    },
    'userProfilePatch': function (data) {
      return this._makeRequest('PATCH', this._getAppUrl('/user/profile/'), 'application.userProfile', data);
    },
    'userUsernamePut': function (data) {
      return this._makeRequest('PUT', this._getAppUrl('/user/username/'), 'application.userUsername', data);
    },
    'userEmailListGet': function () {
      return this._makeRequest('GET', this._getAppUrl('/user/email/'), 'application.userEmailList');
    },
    'userEmailPost': function (data) {
      if (typeof data.return_url == 'undefined' || data.return_url == '') {
        data.return_url = waidCore.getAlCodeUrl();
      }
      return this._makeRequest('POST', this._getAppUrl('/user/email/'), 'application.userEmail', data);
    },
    'userEmailDelete': function (id) {
      return this._makeRequest('DELETE', this._getAppUrl('/user/email/' + id + '/'), 'application.userEmail');
    },
    'userAvatarPut': function (fd) {
      return this._makeFileRequest('PUT', this._getAppUrl('/user/avatar/'), 'application.userAvatar', fd);
    },
    'socialProviderListGet': function () {
      return this._makeRequest('GET', this._getAppUrl('/social/providers/'), 'application.socialProviderList');
    },
    'userCommentsPatch': function (id, data) {
      return this._makeRequest('PATCH', this._getAppUrl('/user/comments/' + id + '/'), 'application.userComments', data);
    },
    'userCommentsPost': function (data) {
      if (typeof data.object_id != 'undefined' && data.object_id == 'currenturl') {
        data.object_id = waidCore.slugify($location.absUrl());
      }
      data.url = $location.absUrl();
      return this._makeRequest('POST', this._getAppUrl('/user/comments/'), 'application.userComments', data);
    },
    'userCommentsDelete': function (id) {
      return this._makeRequest('DELETE', this._getAppUrl('/user/comments/' + id + '/'), 'application.userComments');
    },
    'userCommentsListGet': function (params) {
      if (typeof params != 'undefined') {
        if (typeof params.object_id != 'undefined' && params.object_id == 'currenturl') {
          params.object_id = waidCore.slugify($location.absUrl());
        }
        var query = '?' + $.param(params);
      } else {
        var query = '';
      }
      return this._makeRequest('GET', this._getAppUrl('/user/comments/' + query), 'application.userCommentsList');
    },
    'commentsListGet': function (params) {
      if (typeof params != 'undefined') {
        if (typeof params.object_id != 'undefined' && params.object_id == 'currenturl') {
          params.object_id = waidCore.slugify($location.absUrl());
        }
        var query = '?' + $.param(params);
      } else {
        var query = '';
      }
      return this._makeRequest('GET', this._getAppUrl('/comments/' + query), 'application.commentsList');
    },
    'commentsVotePost': function (id, vote) {
      var data = { 'vote': vote };
      return this._makeRequest('POST', this._getAppUrl('/comments/' + id + '/vote/'), 'application.commentsVote', data);
    },
    'commentsMarkPost': function (id, mark) {
      var data = { 'mark': mark };
      return this._makeRequest('POST', this._getAppUrl('/comments/' + id + '/mark/'), 'application.commentsMark', data);
    },
    'ratingPost': function (data) {
      if (typeof data.object_id != 'undefined' && data.object_id == 'currenturl') {
        data.object_id = waidCore.slugify($location.absUrl());
      }
      data.url = $location.absUrl();
      return this._makeRequest('POST', this._getAppUrl('/rating/'), 'application.rating', data);
    },
    'ratingGet': function(object_id) {
      return this._makeRequest('GET', this._getAppUrl('/rating/' + object_id + '/'), 'application.rating');
    },
    'articlesListGet': function () {
      return this._makeRequest('GET', this._getAppUrl('/articles/'), 'application.articlesList');
    },
    'articlesGet': function (id) {
      return this._makeRequest('GET', this._getAppUrl('/articles/' + id + '/'), 'application.articles');
    },
    'applicationGet': function(id) {
      return this._makeRequest('GET', this._getAppUrl('/'), 'application');
    },
    'adminCommentsListGet': function (params) {
      if (typeof params != 'undefined') {
        var query = '?' + $.param(params);
      } else {
        var query = '';
      }
      return this._makeRequest('GET', this._getAdminUrl('/comments/' + query), 'admin.commentsListGet');
    },
    'adminDefaultEmailTemplatesGet': function () {
      if (!this.adminDefaultEmailTemplatesGetRunning) {
        this.adminDefaultEmailTemplatesGetRunning = this._makeRequest('GET', this._getAdminUrl('/default-email-templates/'), 'application.adminDefaultEmailTemplates');
      }
      return this.adminDefaultEmailTemplatesGetRunning;
    },
    'adminCommentsPatch': function (id, data) {
      return this._makeRequest('PATCH', this._getAdminUrl('/comments/' + id + '/'), 'admin.commentsPatch', data);
    },
    'adminCommentsDelete': function (id) {
      return this._makeRequest('DELETE', this._getAdminUrl('/comments/' + id + '/'), 'admin.CommentsDelete');
    },
    'adminAccountGet': function () {
      return this._makeRequest('GET', this._getAdminUrl('/account/'), 'admin.account');
    },
    'adminAccountPatch': function (data) {
      return this._makeRequest('PATCH', this._getAdminUrl('/account/'), 'admin.account', data);
    },
    'adminApplicationListGet': function () {
      return this._makeRequest('GET', this._getAdminUrl('/application/'), 'admin.applicationList');
    },
    'adminApplicationGet': function (id) {
      return this._makeRequest('GET', this._getAdminUrl('/application/' + id + '/'), 'admin.application');
    },
    'adminApplicationPatch': function (data) {
      return this._makeRequest('PATCH', this._getAdminUrl('/application/' + data.id + '/'), 'admin.application', data);
    },
    'publicAccountGet': function (account) {
      return this._makeRequest('GET', this._getPublicUrl('/account/' + account + '/'), 'public.account');
    },
    'publicAccountCreatePost': function (data) {
      data.redirect_to_url = $location.absUrl() + 'admin/' + data.slug + '/';
      return this._makeRequest('POST', this._getPublicUrl('/account/create/'), 'admin.accountCreate', data);
    },
    'authenticate': function () {
      var that = this;
      var deferred = $q.defer();
      if (waidCore.token != null && waidCore.token != '' && waidCore.token != 'null') {
        this.userProfileGet().then(function (data) {
          that.authenticated = true;
          waidCore.user = data;
          $rootScope.$broadcast('waid.services.authenticate.ok', that);
          deferred.resolve(data);
        }, function (data) {
          that.authenticated = false;
          $rootScope.$broadcast('waid.services.authenticate.error', that);
          deferred.reject(data);
        });
      } else {
        that.authenticated = false;
        $rootScope.$broadcast('waid.services.authenticate.none');
        deferred.reject();
      }
      return deferred.promise;
    },
    'getAccountId': function () {
      return waidCore.account.id;
    },
    'initialize': function (url) {
      var that = this;
      this.API_URL = $window.location.protocol + '//';
      if (window.location.port == '8080' || window.location.port == '8000') {
        this.API_URL += waidCore.config.getConfig('api.environment.development.url');
      } else if (window.location.port == '8001') {
        this.API_URL += waidCore.config.getConfig('api.environment.test.url');
      } else if (window.location.port == '8002') {
        this.API_URL += waidCore.config.getConfig('api.environment.staging.url');
      } else {
        this.API_URL += waidCore.config.getConfig('api.environment.production.url');
      }
      // new Fingerprint2().get(function (result, components) {
      //   that.fp = result;
      //   that.fpComponents = components;
      // });
      return this;
    }
  };
  service.initialize();
  return service;
});
'use strict';
angular.module('waid.core.controllers', [
  'waid.core',
  'waid.core.services',
  'waid.idm.controllers',
  'waid.core.strategy',
  'waid.core.app.strategy'
]).controller('WAIDCoreEmoticonModalCtrl', function ($scope, $rootScope) {
  $scope.emoticons = {
    'people': [
      '\uD83D\uDE04',
      '\uD83D\uDE06',
      '\uD83D\uDE0A',
      '\uD83D\uDE03',
      '\uD83D\uDE0F',
      '\uD83D\uDE0D',
      '\uD83D\uDE18',
      '\uD83D\uDE1A',
      '\uD83D\uDE33',
      '\uD83D\uDE0C',
      '\uD83D\uDE06',
      '\uD83D\uDE01',
      '\uD83D\uDE09',
      '\uD83D\uDE1C',
      '\uD83D\uDE1D',
      '\uD83D\uDE00',
      '\uD83D\uDE17',
      '\uD83D\uDE19',
      '\uD83D\uDE1B',
      '\uD83D\uDE34',
      '\uD83D\uDE1F',
      '\uD83D\uDE26',
      '\uD83D\uDE27',
      '\uD83D\uDE2E',
      '\uD83D\uDE2C',
      '\uD83D\uDE15',
      '\uD83D\uDE2F',
      '\uD83D\uDE11',
      '\uD83D\uDE12',
      '\uD83D\uDE05',
      '\uD83D\uDE13',
      '\uD83D\uDE25',
      '\uD83D\uDE29',
      '\uD83D\uDE14',
      '\uD83D\uDE1E',
      '\uD83D\uDE16',
      '\uD83D\uDE28',
      '\uD83D\uDE30',
      '\uD83D\uDE23',
      '\uD83D\uDE22',
      '\uD83D\uDE2D',
      '\uD83D\uDE02',
      '\uD83D\uDE32',
      '\uD83D\uDE31',
      '\uD83D\uDE2B',
      '\uD83D\uDE20',
      '\uD83D\uDE21',
      '\uD83D\uDE24',
      '\uD83D\uDE2A',
      '\uD83D\uDE0B',
      '\uD83D\uDE37',
      '\uD83D\uDE0E',
      '\uD83D\uDE35',
      '\uD83D\uDC7F',
      '\uD83D\uDE08',
      '\uD83D\uDE10',
      '\uD83D\uDE36',
      '\uD83D\uDE07',
      '\uD83D\uDC7D',
      '\uD83D\uDC9B',
      '\uD83D\uDC99',
      '\uD83D\uDC9C',
      '\u2764',
      '\uD83D\uDC9A',
      '\uD83D\uDC94',
      '\uD83D\uDC93',
      '\uD83D\uDC97',
      '\uD83D\uDC95',
      '\uD83D\uDC9E',
      '\uD83D\uDC98',
      '\uD83D\uDC96',
      '\u2728',
      '\u2B50',
      '\uD83C\uDF1F',
      '\uD83D\uDCAB',
      '\uD83D\uDCA5',
      '\uD83D\uDCA5',
      '\uD83D\uDCA2',
      '\u2757',
      '\u2753',
      '\u2755',
      '\u2754',
      '\uD83D\uDCA4',
      '\uD83D\uDCA8',
      '\uD83D\uDCA6',
      '\uD83C\uDFB6',
      '\uD83C\uDFB5',
      '\uD83D\uDD25',
      '\uD83D\uDCA9',
      '\uD83D\uDCA9',
      '\uD83D\uDCA9',
      '\uD83D\uDC4D',
      '\uD83D\uDC4D',
      '\uD83D\uDC4E',
      '\uD83D\uDC4E',
      '\uD83D\uDC4C',
      '\uD83D\uDC4A',
      '\uD83D\uDC4A',
      '\u270A',
      '\u270C',
      '\uD83D\uDC4B',
      '\u270B',
      '\u270B',
      '\uD83D\uDC50',
      '\u261D',
      '\uD83D\uDC47',
      '\uD83D\uDC48',
      '\uD83D\uDC49',
      '\uD83D\uDE4C',
      '\uD83D\uDE4F',
      '\uD83D\uDC46',
      '\uD83D\uDC4F',
      '\uD83D\uDCAA',
      '\uD83C\uDFC3',
      '\uD83C\uDFC3',
      '\uD83D\uDC6B',
      '\uD83D\uDC6A',
      '\uD83D\uDC6C',
      '\uD83D\uDC6D',
      '\uD83D\uDC83',
      '\uD83D\uDC6F',
      '\uD83D\uDE46',
      '\uD83D\uDE45',
      '\uD83D\uDC81',
      '\uD83D\uDE4B',
      '\uD83D\uDC70',
      '\uD83D\uDE4E',
      '\uD83D\uDE4D',
      '\uD83D\uDE47',
      '\uD83D\uDC8F',
      '\uD83D\uDC91',
      '\uD83D\uDC86',
      '\uD83D\uDC87',
      '\uD83D\uDC85',
      '\uD83D\uDC66',
      '\uD83D\uDC67',
      '\uD83D\uDC69',
      '\uD83D\uDC68',
      '\uD83D\uDC76',
      '\uD83D\uDC75',
      '\uD83D\uDC74',
      '\uD83D\uDC71',
      '\uD83D\uDC72',
      '\uD83D\uDC73',
      '\uD83D\uDC77',
      '\uD83D\uDC6E',
      '\uD83D\uDC7C',
      '\uD83D\uDC78',
      '\uD83D\uDE3A',
      '\uD83D\uDE38',
      '\uD83D\uDE3B',
      '\uD83D\uDE3D',
      '\uD83D\uDE3C',
      '\uD83D\uDE40',
      '\uD83D\uDE3F',
      '\uD83D\uDE39',
      '\uD83D\uDE3E',
      '\uD83D\uDC79',
      '\uD83D\uDC7A',
      '\uD83D\uDE48',
      '\uD83D\uDE49',
      '\uD83D\uDE4A',
      '\uD83D\uDC82',
      '\uD83D\uDC80',
      '\uD83D\uDC3E',
      '\uD83D\uDC44',
      '\uD83D\uDC8B',
      '\uD83D\uDCA7',
      '\uD83D\uDC42',
      '\uD83D\uDC40',
      '\uD83D\uDC43',
      '\uD83D\uDC45',
      '\uD83D\uDC8C',
      '\uD83D\uDC64',
      '\uD83D\uDC65',
      '\uD83D\uDCAC',
      '\uD83D\uDCAD'
    ],
    'nature': [
      '\u2600',
      '\u2602',
      '\u2601',
      '\u2744',
      '\u2603',
      '\u26A1',
      '\uD83C\uDF00',
      '\uD83C\uDF01',
      '\uD83C\uDF0A',
      '\uD83D\uDC31',
      '\uD83D\uDC36',
      '\uD83D\uDC2D',
      '\uD83D\uDC39',
      '\uD83D\uDC30',
      '\uD83D\uDC3A',
      '\uD83D\uDC38',
      '\uD83D\uDC2F',
      '\uD83D\uDC28',
      '\uD83D\uDC3B',
      '\uD83D\uDC37',
      '\uD83D\uDC3D',
      '\uD83D\uDC2E',
      '\uD83D\uDC17',
      '\uD83D\uDC35',
      '\uD83D\uDC12',
      '\uD83D\uDC34',
      '\uD83D\uDC0E',
      '\uD83D\uDC2B',
      '\uD83D\uDC11',
      '\uD83D\uDC18',
      '\uD83D\uDC3C',
      '\uD83D\uDC0D',
      '\uD83D\uDC26',
      '\uD83D\uDC24',
      '\uD83D\uDC25',
      '\uD83D\uDC23',
      '\uD83D\uDC14',
      '\uD83D\uDC27',
      '\uD83D\uDC22',
      '\uD83D\uDC1B',
      '\uD83D\uDC1D',
      '\uD83D\uDC1C',
      '\uD83D\uDC1E',
      '\uD83D\uDC0C',
      '\uD83D\uDC19',
      '\uD83D\uDC20',
      '\uD83D\uDC1F',
      '\uD83D\uDC33',
      '\uD83D\uDC0B',
      '\uD83D\uDC2C',
      '\uD83D\uDC04',
      '\uD83D\uDC0F',
      '\uD83D\uDC00',
      '\uD83D\uDC03',
      '\uD83D\uDC05',
      '\uD83D\uDC07',
      '\uD83D\uDC09',
      '\uD83D\uDC10',
      '\uD83D\uDC13',
      '\uD83D\uDC15',
      '\uD83D\uDC16',
      '\uD83D\uDC01',
      '\uD83D\uDC02',
      '\uD83D\uDC32',
      '\uD83D\uDC21',
      '\uD83D\uDC0A',
      '\uD83D\uDC2A',
      '\uD83D\uDC06',
      '\uD83D\uDC08',
      '\uD83D\uDC29',
      '\uD83D\uDC3E',
      '\uD83D\uDC90',
      '\uD83C\uDF38',
      '\uD83C\uDF37',
      '\uD83C\uDF40',
      '\uD83C\uDF39',
      '\uD83C\uDF3B',
      '\uD83C\uDF3A',
      '\uD83C\uDF41',
      '\uD83C\uDF43',
      '\uD83C\uDF42',
      '\uD83C\uDF3F',
      '\uD83C\uDF44',
      '\uD83C\uDF35',
      '\uD83C\uDF34',
      '\uD83C\uDF32',
      '\uD83C\uDF33',
      '\uD83C\uDF30',
      '\uD83C\uDF31',
      '\uD83C\uDF3C',
      '\uD83C\uDF3E',
      '\uD83D\uDC1A',
      '\uD83C\uDF10',
      '\uD83C\uDF1E',
      '\uD83C\uDF1D',
      '\uD83C\uDF1A',
      '\uD83C\uDF11',
      '\uD83C\uDF12',
      '\uD83C\uDF13',
      '\uD83C\uDF14',
      '\uD83C\uDF15',
      '\uD83C\uDF16',
      '\uD83C\uDF17',
      '\uD83C\uDF18',
      '\uD83C\uDF1C',
      '\uD83C\uDF1B',
      '\uD83C\uDF19',
      '\uD83C\uDF0D',
      '\uD83C\uDF0E',
      '\uD83C\uDF0F',
      '\uD83C\uDF0B',
      '\uD83C\uDF0C',
      '\u26C5'
    ],
    'objects': [
      '\uD83C\uDF8D',
      '\uD83D\uDC9D',
      '\uD83C\uDF8E',
      '\uD83C\uDF92',
      '\uD83C\uDF93',
      '\uD83C\uDF8F',
      '\uD83C\uDF86',
      '\uD83C\uDF87',
      '\uD83C\uDF90',
      '\uD83C\uDF91',
      '\uD83C\uDF83',
      '\uD83D\uDC7B',
      '\uD83C\uDF85',
      '\uD83C\uDF84',
      '\uD83C\uDF81',
      '\uD83D\uDD14',
      '\uD83D\uDD15',
      '\uD83C\uDF8B',
      '\uD83C\uDF89',
      '\uD83C\uDF8A',
      '\uD83C\uDF88',
      '\uD83D\uDD2E',
      '\uD83D\uDCBF',
      '\uD83D\uDCC0',
      '\uD83D\uDCBE',
      '\uD83D\uDCF7',
      '\uD83D\uDCF9',
      '\uD83C\uDFA5',
      '\uD83D\uDCBB',
      '\uD83D\uDCFA',
      '\uD83D\uDCF1',
      '\u260E',
      '\u260E',
      '\uD83D\uDCDE',
      '\uD83D\uDCDF',
      '\uD83D\uDCE0',
      '\uD83D\uDCBD',
      '\uD83D\uDCFC',
      '\uD83D\uDD09',
      '\uD83D\uDD08',
      '\uD83D\uDD07',
      '\uD83D\uDCE2',
      '\uD83D\uDCE3',
      '\u231B',
      '\u23F3',
      '\u23F0',
      '\u231A',
      '\uD83D\uDCFB',
      '\uD83D\uDCE1',
      '\u27BF',
      '\uD83D\uDD0D',
      '\uD83D\uDD0E',
      '\uD83D\uDD13',
      '\uD83D\uDD12',
      '\uD83D\uDD0F',
      '\uD83D\uDD10',
      '\uD83D\uDD11',
      '\uD83D\uDCA1',
      '\uD83D\uDD26',
      '\uD83D\uDD06',
      '\uD83D\uDD05',
      '\uD83D\uDD0C',
      '\uD83D\uDD0B',
      '\uD83D\uDCF2',
      '\u2709',
      '\uD83D\uDCEB',
      '\uD83D\uDCEE',
      '\uD83D\uDEC0',
      '\uD83D\uDEC1',
      '\uD83D\uDEBF',
      '\uD83D\uDEBD',
      '\uD83D\uDD27',
      '\uD83D\uDD29',
      '\uD83D\uDD28',
      '\uD83D\uDCBA',
      '\uD83D\uDCB0',
      '\uD83D\uDCB4',
      '\uD83D\uDCB5',
      '\uD83D\uDCB7',
      '\uD83D\uDCB6',
      '\uD83D\uDCB3',
      '\uD83D\uDCB8',
      '\uD83D\uDCE7',
      '\uD83D\uDCE5',
      '\uD83D\uDCE4',
      '\u2709',
      '\uD83D\uDCE8',
      '\uD83D\uDCEF',
      '\uD83D\uDCEA',
      '\uD83D\uDCEC',
      '\uD83D\uDCED',
      '\uD83D\uDCE6',
      '\uD83D\uDEAA',
      '\uD83D\uDEAC',
      '\uD83D\uDCA3',
      '\uD83D\uDD2B',
      '\uD83D\uDD2A',
      '\uD83D\uDC8A',
      '\uD83D\uDC89',
      '\uD83D\uDCC4',
      '\uD83D\uDCC3',
      '\uD83D\uDCD1',
      '\uD83D\uDCCA',
      '\uD83D\uDCC8',
      '\uD83D\uDCC9',
      '\uD83D\uDCDC',
      '\uD83D\uDCCB',
      '\uD83D\uDCC6',
      '\uD83D\uDCC5',
      '\uD83D\uDCC7',
      '\uD83D\uDCC1',
      '\uD83D\uDCC2',
      '\u2702',
      '\uD83D\uDCCC',
      '\uD83D\uDCCE',
      '\u2712',
      '\u270F',
      '\uD83D\uDCCF',
      '\uD83D\uDCD0',
      '\uD83D\uDCD5',
      '\uD83D\uDCD7',
      '\uD83D\uDCD8',
      '\uD83D\uDCD9',
      '\uD83D\uDCD3',
      '\uD83D\uDCD4',
      '\uD83D\uDCD2',
      '\uD83D\uDCDA',
      '\uD83D\uDD16',
      '\uD83D\uDCDB',
      '\uD83D\uDD2C',
      '\uD83D\uDD2D',
      '\uD83D\uDCF0',
      '\uD83C\uDFC8',
      '\uD83C\uDFC0',
      '\u26BD',
      '\u26BE',
      '\uD83C\uDFBE',
      '\uD83C\uDFB1',
      '\uD83C\uDFC9',
      '\uD83C\uDFB3',
      '\u26F3',
      '\uD83D\uDEB5',
      '\uD83D\uDEB4',
      '\uD83C\uDFC7',
      '\uD83C\uDFC2',
      '\uD83C\uDFCA',
      '\uD83C\uDFC4',
      '\uD83C\uDFBF',
      '\u2660',
      '\u2665',
      '\u2663',
      '\u2666',
      '\uD83D\uDC8E',
      '\uD83D\uDC8D',
      '\uD83C\uDFC6',
      '\uD83C\uDFBC',
      '\uD83C\uDFB9',
      '\uD83C\uDFBB',
      '\uD83D\uDC7E',
      '\uD83C\uDFAE',
      '\uD83C\uDCCF',
      '\uD83C\uDFB4',
      '\uD83C\uDFB2',
      '\uD83C\uDFAF',
      '\uD83C\uDC04',
      '\uD83C\uDFAC',
      '\uD83D\uDCDD',
      '\uD83D\uDCDD',
      '\uD83D\uDCD6',
      '\uD83C\uDFA8',
      '\uD83C\uDFA4',
      '\uD83C\uDFA7',
      '\uD83C\uDFBA',
      '\uD83C\uDFB7',
      '\uD83C\uDFB8',
      '\uD83D\uDC5E',
      '\uD83D\uDC61',
      '\uD83D\uDC60',
      '\uD83D\uDC84',
      '\uD83D\uDC62',
      '\uD83D\uDC55',
      '\uD83D\uDC55',
      '\uD83D\uDC54',
      '\uD83D\uDC5A',
      '\uD83D\uDC57',
      '\uD83C\uDFBD',
      '\uD83D\uDC56',
      '\uD83D\uDC58',
      '\uD83D\uDC59',
      '\uD83C\uDF80',
      '\uD83C\uDFA9',
      '\uD83D\uDC51',
      '\uD83D\uDC52',
      '\uD83D\uDC5E',
      '\uD83C\uDF02',
      '\uD83D\uDCBC',
      '\uD83D\uDC5C',
      '\uD83D\uDC5D',
      '\uD83D\uDC5B',
      '\uD83D\uDC53',
      '\uD83C\uDFA3',
      '\u2615',
      '\uD83C\uDF75',
      '\uD83C\uDF76',
      '\uD83C\uDF7C',
      '\uD83C\uDF7A',
      '\uD83C\uDF7B',
      '\uD83C\uDF78',
      '\uD83C\uDF79',
      '\uD83C\uDF77',
      '\uD83C\uDF74',
      '\uD83C\uDF55',
      '\uD83C\uDF54',
      '\uD83C\uDF5F',
      '\uD83C\uDF57',
      '\uD83C\uDF56',
      '\uD83C\uDF5D',
      '\uD83C\uDF5B',
      '\uD83C\uDF64',
      '\uD83C\uDF71',
      '\uD83C\uDF63',
      '\uD83C\uDF65',
      '\uD83C\uDF59',
      '\uD83C\uDF58',
      '\uD83C\uDF5A',
      '\uD83C\uDF5C',
      '\uD83C\uDF72',
      '\uD83C\uDF62',
      '\uD83C\uDF61',
      '\uD83C\uDF73',
      '\uD83C\uDF5E',
      '\uD83C\uDF69',
      '\uD83C\uDF6E',
      '\uD83C\uDF66',
      '\uD83C\uDF68',
      '\uD83C\uDF67',
      '\uD83C\uDF82',
      '\uD83C\uDF70',
      '\uD83C\uDF6A',
      '\uD83C\uDF6B',
      '\uD83C\uDF6C',
      '\uD83C\uDF6D',
      '\uD83C\uDF6F',
      '\uD83C\uDF4E',
      '\uD83C\uDF4F',
      '\uD83C\uDF4A',
      '\uD83C\uDF4B',
      '\uD83C\uDF52',
      '\uD83C\uDF47',
      '\uD83C\uDF49',
      '\uD83C\uDF53',
      '\uD83C\uDF51',
      '\uD83C\uDF48',
      '\uD83C\uDF4C',
      '\uD83C\uDF50',
      '\uD83C\uDF4D',
      '\uD83C\uDF60',
      '\uD83C\uDF46',
      '\uD83C\uDF45',
      '\uD83C\uDF3D'
    ],
    'places': [
      '\uD83C\uDFE0',
      '\uD83C\uDFE1',
      '\uD83C\uDFEB',
      '\uD83C\uDFE2',
      '\uD83C\uDFE3',
      '\uD83C\uDFE5',
      '\uD83C\uDFE6',
      '\uD83C\uDFEA',
      '\uD83C\uDFE9',
      '\uD83C\uDFE8',
      '\uD83D\uDC92',
      '\u26EA',
      '\uD83C\uDFEC',
      '\uD83C\uDFE4',
      '\uD83C\uDF07',
      '\uD83C\uDF06',
      '\uD83C\uDFEF',
      '\uD83C\uDFF0',
      '\u26FA',
      '\uD83C\uDFED',
      '\uD83D\uDDFC',
      '\uD83D\uDDFE',
      '\uD83D\uDDFB',
      '\uD83C\uDF04',
      '\uD83C\uDF05',
      '\uD83C\uDF20',
      '\uD83D\uDDFD',
      '\uD83C\uDF09',
      '\uD83C\uDFA0',
      '\uD83C\uDF08',
      '\uD83C\uDFA1',
      '\u26F2',
      '\uD83C\uDFA2',
      '\uD83D\uDEA2',
      '\uD83D\uDEA4',
      '\u26F5',
      '\u26F5',
      '\uD83D\uDEA3',
      '\u2693',
      '\uD83D\uDE80',
      '\u2708',
      '\uD83D\uDE81',
      '\uD83D\uDE82',
      '\uD83D\uDE8A',
      '\uD83D\uDE9E',
      '\uD83D\uDEB2',
      '\uD83D\uDEA1',
      '\uD83D\uDE9F',
      '\uD83D\uDEA0',
      '\uD83D\uDE9C',
      '\uD83D\uDE99',
      '\uD83D\uDE98',
      '\uD83D\uDE97',
      '\uD83D\uDE97',
      '\uD83D\uDE95',
      '\uD83D\uDE96',
      '\uD83D\uDE9B',
      '\uD83D\uDE8C',
      '\uD83D\uDE8D',
      '\uD83D\uDEA8',
      '\uD83D\uDE93',
      '\uD83D\uDE94',
      '\uD83D\uDE92',
      '\uD83D\uDE91',
      '\uD83D\uDE90',
      '\uD83D\uDE9A',
      '\uD83D\uDE8B',
      '\uD83D\uDE89',
      '\uD83D\uDE86',
      '\uD83D\uDE85',
      '\uD83D\uDE84',
      '\uD83D\uDE88',
      '\uD83D\uDE9D',
      '\uD83D\uDE83',
      '\uD83D\uDE8E',
      '\uD83C\uDFAB',
      '\u26FD',
      '\uD83D\uDEA6',
      '\uD83D\uDEA5',
      '\u26A0',
      '\uD83D\uDEA7',
      '\uD83D\uDD30',
      '\uD83C\uDFE7',
      '\uD83C\uDFB0',
      '\uD83D\uDE8F',
      '\uD83D\uDC88',
      '\u2668',
      '\uD83C\uDFC1',
      '\uD83C\uDF8C',
      '\uD83C\uDFEE',
      '\uD83D\uDDFF',
      '\uD83C\uDFAA',
      '\uD83C\uDFAD',
      '\uD83D\uDCCD',
      '\uD83D\uDEA9'
    ]
  };
}).controller('WAIDCoreCtrl', function ($scope, $rootScope, waidCore) {
  if (angular.isDefined($rootScope.config)) {
    waidCore.config.patchConfig($rootScope.config);
  }
  waidCore.account = { 'id': angular.isDefined($scope.accountId) ? $scope.accountId : false };
  waidCore.application = { 'id': angular.isDefined($scope.applicationId) ? $scope.applicationId : false };
  waidCore.initialize();
  $scope.waid = waidCore;
});
'use strict';
angular.module('waid.core.directives', [
  'waid.core',
  'waid.core.controllers'
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
}).directive('waidTermsAndContitions', function (waidCore) {
  return {
    restrict: 'E',
    template: waidCore.config.getTranslation('core', 'terms_and_conditions')
  };
});
'use strict';
angular.module('waid.idm', [
  'waid.core',
  'waid.idm.controllers',
  'waid.idm.directives',
]).run(function (waidCore, waidCoreStrategy, waidCoreAppStrategy, waidService) {
  waidCore.config.setConfig('idm', {
    'templates': {
      'userProfileNavbar': '/templates/idm/user-profile-navbar.html',
      'userProfileStatusButton': '/templates/idm/user-profile-status-button.html',
      'termsAndConditionsModal': '/templates/idm/terms-and-conditions-modal.html',
      'completeProfileModal': '/templates/idm/complete-profile-modal.html',
      'lostLoginModal': '/templates/idm/lost-login-modal.html',
      'loginAndRegisterModal': '/templates/idm/login-and-register-modal.html',
      'userProfileModal': '/templates/idm/user-profile-modal.html',
      'loginAndRegisterHome' : '/templates/idm/login-and-register-home.html',
      'socialLogin': '/templates/idm/social-login.html',
      'login': '/templates/idm/login.html',
      'register': '/templates/idm/register.html',
      'lostLogin': '/templates/idm/lost-login.html',
      'userProfileMenu': '/templates/idm/user-profile-menu.html',
      'userProfileHome': '/templates/idm/user-profile-home.html'
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
'use strict';
angular.module('waid.idm.controllers', ['waid.core']).controller('WAIDIDMUserProfileHomeCtrl', function ($scope, $rootScope, waidService, $routeParams) {
  $scope.currentProfilePage = 'overview';
  $scope.showProfilePage = function (page) {
    return page == $scope.currentProfilePage ? true : false;
  };
  $scope.getActiveProfilePageMenuClass = function (page) {
    return page == $scope.currentProfilePage ? 'active' : '';
  };
  $scope.goToProfilePage = function (page) {
    $scope.currentProfilePage = page;
  };
  $rootScope.$on('waid.services.application.userProfile.patch.ok', function (event, data) {
    $scope.currentProfilePage = 'overview';
  });
  $rootScope.$on('waid.services.application.userProfile.put.ok', function (event, data) {
    $scope.currentProfilePage = 'overview';
  });
}).controller('WAIDIDMCompleteProfileCtrl', function ($scope, $location, $window, waidService) {
  $scope.mode = 'complete';
}).controller('WAIDIDMLoginCtrl', function ($scope, $location, waidService) {
  $scope.model = {
    'username': '',
    'password': ''
  };
  $scope.errors = [];
  $scope.login = function () {
    waidService.userLoginPost($scope.model).then(function (data) {
    }, function (data) {
      $scope.errors = data;
    });
  };
}).controller('WAIDIDMLostLoginCtrl', function ($scope, $location, waidService) {
  $scope.model = { 'email': '' };
  $scope.errors = [];
  $scope.submit = function () {
    waidService.userLostLoginPost($scope.model).then(function (data) {
      $scope.errors = [];
    }, function (data) {
      $scope.errors = data;
    });
  };
}).controller('WAIDIDMUserProfileInterestsCtrl', function ($scope, $rootScope, $location, waidCore, waidService) {
  $scope.model = waidCore.user;
  $scope.save = function () {
    waidService.userProfilePatch($scope.model).then(function (data) {
      $scope.errors = [];
    }, function (data) {
      $scope.errors = data;
    });
  };
}).controller('WAIDIDMUserProfileOverviewCtrl', function ($scope, $rootScope, $location, waidCore, waidService) {
  $scope.model = waidCore.user;
  waidService.userEmailListGet().then(function (data) {
    $scope.emails = data;
  });
  // Update stuff
  $rootScope.$watch('waid.user', function(data){
    $scope.model = data;
  }, true);
}).controller('WAIDIDMUserProfileMainCtrl', function ($scope, $rootScope, $location, waidCore, waidService, $filter, $timeout) {
  $scope.model = waidCore.user;
  $scope.errors = [];
  $scope.profileDate = false;
  $scope.isUploading = false;
  $scope.dateOptions = {
    dateDisabled: false,
    maxDate: new Date(),
    minDate: new Date(1940, 1, 1),
    startingDay: 1,
    datepickerMode: 'year'
  };
  $scope.popup = { opened: false };
  $scope.open = function () {
    $scope.popup.opened = true;
  };
  $scope.updateProfileInfo = function () {
    waidService.userProfileGet().then(function (data) {
      $scope.errors = [];
      $scope.model = data;
      waidCore.user = data;
    }, function (data) {
      $scope.errors = data;
    });
  };
  $scope.uploadFile = function (files) {
    $scope.isUploading = true;
    var fd = new FormData();
    fd.append('file', files[0]);
    waidService.userAvatarPut(fd).then(function (data) {
      $timeout(function () {
        // Still buggy, save will redirect to overview...
        $scope.save();
        $scope.isUploading = false;
      }, 1000);
    });
  };
  $scope.save = function () {
    if (typeof $scope.profileDate != 'undefined' && $scope.profileDate) {
      $scope.model.date_of_birth = $filter('date')($scope.profileDate, 'yyyy-MM-dd');
    }
    waidService.userProfilePatch($scope.model).then(function (data) {
      $scope.model = data;
      waidCore.user = data;
      $scope.errors = [];
    }, function (data) {
      $scope.errors = data;
    });
  };
  // Format date string to javascript date
  $scope.$watch('model.date_of_birth', function (date) {
    if (typeof date != 'undefined' && date != null) {
      var dateParts = date.split('-');
      $scope.profileDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    }
  });
}).controller('WAIDIDMUserProfilePasswordCtrl', function ($scope, $rootScope, $location, waidService, $filter) {
  $scope.model = {};
  $scope.save = function () {
    waidService.userPasswordPut($scope.model).then(function (data) {
      $scope.errors = [];
      $scope.model = {};
    }, function (data) {
      $scope.errors = data;
    });
  };
}).controller('WAIDIDMUserProfileUsernameCtrl', function ($scope, $rootScope, $location, waidCore, waidService, $filter) {
  $scope.model = { 'username': waidCore.user.username };
  $scope.save = function () {
    waidService.userUsernamePut($scope.model).then(function (data) {
      $scope.errors = [];
    }, function (data) {
      $scope.errors = data;
    });
  };
}).controller('WAIDIDMUserProfileEmailCtrl', function ($scope, $rootScope, $location, waidService) {
  $scope.inactiveEmails = [];
  $scope.activeEmails = [];
  $scope.emailAdd = '';
  $scope.initEmails = function (data) {
    $scope.inactiveEmails = [];
    $scope.activeEmails = [];
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].is_verified == 1) {
          $scope.activeEmails.push(data[i]);
        } else {
          $scope.inactiveEmails.push(data[i]);
        }
      }
    }
  };
  $scope.deleteEmail = function (id) {
    waidService.userEmailDelete(id).then(function (data) {
      $scope.errors = [];
      $scope.loadEmailList();
    }, function (data) {
      $scope.errors = data;
    });
  };
  $scope.addEmail = function () {
    var data = { 'email': $scope.emailAdd };
    waidService.userEmailPost(data).then(function (data) {
      $scope.errors = [];
      $scope.loadEmailList();
      $scope.emailAdd = '';
    }, function (data) {
      $scope.errors = data;
    });
  };
  $scope.loadEmailList = function () {
    waidService.userEmailListGet().then(function (data) {
      $scope.initEmails(data);
    });
  };

  $scope.$watch('waid.isInit', function(isInit) {
    if (isInit) {
      $scope.loadEmailList();
    }
  }, true);

}).controller('WAIDIDMSocialCtrl', function ($scope, $location, waidService, $window, waidCore) {
  $scope.providers = [];
  $scope.getProviders = function () {
    waidService.socialProviderListGet().then(function (data) {
      for (var i = 0; i < data.length; i++) {
        data[i].url = data[i].url + '?return_url=' + encodeURIComponent(waidCore.getAlCodeUrl());
      }
      $scope.providers = data;
    });
  };
  $scope.goToSocialLogin = function (provider) {
    $window.location.assign(provider.url);
  };
  
  $scope.$watch('waid.isInit', function (isInit) {
    if (isInit) {
      $scope.getProviders();
    }
  }, true);
}).controller('WAIDIDMRegisterCtrl', function ($scope, $route, waidService, $location, $uibModal) {
  $scope.show = {};
  $scope.missingEmailVerification = false;
  if ($scope.modus == 'complete') {
    // Check for logged-in user
    waidService.userCompleteProfileGet().then(function (data) {
      $scope.model = data.user;
      if (typeof data.profile_status != 'undefined' && data.profile_status.indexOf('email_is_not_verified') !== -1) {
        $scope.missingEmailVerification = true;
      }
      // Set missing data
      for (var i = 0; i < data.missing_data.length; i++) {
        $scope.show[data.missing_data[i]] = true;
      }
    }, function (data) {
    });
  } else {
    $scope.missingEmailVerification = false;
    $scope.show = {
      'username': true,
      'password': true,
      'email': true,
      'terms_and_conditions_check': true
    };
  }
  // $scope.model = {
  //   'username':'',
  //   'password':'',
  //   'email':'',
  //   'terms_and_conditions_check':false
  // };
  $scope.register = function () {
    if ($scope.model.terms_and_conditions_check) {
      $scope.errors = [];
      if ($scope.modus == 'complete') {
        waidService.userCompleteProfilePost($scope.model).then(function (data) {
          $scope.model = {};
        }, function (data) {
          $scope.errors = data;
        });
      } else {
        waidService.userRegisterPost($scope.model).then(function (data) {
          $scope.model = {};
        }, function (data) {
          $scope.errors = data;
        });
      }
    }
  };
});
'use strict';
angular.module('waid.idm.directives', [
  'waid.core',
  'waid.idm.controllers'
]).directive('waidUserProfileNavbar', function (waidCore) {
  return {
    restrict: 'E',
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('idm', 'userProfileNavbar');
    }
  };
}).directive('waidUserProfileStatusButton', function (waidCore) {
  return {
    restrict: 'E',
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('idm', 'userProfileStatusButton');
    }
  };
});
angular.module('waid.comments', [
  'waid.core',
  'waid.idm',
  'waid.comments.controllers',
  'waid.comments.directives'
]).run(function (waidCore, waidCoreStrategy, waidCoreAppStrategy, waidService) {
  waidCore.config.setConfig('comments', {
    'templates': {
      'commentsHome': '/templates/comments/comments-home.html',
      'commentsOrderButton': '/templates/comments/comments-order-button.html'
    },
    'translations': {
      'title': 'Comments',
      'notLoggedInText': 'Om comments te plaatsen dien je een account te hebben, login of registreer je snel!',
      'postCommentButton': 'Plaats comment',
      'actionDropdownTitle': 'Opties',
      'editCommentTitle': 'Aanpassen',
      'markCommentSpamTitle': 'Markeer als spam',
      'commentMarkedAsSpam': 'Gemarkeerd als spam!',
      'deleteCommentTitle': 'Verwijderen',
      'confirmDeleteContentBody': 'Weet u zeker dat je de comment wilt verwijderen?',
      'confirmDeleteContentTitle': 'Comment verwijderen?',
      'updateCommentButton': 'Aanpassen',
      'voteOrderNewestFirst': 'Nieuwste eerst',
      'voteOrderOldestFirst': 'Oudste eerst',
      'voteOrderTopFirst': 'Top comments',
      'addEmoticonButtonText': 'Emoticon toevoegen',
      'isLockedTitle':'Comment is gelocked'
    }
  });
});
'use strict';
angular.module('waid.comments.controllers', [
  'waid.core',
  'waid.core.strategy',
  'waid.core.app.strategy'
]).controller('WAIDCommentsCtrl', function ($scope, $rootScope, waidService, $q, waidCoreStrategy, waidCoreAppStrategy) {
  $scope.ordering = angular.isDefined($scope.ordering) ? $scope.ordering : '-created';
  $scope.orderingEnabled = angular.isDefined($scope.orderingEnabled) && $scope.orderingEnabled == 'false' ? false : true;
  $scope.objectId = angular.isDefined($scope.objectId) ? $scope.objectId : 'currenturl';

  $scope.waid = $rootScope.waid;
  $scope.comment = { 'comment': '' };
  $scope.orderCommentList = function (ordering) {
    $scope.ordering = ordering;
    $scope.loadComments();
  };
  $scope.voteComment = function (comment, vote) {
    if (!$rootScope.waid.user) {
      $rootScope.waid.openLoginAndRegisterHomeModal();
    } else {
      waidService.commentsVotePost(comment.id, vote).then(function (data) {
        comment.vote_up_count = data.vote_up_count;
        comment.vote_down_count = data.vote_down_count;
        comment.vote_count = data.vote_count;
      });
    }
  };
  $scope.markComment = function (comment, mark) {
    waidService.commentsMarkPost(comment.id, mark).then(function (data) {
      comment.marked_as_spam = data.marked_as_spam;
    });
  };
  $scope.editComment = function (comment) {
    if (comment.is_locked) {
      return false;
    }

    comment.is_edit = true;
  };
  $scope.updateComment = function (comment) {
    var patch_comment = { 'comment': comment.comment_formatted };
    waidService.userCommentsPatch(comment.id, patch_comment).then(function (data) {
      comment.is_edit = false;
      comment.comment_formatted = data.comment_formatted;
      comment.comment = data.comment;
    });
  };
  $scope.deleteComment = function (comment) {
    waidService.userCommentsDelete(comment.id).then(function (data) {
      var index = $scope.comments.indexOf(comment);
      $scope.comments.splice(index, 1);
    });
  };
  $scope.loadComments = function () {
    waidService.commentsListGet({
      'object_id': $scope.objectId,
      'ordering': $scope.ordering
    }).then(function (data) {
      for (var i = 0; i < data.length; i++) {
        data[i].is_edit = false;
        if (data[i].user.id == $rootScope.waid.user.id) {
          data[i].is_owner = true;
        }
      }
      $scope.comments = data;
    });
  };
  $scope.post = function () {
    $scope.comment.object_id = $scope.objectId;
    waidService.userCommentsPost($scope.comment).then(function (data) {
      $scope.comment.comment = '';
      $scope.loadComments();
    });
  };
  $scope.$watch('objectId', function (objectId) {
    if (objectId != '') {
      $scope.loadComments();
    }
  });
});
'use strict';
angular.module('waid.comments.directives', [
  'waid.core',
  'waid.comments.controllers'
]).directive('waidComments', function (waidCore) {
  return {
    restrict: 'E',
    scope: {
      ordering: '@?',
      objectId: '@?',
      orderingEnabled: '@?'
    },
    controller: 'WAIDCommentsCtrl',
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('comments', 'commentsHome');
    }
  };
}).directive('waidCommentsOrderButton', function (waidCore) {
  return {
    restrict: 'E',
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('comments', 'commentsOrderButton');
    }
  };
});
angular.module('waid.rating', [
  'waid.core',
  'waid.idm',
  'waid.rating.controllers',
  'waid.rating.directives'
]).run(function (waidCore, waidCoreStrategy, waidCoreAppStrategy, waidService) {
  waidCore.config.setConfig('rating', {
    'templates': {
      'ratingWidget': '/templates/rating/widget.html'
    },
    'translations': {
    }
  });
});
'use strict';
angular.module('waid.rating.controllers', [
  'waid.core',
  'waid.core.strategy',
  'waid.core.app.strategy'
]).controller('WAIDRatingCtrl', function ($scope, $rootScope, waidService, waidCoreStrategy, waidCoreAppStrategy) {
  $scope.objectId = angular.isDefined($scope.objectId) ? $scope.objectId : 'currenturl';

  // Fixed for now..
  $scope.stars = [
    {'active':false, 'value':1},
    {'active':false, 'value':2},
    {'active':false, 'value':3},
    {'active':false, 'value':4},
    {'active':false, 'value':5}
  ];


  $scope.rating = {
    'average':0,
    'total_votes':0,
    'rating':[]
  }

  $scope.rate = function (value) {
    if (!$rootScope.waid.user) {
      $rootScope.waid.openLoginAndRegisterHomeModal();
    } else {

      var data = {
        'object_id': $scope.objectId,
        'value':value,
      }

      waidService.ratingPost(data).then(function(data){
        $scope.rating = data;
        $scope.rateOut();
      })
    }
  };

  $scope.rateOver = function (value) {
    for (var i=0; $scope.stars.length > i; i++){
      if (i < value) {
        $scope.stars[i].active = true;
      } else {
        $scope.stars[i].active = false;
      }
    }
  }

  // Rateout initialises the rating based on the current rating object
  $scope.rateOut = function() {
    var average_rounded = Math.round($scope.rating.average)
    for (var i=0; $scope.stars.length > i; i++){
      if (i < average_rounded) {
        $scope.stars[i].active = true;
      } else {
        $scope.stars[i].active = false;
      }
    }
  }


  $rootScope.$watch('waid.isInit', function(isInit){
    if (typeof isInit != "undefined" && isInit) {
      waidService.ratingGet($scope.objectId).then(function(data){
        $scope.rating = data;
        // Init rating on view
        $scope.rateOut();
      });
    }
  });

});
'use strict';
angular.module('waid.rating.directives', [
  'waid.core',
  'waid.rating.controllers'
]).directive('waidRating', function (waidCore) {
  return {
    restrict: 'E',
    scope: {
      objectId: '@?'
    },
    controller: 'WAIDRatingCtrl',
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('rating', 'ratingWidget');
    }
  };
});