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
  'monospaced.elastic'
]).run(function (waidCore, waidCoreStrategy, waidCoreAppStrategy, waidService) {
  waidCore.config.baseTemplatePath = '';
  waidCore.config.version = '0.0.33';
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
'use strict';
angular.module('waid.core', ['ngCookies']).service('waidCore', function ($rootScope, $cookies) {
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
    if (typeof this[module].templates[key] == 'undefined') {
      console.log(key + ' template does not exist!');
    }
    return waid.config.baseTemplatePath + this[module].templates[key] + '?v=' + waid.config.version;
  };
  waid.config.getTemplate = function (url) {
    return waid.config.baseTemplatePath + url + '?v=' + waid.config.version;
  };
  waid.config.getTranslation = function (module, key) {
    return this[module].translations[key];
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
  // Adds user action to queue, when user is loggedin it will handle all actions
  waid.setLastAction = function (type, data) {
    var object = {
      'type':type,
      'data':data
    }
    $cookies.putObject('waid_last_action', object, { 'path': '/' });
  };

  waid.getLastAction = function () {
    var object = $cookies.getObject('waid_last_action');
    if (object) {
      return object;
    }
    return false;
  };
  waid.clearLastAction = function (){
    $cookies.remove('waid_last_action', { 'path': '/' });
  };
  waid.clearWaidData = function () {
    $rootScope.waid.account = false;
    $rootScope.waid.application = false;
    $rootScope.waid.user = false;
    $rootScope.waid.isLoggedIn = false;
    $rootScope.waid.token = false;
    $cookies.remove('waid', { 'path': '/' });
  };
  waid.saveWaidData = function (waid) {
    $cookies.putObject('waid', waid, { 'path': '/' });
  };
  waid.getWaidData = function () {
    var waid = $cookies.getObject('waid');
    if (waid) {
      return waid;
    }
    return false;
  };
  waid.clearUserData = function () {
    $rootScope.waid.user = false;
    $rootScope.waid.isLoggedIn = false;
    $rootScope.waid.token = false;
    waid.saveWaidData();
  };
  waid.utils = {};
  waid.user = false;
  waid.account = false;
  waid.application = false;
  waid.isInit = false;
  waid.isLoggedIn = false;
  waid.isLoading = false;
  $rootScope.waid = waid;
  return waid;
});
'use strict';
angular.module('waid.core.strategy', [
  'waid.core',
  'waid.core.services'
]).service('waidCoreStrategy', function ($rootScope, waidCore, waidService, $location, $cookies, $q) {
  waidCore.getAlCodeUrl = function () {
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

  waidCore.slugify = function (slug) {
    return Slug.slugify($location.absUrl());
  };

  // Core actions
  waidCore.openTermsAndConditions = function() {
    $rootScope.$broadcast('waid.core.strategy.openTermsAndConditions');
  };
  waidCore.openEmoticons = function(targetId, comment) {
    $rootScope.$broadcast('waid.core.strategy.openEmoticons', {'targetId':targetId, 'comment':comment});
  };

  // Idm actions : TODO move to own strategy
  waidCore.logout = function () {
    $rootScope.$broadcast('waid.idm.strategy.action.logout');
  };
  waidCore.logoutAll = function () {
    $rootScope.$broadcast('waid.idm.strategy.action.logoutAll');
  };
  waidCore.openLinkSocialProfile = function() {
    $rootScope.$broadcast('waid.idm.strategy.openLinkSocialProfile');
  };
  waidCore.openUserProfileHome = function(fieldSet) {
    $rootScope.$broadcast('waid.idm.strategy.openUserProfileHome', {'fieldSet':fieldSet});
  };
  waidCore.openLoginAndRegisterHome = function() {
    $rootScope.$broadcast('waid.idm.strategy.openLoginAndRegisterHome');
  };
  waidCore.openLostLogin = function() {
    $rootScope.$broadcast('waid.idm.strategy.openLostLogin');
  };
  waidCore.openCompleteProfile = function() {
    $rootScope.$broadcast('waid.idm.strategy.openCompleteProfile');
  };

  waidCore.doNotLinkSocialProfile = function() {
    $rootScope.$broadcast('waid.idm.strategy.action.doNotLinkSocialProfile');
  }

  waidCore.doNotCompleteProfile = function() {
    $rootScope.$broadcast('waid.idm.strategy.action.doNotCompleteProfile');
  }

  waidCore.storeBaseData = function() {
    waidCore.saveWaidData({
      'account':waidCore.account,
      'application':waidCore.application,
      'token':waidCore.token
    });
  }
  waidCore.initAlCode = function () {
    var deferred = $q.defer();
    var waidAlCode = $location.search().waidAlCode;
    if (waidAlCode) {
      waidService.userAutoLoginGet(waidAlCode).then(function (data) {
        deferred.resolve(data);
        $location.search('waidAlCode', null);
        // Fix facebook hash
        if ($location.hash() == '_=_') {
          $location.hash('');
        }
      }, function (data) {
        deferred.reject(data);
      });
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  };
  waidCore.initErrorCode = function() {
    var waidErrorCode = $location.search().waidErrorCode;
    if (waidErrorCode) {
      $rootScope.$broadcast('waid.core.strategy.errorCode', {'errorCode':waidErrorCode});
      $location.search('waidErrorCode', null);
      // Fix facebook hash
      if ($location.hash() == '_=_') {
        $location.hash('');
      }
    }
  }

  waidCore.preInitialize = function() {
    // can overwrite in application
  };
  waidCore.initFP = function () {
    var deferred = $q.defer();
    new Fingerprint2().get(function (result, components) {
      waidService.fp = result;
      deferred.resolve(result);
    });
    return deferred.promise;
  };

  waidCore.applicationInit = function() {
    var deferred = $q.defer();
    // Minimum required
    if (typeof waidCore.account != 'undefined' && typeof waidCore.application != 'undefined' && waidCore.account.id && waidCore.application.id) {
      waidService.applicationInitGet(waidCore.account.id , waidCore.application.id).then(function(data){
        waidCore.account = data.account;
        waidCore.application = data.application;
        deferred.resolve();
      }, function(){
        deferred.reject();
      });
    } else {
      deferred.reject();
    }
    return deferred.promise;
  };


  waidCore.initAuthentication = function() {
    var deferred = $q.defer();
    var waid = waidCore.getWaidData();
    if (waid && waid.token) {
        waidCore.token = waid.token;
    }
    if (waidCore.token) {
      waidService.authenticate().then(function(){
        waidCore.isLoggedIn = true;
        deferred.resolve();
      }, function(){
        waidCore.isLoggedIn = false;
        deferred.resolve();
      })
    } else {
      waidCore.isLoggedIn = false;
      deferred.resolve();
    }
    return deferred.promise;
  }
  // Main initializer for waid
  waidCore.initialize = function () {
    waidCore.initFP().then(function(){
      waidCore.preInitialize();
      var promises = [];
      promises.push(waidCore.applicationInit());
      promises.push(waidCore.initAlCode());
      promises.push(waidCore.initAuthentication());
      // init

      $q.all(promises).then(function () {
        waidCore.storeBaseData();
        waidCore.isInit = true;
        $rootScope.$broadcast('waid.core.strategy.isInit');
      }, function(){
        // console.log('Fatal error');
      });

      // Handle error code
      waidCore.initErrorCode();
    });
  };
  waidCore.profileCheck = function (data) {
    if (typeof data.profile_status != 'undefined' && data.profile_status.length > 0) {
      if (data.profile_status.indexOf('profile_ok') !== -1) {
        // Everything is ok!
        $rootScope.$broadcast('waid.core.strategy.profileCheck.success', data);
      } else if (typeof data.profile_status != 'undefined' && data.profile_status.indexOf('social_link_not_verified') !== -1) {
        // inactive social linking
        $rootScope.$broadcast('waid.core.strategy.profileCheck.linkProfile', data);
      } else if (typeof data.profile_status != 'undefined' && data.profile_status.indexOf('missing_profile_data') !== -1) {
        // Missing profile data!
        $rootScope.$broadcast('waid.core.strategy.profileCheck.completeProfile', data);
      } else {
        // pass do noting?
      }
    }
  };


  // Start listeners

  // When 403 response is given check if profile is valid
  $rootScope.$on('waid.core.services.noPermission', function (event, data) {
    if (waidCore.token) {
      waidService.userCompleteProfileGet().then(function (data) {
        waidCore.profileCheck(data);
      });
    }
  });

  // Check last action, if nog logged in try to place latest action (post comment when not logged in)
  $rootScope.$on('waid.services.authenticate.ok', function (event, data) {
    var action = waidCore.getLastAction();
    if (action.type == 'comment_post') {
      waidService.userCommentPost(action.data).then(function(data){
        $rootScope.$broadcast('waid.core.lastAction.commentPost', data);
      })
    }
    if (action.type == 'rating_post') {
      waidService.ratingPost(action.data).then(function(data){
        $rootScope.$broadcast('waid.core.lastAction.ratingPost', data);
      });
    }
    waidCore.clearLastAction();
  });

  $rootScope.$on('waid.services.application.userProfile.patch.ok', function (event, data) {
    waidCore.user = data;
  });

  $rootScope.$on('waid.services.application.userProfile.get.ok', function (event, data) {
    waidCore.user = data;
  });

  $rootScope.$on('waid.idm.strategy.action.doNotLinkSocialProfile', function (event, data) {
    waidCore.logout();
  });
  $rootScope.$on('waid.idm.strategy.action.doNotCompleteProfile', function (event, data) {
    waidCore.logout();
  });
  $rootScope.$on('waid.services.application.userLogin.post.ok', function (event, data) {
    waidCore.token = data['token'];
    waidCore.storeBaseData();
    waidCore.initAuthentication();
    waidCore.profileCheck(data);
  });

  $rootScope.$on('waid.services.application.userAutoLogin.get.ok', function (event, data) {
    waidCore.token = data['token'];
    waidCore.storeBaseData();
    waidCore.initAuthentication();
    waidCore.profileCheck(data);
  });

  $rootScope.$on('waid.services.application.userLinkSocialProfile.post.ok', function (event, data) {
    waidCore.initAuthentication();
    waidCore.profileCheck(data);
  });

  $rootScope.$on('waid.idm.strategy.action.logout', function (event) {
    waidService.userLogoutPost().then(function () {
      waidCore.clearUserData();
    }, function () {
      waidCore.clearUserData();
    });
  });

  $rootScope.$on('waid.idm.strategy.action.logoutAll', function (event) {
    waidService.userLogoutAllPost().then(function () {
      waidCore.clearUserData();
    }, function () {
      waidCore.clearUserData();
    });
  });

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

      $http.defaults.headers.common['Content-Type'] = 'application/json';
      // Set authorization token
      if (waidCore.token != null && waidCore.token != '' && waidCore.token != 'null') {
        $http.defaults.headers.common.Authorization = 'Token ' + waidCore.token;
      } else {
        $http.defaults.headers.common.Authorization = null;
      }
      $http.defaults.headers.common.FPID = this.fp;
      $http.defaults.headers.common.CID = 'AngularJS ' + waidCore.config.version;
      // Extend headers
      var headers = {};
      if (typeof args.headers != 'undefined') {
        angular.extend(headers, args.headers);
      }
      params = args.params || {};
      args = args || {};
      var deferred = $q.defer(), url = args.url, method = args.method || 'GET', params = params, data = args.data || {};
      that.running.push(url);
      waidCore.isLoading = true;
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
          if (this.running.length > 0) {
            waidCore.isLoading = true;
          } else {
            waidCore.isLoading = false;
          }
        }
        deferred.resolve(data, status);
      })).error(angular.bind(this, function (data, status, headers, config) {
        var index = this.running.indexOf(url);
        if (index > -1) {
          this.running.splice(index, 1);
          if (this.running.length > 0) {
            waidCore.isLoading = true;
          } else {
            waidCore.isLoading = false;
          }
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
          $rootScope.$broadcast('waid.core.services.noPermission', data);
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
      // waidCore.token = token;
      // waidCore.isLoggedIn = true;
      // waidCore.authenticateCheck = false;
      // waidCore.saveWaidData();
      // this.authenticate();
    },
    '_clearAuthorizationData': function () {
      this.authenticated = false;
      waidCore.token = null;
    },
    '_makeFileRequest': function (method, type, path, broadcast, data) {
      var that = this;
      var deferred = $q.defer();
      this.request({
        'method': method,
        'url': that._buildUrl(type, path),
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
    '_buildUrl': function (type, path) {
      switch (type) {
      case 'admin':
        return this.API_URL + '/admin/' + this.apiVersion + '/' + waidCore.account.id + path;
      case 'app':
        return this.API_URL + '/application/' + this.apiVersion + '/' + waidCore.account.id + '/' + $rootScope.waid.application.id + path;
      case 'public':
        return this.API_URL + '/public/' + this.apiVersion + path;
      default:
        return '';
      }
    },
    '_makeRequest': function (method, type, path, broadcast, data, skipIsInit) {
      var that = this;
      // If not dependend on initialisation then return promise of request
      if (waidCore.isInit || typeof skipIsInit != 'undefined' && skipIsInit == true) {
        var deferred = $q.defer();
        that.request({
          'method': method,
          'url': that._buildUrl(type, path),
          'data': data
        }).then(function (data) {
          $rootScope.$broadcast('waid.services.' + broadcast + '.' + method.toLowerCase() + '.ok', data);
          deferred.resolve(data);
        }, function (data) {
          $rootScope.$broadcast('waid.services.' + broadcast + '.' + method.toLowerCase() + '.error', data);
          deferred.reject(data);
        });
        return deferred.promise;
      } else {
        // If dependent on initialisation, return promise of isInit
        var deferred = $q.defer();
        var unregister = $rootScope.$on('waid.core.strategy.isInit', function (event) {
            that.request({
              'method': method,
              'url': that._buildUrl(type, path),
              'data': data
            }).then(function (data) {
              $rootScope.$broadcast('waid.services.' + broadcast + '.' + method.toLowerCase() + '.ok', data);
              deferred.resolve(data);
              unregister();
            }, function (data) {
              $rootScope.$broadcast('waid.services.' + broadcast + '.' + method.toLowerCase() + '.error', data);
              deferred.reject(data);
              unregister();
            });
        });
        return deferred.promise;
      }
    },
    'makeExternalRequest': function(method, url, data) {
      var that = this;
      var deferred = $q.defer();
      this.request({
        'method': method,
        'url': url,
        'data': data,
        'headers': { 'Content-Type': undefined }
      }).then(function (data) {
        deferred.resolve(data);
      }, function (data) {
        deferred.reject(data);
      });
      return deferred.promise;
    },
    'userLinkSocialProfilePost': function (data) {
      return this._makeRequest('POST', 'app', '/user/link-social-profile/', 'application.userLinkSocialProfile', data);
    },
    'userAssociateSocialDelete': function (provider) {
      return this._makeRequest('DELETE', 'app', '/user/associate-social/' + provider + '/', 'application.userAssociateSocial');
    },
    'userRegisterPost': function (data) {
      if (typeof data.return_url == 'undefined' || data.return_url == '') {
        data.return_url = waidCore.getAlCodeUrl();
      }
      return this._makeRequest('POST', 'app', '/user/register/', 'application.userRegister', data);
    },
    'userCompleteProfilePost': function (data) {
      if (typeof data.return_url == 'undefined' || data.return_url == '') {
        data.return_url = waidCore.getAlCodeUrl();
      }
      return this._makeRequest('POST', 'app', '/user/complete-profile/', 'application.userCompleteProfile', data);
    },
    'userCompleteProfileGet': function () {
      return this._makeRequest('GET', 'app', '/user/complete-profile/', 'application.userCompleteProfile');
    },
    'userLoginPost': function (data) {
      this._clearAuthorizationData();
      var that = this;
      return this._makeRequest('POST', 'app', '/user/login/', 'application.userLogin', data).then(function (data) {
        that._login(data.token);
        return data;
      });
    },
    'userAutoLoginGet': function (code) {
      var that = this;
      this._clearAuthorizationData();
      return this._makeRequest('GET', 'app', '/user/autologin/' + code + '/', 'application.userAutoLogin', null, true).then(function (data) {
        that._login(data.token);
        return data;
      });
    },
    'userLostLoginPost': function (data) {
      this._clearAuthorizationData();
      if (typeof data.return_url == 'undefined' || data.return_url == '') {
        data.return_url = waidCore.getAlCodeUrl();
      }
      return this._makeRequest('POST', 'app', '/user/lost-login/', 'application.userLostLogin', data);
    },
    'userLogoutPost': function () {
      var that = this;
      return this._makeRequest('POST', 'app', '/user/logout/', 'application.userLogout').then(function (data) {
        that._clearAuthorizationData();
        return data;
      });
    },
    'userLogoutAllPost': function () {
      var that = this;
      return this._makeRequest('POST', 'app', '/user/logout-all/', 'application.userLogoutAll').then(function (data) {
        that._clearAuthorizationData();
        return data;
      });
    },
    'userProfileGet': function () {
      return this._makeRequest('GET', 'app', '/user/profile/', 'application.userProfile');
    },
    'userPasswordPut': function (data) {
      return this._makeRequest('PUT', 'app', '/user/password/', 'application.userPassword', data);
    },
    'userProfilePatch': function (data) {
      return this._makeRequest('PATCH', 'app', '/user/profile/', 'application.userProfile', data);
    },
    'userMetadataPost': function(data){
      return this._makeRequest('POST', 'app', '/user/metadata/', 'application.userMetadata', data);
    },
    'userMetadataGet': function(){
      return this._makeRequest('GET', 'app', '/user/metadata/', 'application.userMetadata');
    },
    'userUsernamePut': function (data) {
      return this._makeRequest('PUT', 'app', '/user/username/', 'application.userUsername', data);
    },
    // Email
    'userEmailListGet': function () {
      return this._makeRequest('GET', 'app', '/user/email/', 'application.userEmailList');
    },
    'userEmailPost': function (data) {
      if (typeof data.return_url == 'undefined' || data.return_url == '') {
        data.return_url = waidCore.getAlCodeUrl();
      }
      return this._makeRequest('POST', 'app', '/user/email/', 'application.userEmail', data);
    },
    'userEmailDelete': function (id) {
      return this._makeRequest('DELETE', 'app', '/user/email/' + id + '/', 'application.userEmail');
    },
    // Telephone
    'userTelephoneListGet': function() {
      return this._makeRequest('GET', 'app', '/user/telephone/', 'application.userTelephoneList');
    },
    'userTelephonePost': function (data) {
      return this._makeRequest('POST', 'app', '/user/telephone/', 'application.userTelephone', data);
    },
    'userTelephonePut': function (id, data) {
      return this._makeRequest('PUT', 'app', '/user/telephone/' + id + '/', 'application.userTelephone', data);
    },
    'userTelephoneDelete': function (id) {
      return this._makeRequest('DELETE', 'app', '/user/telephone/' + id + '/', 'application.userTelephone');
    },
    // Addresses
    'userAddressListGet': function() {
      return this._makeRequest('GET', 'app', '/user/address/', 'application.userAddressList');
    },
    'userAddressPost': function (data) {
      return this._makeRequest('POST', 'app', '/user/address/', 'application.userAddress', data);
    },
    'userAddressPut': function (id, data) {
      return this._makeRequest('PUT', 'app', '/user/address/' + id + '/', 'application.userAddress', data);
    },
    'userAddressDelete': function (id) {
      return this._makeRequest('DELETE', 'app', '/user/address/' + id + '/', 'application.userAddress');
    },
    // Avatar
    'userAvatarPut': function (fd) {
      return this._makeFileRequest('PUT', 'app', '/user/avatar/', 'application.userAvatar', fd);
    },
    'socialProviderListGet': function () {
      return this._makeRequest('GET', 'app', '/social/providers/', 'application.socialProviderList');
    },
    'userCommentPatch': function (id, data) {
      return this._makeRequest('PATCH', 'app', '/user/comment/' + id + '/', 'application.userComment', data);
    },
    'userCommentPost': function (data) {
      if (typeof data.object_id != 'undefined' && data.object_id == 'currenturl') {
        data.object_id = waidCore.slugify($location.absUrl());
      }
      data.url = $location.absUrl();
      return this._makeRequest('POST', 'app', '/user/comment/', 'application.userComment', data);
    },
    'userCommentDelete': function (id) {
      return this._makeRequest('DELETE', 'app', '/user/comment/' + id + '/', 'application.userComment');
    },
    'userCommentListGet': function (params) {
      if (typeof params != 'undefined') {
        if (typeof params.object_id != 'undefined' && params.object_id == 'currenturl') {
          params.object_id = waidCore.slugify($location.absUrl());
        }
        var query = '?' + $.param(params);
      } else {
        var query = '';
      }
      return this._makeRequest('GET', 'app', '/user/comment/' + query, 'application.userCommentList');
    },
    'commentListGet': function (params) {
      if (typeof params != 'undefined') {
        if (typeof params.object_id != 'undefined' && params.object_id == 'currenturl') {
          params.object_id = waidCore.slugify($location.absUrl());
        }
        var query = '?' + $.param(params);
      } else {
        var query = '';
      }
      return this._makeRequest('GET', 'app', '/comment/' + query, 'application.commentList');
    },
    'commentVotePost': function (id, vote) {
      var data = { 'vote': vote };
      return this._makeRequest('POST', 'app', '/comment/' + id + '/vote/', 'application.commentVote', data);
    },
    'commentMarkPost': function (id, mark) {
      var data = { 'mark': mark };
      return this._makeRequest('POST', 'app', '/comment/' + id + '/mark/', 'application.commentMark', data);
    },
    'ratingPost': function (data) {
      if (typeof data.object_id != 'undefined' && data.object_id == 'currenturl') {
        data.object_id = waidCore.slugify($location.absUrl());
      }
      data.url = $location.absUrl();
      return this._makeRequest('POST', 'app', '/rating/', 'application.rating', data);
    },
    'ratingGet': function (object_id) {
      return this._makeRequest('GET', 'app', '/rating/' + object_id + '/', 'application.rating');
    },
    'articlesListGet': function () {
      return this._makeRequest('GET', 'app', '/articles/', 'application.articlesList');
    },
    'articlesGet': function (id) {
      return this._makeRequest('GET', 'app', '/articles/' + id + '/', 'application.articles');
    },
    'applicationInitGet': function () {
      return this._makeRequest('GET', 'app', '/application/init/', 'application.init',  {}, true);
    },
    'documentGet': function (doc) {
      return this._makeRequest('GET', 'app', '/docs/' + doc + '/', 'applicationDocument');
    },
    'adminUserAvatarDelete': function (id) {
      return this._makeRequest('DELETE', 'admin', '/user/' + id + '/avatar/', 'admin.userAvatar');
    },
    'adminUserListGet': function (params) {
      if (typeof params != 'undefined') {
        var query = '?' + $.param(params);
      } else {
        var query = '';
      }
      return this._makeRequest('GET', 'admin', '/user/' + query, 'admin.userList');
    },
    'adminUserPatch': function (id, data) {
      return this._makeRequest('PATCH', 'admin', '/user/' + id + '/', 'admin.user', data);
    },
    'adminUserGet': function (id) {
      return this._makeRequest('GET', 'admin', '/user/' + id + '/', 'admin.user');
    },
    'adminCommentListGet': function (params) {
      if (typeof params != 'undefined') {
        var query = '?' + $.param(params);
      } else {
        var query = '';
      }
      return this._makeRequest('GET', 'admin', '/comment/' + query, 'admin.commentList');
    },
    'adminCommentPatch': function (id, data) {
      return this._makeRequest('PATCH', 'admin', '/comment/' + id + '/', 'admin.comment', data);
    },
    'adminCommentDelete': function (id) {
      return this._makeRequest('DELETE', 'admin', '/comment/' + id + '/', 'admin.comment');
    },
    'adminDefaultEmailTemplatesGet': function () {
      if (!this.adminDefaultEmailTemplatesGetRunning) {
        this.adminDefaultEmailTemplatesGetRunning = this._makeRequest('GET', 'admin', '/default-email-templates/', 'application.adminDefaultEmailTemplates');
      }
      return this.adminDefaultEmailTemplatesGetRunning;
    },
    'adminAccountGet': function () {
      return this._makeRequest('GET', 'admin', '/account/', 'admin.account');
    },
    'adminAccountPatch': function (data) {
      return this._makeRequest('PATCH', 'admin', '/account/', 'admin.account', data);
    },
    'adminApplicationListGet': function () {
      return this._makeRequest('GET', 'admin', '/application/', 'admin.applicationList');
    },
    'adminApplicationGet': function (id) {
      return this._makeRequest('GET', 'admin', '/application/' + id + '/', 'admin.application');
    },
    'adminApplicationPatch': function (data) {
      return this._makeRequest('PATCH', 'admin', '/application/' + data.id + '/', 'admin.application', data);
    },
    'publicAccountGet': function (account) {
      return this._makeRequest('GET', 'public', '/account/' + account + '/', 'public.account', null, true);
    },
    'publicAccountCreatePost': function (data) {
      data.redirect_to_url = $location.absUrl() + 'admin/' + data.slug + '/';
      return this._makeRequest('POST', 'public', '/account/create/', 'admin.accountCreate', data, true);
    },
    'authenticate': function () {
      var that = this;
      var deferred = $q.defer();
      if (waidCore.token != null && waidCore.token != '' && waidCore.token != 'null') {
        this._makeRequest('GET', 'app', '/user/profile/', 'application.userProfile', null, true).then(function (data) {
          // Still needed?
          that.authenticated = true;
          waidCore.user = data;
          $rootScope.$broadcast('waid.services.authenticate.ok', that);
          deferred.resolve(data);
        }, function (data) {
          // Still needed?
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
    'initialize': function (url) {
      var that = this;
      this.API_URL = $window.location.protocol + '//';
      this.API_URL += url;
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
]).controller('WAIDCoreEmoticonModalCtrl', function ($scope, $rootScope, comment, selectionStart) {
  $scope.addEmoji = function (emoji) {
    comment = comment.slice(0, selectionStart) + emoji + comment.slice(selectionStart);
    $rootScope.waid.closeEmoticonsModal(comment);
  };
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
  $rootScope.waid = waidCore;
  $scope.waid = waidCore;
});
'use strict';
angular.module('waid.core.directives', [
  'waid.core',
  'waid.core.controllers',
  'waid.core.services'
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
}).directive('waidTranslation', function (waidCore) {
  return {
    restrict: 'E',
    template: function (elem, attr) {
      return waidCore.config.getTranslation(attr.module, attr.key);
    }
  };
}).directive('waidRenderTemplate', function (waidCore, waidService, $q) {
  return {
    restrict: 'E',
    template: function (elem, attr) {
      return attr.template;
    }
  };
});
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
      'linkSocialProfileModal': '/templates/idm/link-social-profile-modal.html',
      'lostLoginModal': '/templates/idm/lost-login-modal.html',
      'loginAndRegisterModal': '/templates/idm/login-and-register-modal.html',
      'userProfileModal': '/templates/idm/user-profile-modal.html',
      'loginAndRegisterHome': '/templates/idm/login-and-register-home.html',
      'socialLogin': '/templates/idm/social-login.html',
      'login': '/templates/idm/login.html',
      'register': '/templates/idm/register.html',
      'lostLogin': '/templates/idm/lost-login.html',
      'userProfileMenu': '/templates/idm/user-profile-menu.html',
      'userProfileHome': '/templates/idm/user-profile-home.html',
      'linkSocialProfile': '/templates/idm/link-social-profile.html',
      'associatedSocialAccounts': '/templates/idm/associated-social-accounts.html'
    },
    'translations': {
      'link_social_profile_intro': 'We hebben een bestaande account gevonden waarmee we de nieuwe social login willen koppelen. Ter beveiliging vragen we nogmaals je wachtwoord om deze koppeling af te ronden.',
      'link_social_profile_modal_title': 'Bestaande account koppelen aan nieuwe social account.',
      'link_social_profile_modal_close_button': 'Sluiten en niet koppelen',
      'link_social_profile_link_button': 'Doorgaan en social account koppelen',
      'auth-cancelled': 'Authenticatie is geannuleerd.',
      'auth-failed': 'Authenticatie is gefaald. Ons excuus voor het ongemak.',
      'auth-unknown-error': 'Een onbekende fout heeft zich voortgedaan. Ons excuus voor het ongemak.',
      'auth-missing-parameter': 'A needed parameter to continue the process was missing, usually raised by the services that need some POST data like myOpenID.',
      'auth-state-missing': 'The state parameter is missing from the server response.',
      'auth-state-forbidden': 'The state parameter returned by the server is not the one sent.',
      'auth-token-error': 'Geen permissie of toegang met de token. Kan hierdoor niet authenticeren. Controlleer de instellingen in de admin.',
      'auth-already-associated': 'Een andere gebruiker is al geassocieerd met de social account.',
      'system-error': 'Systeem fout. Ons excuus voor het ongemak.',
      'edit': 'Wijzigen',
      'loggedin_success': 'Je bent succesvol ingelogd.',
      'complete_profile_intro': 'Om verder te gaan met jouw account hebben we wat extra gegevens nodig...',
      'complete_profile_email_allready_sent': 'Er was al een bevestigings e-mail naar je toe gestuurd. Heb je deze niet ontvangen? voer opnieuw een geldig e-mailadres in en dan word er een nieuwe activatie link toegestuurd.',
      'delete':'Verwijderen',
      'male': 'Man',
      'female': 'Vrouw',
      'emails': 'E-mail adressen',
      'avatar': 'Profielfoto',
      'display_name': 'Profielnaam',
      'date_of_birth': 'Geboortedatum',
      'gender': 'Geslacht',
      'overview': 'Overzicht',
      'main': 'Algemeen',
      'telephone_numbers': 'Telefoon nummers',
      'telephone_number': 'Telefoon nummer',
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
      'profile_associated_social_accounts_title': 'Social koppelingen',
      'profile_overview_title': 'Overzicht',
      'profile_main_title': 'Algemeen',
      'profile_interests_title': 'Interesses',
      'profile_emails_title': 'E-mail adressen',
      'profile_username_title': 'Gebruikersnaam',
      'profile_password_title': 'Wachtwoord',
      'profile_logout_title': 'Uitloggen',
      'profile_telephone_numbers_title': 'Telefoon nummers',
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
      'terms_and_condition_modal_close': 'Sluiten',
      'telephone_number_help': 'Voer hier een geldig nummer in het formaat : (landnummer) (netnummer/06) (telefoon)',
      'profile_addresses_title': 'Adressen',
      'address': 'Adres',
      'city': 'Stad',
      'zipcode': 'Postcode',
      'country': 'Land',
      'about_public': 'Over mij',
      'about_public_help' : 'Publiekelijke informatie',
      'first_name':'Voornaam',
      'surname_prefix':'Tussenvoegsel',
      'surname':'Achternaam',
      'associated_social_accounts': 'Social koppelingen',
      'associated_social_accounts_intro': 'Met deze social koppelingen kan je snel inloggen op onze site. Klik op een van de social sites om te koppelen of te ontkoppelen.'
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
              'name': 'first_name',
              'labelKey': 'first_name',
              'type': 'input'
            },
            {
              'order': 30,
              'name': 'surname_prefix',
              'labelKey': 'surname_prefix',
              'type': 'input'
            },
            {
              'order': 40,
              'name': 'surname',
              'labelKey': 'surname',
              'type': 'input'
            },
            {
              'order': 50,
              'name': 'date_of_birth',
              'labelKey': 'date_of_birth',
              'type': 'date'
            },
            {
              'order': 60,
              'name': 'gender',
              'labelKey': 'gender',
              'type': 'gender'
            },
            {
              'order': 70,
              'name': 'avatar_thumb_50_50',
              'labelKey': 'avatar',
              'type': 'avatar'
            },
            {
              'order': 80,
              'name': 'about_public',
              'labelKey': 'about_public',
              'helpKey': 'about_public_help',
              'type': 'textarea'
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
          'fieldDefinitions': [
            {
              'order': 10,
              'noLabel': true,
              'name': 'emails',
              'labelKey': 'emails',
              'type': 'multipleEmail',
              'storageType':'none'
            }
          ]
        },
        {
          'key': 'telephone_numbers',
          'hideFromOverview':true,
          'order': 50,
          'fieldDefinitions': [
            {
              'order': 10,
              'noLabel': true,
              'name': 'telephone_numbers',
              'labelKey': 'telephone_numbers',
              'numberKey': 'telepone_number',
              'helpKey': 'telephone_number_help',
              'type': 'multipleTelephone',
              'hideFromOverview':true,
              'storageType':'none'
            }
          ]
        },
        {
          'key': 'addresses',
          'hideFromOverview':true,
          'order': 60,
          'fieldDefinitions': [
            {
              'order': 10,
              'noLabel': true,
              'name': 'addresses',
              'labelKey': 'addresses',
              'type': 'multipleAddresses',
              'hideFromOverview':true,
              'storageType':'none'
            }
          ]
        },
        {
          'key': 'associated_social_accounts',
          'introKey':'associated_social_accounts_intro',
          'order': 70,
          'noSaveButton': true,
          'fieldDefinitions': [
            {
              'order': 10,
              'noLabel': true,
              'name': 'associated_social_accounts',
              'labelKey': 'associated_social_accounts',
              'type': 'associatedSocialAccounts',
              'storageType':'none'
            }
          ]
        },
        {
          'key': 'username',
          'order': 70,
          'fieldDefinitions': [
            {
              'order': 10,
              'name': 'username',
              'labelKey': 'username',
              'type': 'input',
              'storageType':'username',
            }
          ]
        },
        {
          'key': 'password',
          'order': 80,
          'fieldDefinitions': [
            {
              'order': 10,
              'name': 'password',
              'labelKey': 'password',
              'type': 'password',
              'storageType':'password'
            },
            {
              'order': 20,
              'name': 'password_confirm',
              'labelKey': 'password_confirm',
              'type': 'password',
              'hideFromOverview': true,
              'storageType':'password'
            }
          ]
        }
      ]
    }
  });
});
'use strict';
angular.module('waid.idm.controllers', ['waid.core']).controller('WAIDIDMTermsAndConditionsCtrl', function ($scope, $rootScope, waidService, $interpolate) {
  waidService.documentGet('terms-and-conditions').then(function (data) {
    var text = $interpolate(data.text)($rootScope);
    $scope.document = text;
  });
}).controller('WAIDIDMProfileNavbarCtrl', function ($scope, $rootScope) {
  $scope.goToFieldSet = function (fieldSet) {
    $rootScope.$broadcast('waid.idm.goToFieldSet', fieldSet);
  };
}).controller('WAIDIDMProfileCtrl', function ($scope, $rootScope, waidCore, waidService, $filter, $timeout, $q) {
  // Goto fieldset event
  $rootScope.$on('waid.idm.goToFieldSet', function (event, fieldSet) {
    $scope.goToFieldSet(fieldSet);
  });

  $scope.waid = waidCore;
  // Set profile definition
  $scope.profileDefinition = waidCore.config.idm.profileDefinition;

  // Telephone numbers objects
  $scope.telephoneNumbers = [];
  
  // Addres objects
  $scope.addresses = [];

  // Emails fields
  $scope.inactiveEmails = [];
  $scope.activeEmails = [];
  $scope.email = { 'add': '' };
  // some weird stuff with model?
  // Main errors array
  $scope.errors = [];
  // Flag if uploading of avatar is running.
  $scope.isUploading = false;
  // Holds field names that are changed.
  $scope.changedFields = [];
  $scope.showFieldSet = function (fieldSet) {
    return fieldSet == $scope.currentFieldSet ? true : false;
  };
  $scope.getActiveFieldSetMenuClass = function (fieldSet) {
    return fieldSet == $scope.currentFieldSet ? 'active' : '';
  };
  $scope.goToFieldSet = function (fieldSet) {
    $scope.currentFieldSet = fieldSet;
    $scope.errors = [];
  };
  $scope.getAllFieldDefinitions = function () {
    var fieldDefinitions = [];
    for (var i = 0; $scope.profileDefinition.fieldSet.length > i; i++) {
      if (typeof $scope.profileDefinition.fieldSet[i].fieldDefinitions != 'undefined') {
        for (var a = 0; $scope.profileDefinition.fieldSet[i].fieldDefinitions.length > a; a++) {
          fieldDefinitions.push($scope.profileDefinition.fieldSet[i].fieldDefinitions[a]);
        }
      }
    }
    return fieldDefinitions;
  };

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
  $scope.fieldChange = function (fieldName) {
    if ($scope.changedFields.indexOf(fieldName) == -1) {
      $scope.changedFields.push(fieldName);
    }
  };
  $scope.updateProfileInfo = function () {
    var defer = $q.defer();
    waidService.userProfileGet().then(function (data) {
      var data = $scope.formatDataFromApi(data);
      $scope.errors = [];
      $scope.model = data;
      waidCore.user = data;
      defer.resolve(data);
    }, function (data) {
      $scope.errors = data;
      defer.reject(data);
    });
    return defer.promise;
  };
  $scope.uploadFile = function (files) {
    if (typeof files != 'undefined' && files.length > 0) {
      $scope.isUploading = true;
      var fd = new FormData();
      fd.append('file', files[0]);
      waidService.userAvatarPut(fd).then(function (data) {
        angular.extend(waidCore.user, data);
        $timeout(function () {
          $scope.isUploading = false;
        }, 1000);
      });
    }
  };

  $scope.formatDataFromApi = function (data) {
    var fieldDefinitions = $scope.getAllFieldDefinitions();
    for (var i = 0; fieldDefinitions.length > i; i++) {
      var fieldDefinition = fieldDefinitions[i];
      // Format date
      if (fieldDefinition.type == 'date') {
        if (typeof data[fieldDefinition.name] != 'undefined' && data[fieldDefinition.name] && !(data[fieldDefinition.name] instanceof Date)) {
          var dateParts = data[fieldDefinition.name].split('-');
          data[fieldDefinition.name] = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
          continue;
        }
      }
    }
    return data;
  };
  $scope.formatDataToApi = function (data) {
    var fieldDefinitions = $scope.getAllFieldDefinitions();
    var fieldValues = {};
    for (var i = 0; fieldDefinitions.length > i; i++) {
      var fieldDefinition = fieldDefinitions[i];
      // Format date
      if (fieldDefinition.type == 'date') {
        if (typeof data[fieldDefinition.name] != 'undefined' && data[fieldDefinition.name] instanceof Date) {
          fieldValues[fieldDefinition.name] = $filter('date')(data[fieldDefinition.name], 'yyyy-MM-dd');
          continue;
        }
        if (typeof data[fieldDefinition.name] != 'undefined' && !(data[fieldDefinition.name] instanceof Date)) {
          fieldValues[fieldDefinition.name] = $filter('date')(new Date(data[fieldDefinition.name]), 'yyyy-MM-dd');
          continue;
        }
      }
      fieldValues[fieldDefinition.name] = data[fieldDefinition.name];
    }
    return fieldValues;
  };
  $scope.saveMetadata = function (defaultMetadataPostData) {
    var defer = $q.defer();
    waidService.userMetadataPost(defaultMetadataPostData).then(function (data) {
      defer.resolve(data);
    }, function (data) {
      angular.extend($scope.errors, data);
      defer.reject(data);
    });
    return defer.promise;
  };
  $scope.saveDefault = function (defaultProfilePostData) {
    var defer = $q.defer();
    waidService.userProfilePatch(defaultProfilePostData).then(function (data) {
      defer.resolve(data);
    }, function (data) {
      angular.extend($scope.errors, data);
      defer.reject(data);
    });
    return defer.promise;
  };
  $scope.saveUsername = function (usernameProfilePostData) {
    var defer = $q.defer();
    waidService.userUsernamePut(usernameProfilePostData).then(function (data) {
      defer.resolve(data);
    }, function (data) {
      angular.extend($scope.errors, data);
      defer.reject(data);
    });
    return defer.promise;
  };
  $scope.savePassword = function (passwordProfilePostData) {
    var defer = $q.defer();
    waidService.userPasswordPut(passwordProfilePostData).then(function (data) {
      defer.resolve(data);
    }, function (data) {
      angular.extend($scope.errors, data);
      defer.reject(data);
    });
    return defer.promise;
  };
  $scope.save = function (forceProfileUpdate) {
    $scope.errors = [];
    var dataPrepared = $scope.formatDataToApi($scope.model);
    var fieldDefinitions = $scope.getAllFieldDefinitions();
    //var profilePostData = angular.copy($scope.model);
    //console.log(profilePostData);
    var defaultProfilePostData = {};
    var passwordProfilePostData = {};
    var usernameProfilePostData = {};
    var metadataProfilePostData = {};
    for (var i in fieldDefinitions) {
      var fieldDefinition = fieldDefinitions[i];

      if ($scope.changedFields.indexOf(fieldDefinition.name) != -1) {
        var storageType = (typeof fieldDefinition.storageType != 'undefined') ? fieldDefinition.storageType : 'default';
        if (storageType == 'username') {
          usernameProfilePostData[fieldDefinition.name] = dataPrepared[fieldDefinition.name];
          continue;
        }
        if (storageType == 'password') {
          passwordProfilePostData[fieldDefinition.name] = dataPrepared[fieldDefinition.name];
          continue;
        }
        // Skip storage
        if (storageType == 'none') {
          continue;
        }

        if (storageType == 'default') {
          defaultProfilePostData[fieldDefinition.name] = dataPrepared[fieldDefinition.name];
        }

        if (storageType == 'metadata') {
          metadataProfilePostData[fieldDefinition.name] = dataPrepared[fieldDefinition.name];
        }
      }
    }
    var promises = [];
    // Password store call
    if (Object.keys(passwordProfilePostData).length) {
      promises.push($scope.savePassword(passwordProfilePostData));
    }
    // Username store call
    if (Object.keys(usernameProfilePostData).length) {
      promises.push($scope.saveUsername(usernameProfilePostData));
    }
    // Default store  call
    if (Object.keys(defaultProfilePostData).length) {
      promises.push($scope.saveDefault(defaultProfilePostData));
    }
    // Metadata store call
    if (Object.keys(metadataProfilePostData).length) {
      promises.push($scope.saveMetadata(metadataProfilePostData));
    }

    // Telephone store call
    if ($scope.changedFields.indexOf('telephone_numbers') != -1) {
      promises.push($scope.saveTelephoneList());
    }

    // Addresses store call
    if ($scope.changedFields.indexOf('addresses') != -1) {
      promises.push($scope.saveAddressList());
    }

    $q.all(promises).then(function () {
      $scope.errors = [];
      $rootScope.$broadcast('waid.idm.userProfile.save.ok');
      $scope.currentFieldSet = 'overview';
      if (forceProfileUpdate) {
        $scope.updateProfileInfo();
      }
    }, function (errors) {
      // pass
    });
  };
  $scope.initEmails = function (data) {
    $scope.emails = data;
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
  $scope.addEmailEnter = function (keyEvent) {
    if (keyEvent.which === 13) {
      $scope.addEmail($scope.email.add);
      keyEvent.preventDefault();
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
    var data = { 'email': $scope.email.add };
    waidService.userEmailPost(data).then(function (data) {
      $scope.errors = [];
      $scope.loadEmailList();
      $scope.email.add = '';
    }, function (data) {
      $scope.errors = data;
    });
  };
  $scope.loadEmailList = function () {
    waidService.userEmailListGet().then(function (data) {
      $scope.initEmails(data.results);
    });
  };

  $scope.deleteTelephone = function(key) {
    $scope.telephoneNumbers.splice(key, 1)
  };
  $scope.changeTelephoneValue = function(fieldName, key) {
    $scope.fieldChange(fieldName);
    $scope.checkNewTelephoneNumer();
  };
  $scope.checkTelephoneChanged = function(originalObject, newObject) {
    if(originalObject.number != newObject.number) {
      return true;
    }
    return false;
  }

  $scope.checkNewTelephoneNumer = function()
  {
    var lastItem = $scope.telephoneNumbers.slice(-1).pop();
    if (typeof lastItem == 'undefined' || $scope.checkTelephoneAnyFieldFilled(lastItem)) {
      $scope.addNewTelephoneItem();
    }
  };
  $scope.addNewTelephoneItem = function() {
    $scope.telephoneNumbers.push({
      'id':'new',
      'number':'',
      'action': '',
      'errors':[]
    })
  };
  
  // Checks if any field is filled in..
  $scope.checkTelephoneAnyFieldFilled = function(telephone) {
    if (telephone.number != '') {
      return true;
    }
    return false;
  }

  $scope.saveTelephoneList = function() {
    for (var i=0; i < $scope.telephoneNumbers.length; i++) {
      $scope.telephoneNumbers[i].action = '';
      $scope.telephoneNumbers[i].errors = [];
      if (!$scope.checkTelephoneAnyFieldFilled($scope.telephoneNumbers[i])) {
        continue;
      }
      // Add new
      if ($scope.telephoneNumbers[i].id == 'new') {
        $scope.telephoneNumbers[i].action = 'new';
        continue;
      };

      // Changed values
      for (var a=0; a < $scope.originalTelephoneNumbers.length; a++) {
        // If original id match new id
        if ($scope.originalTelephoneNumbers[a].id == $scope.telephoneNumbers[i].id) {
          // If changed
          if ($scope.checkTelephoneChanged($scope.originalTelephoneNumbers[a], $scope.telephoneNumbers[i])) {
            $scope.telephoneNumbers[i].action = 'change';
          }
        }
      }
    }

    // Deleted telephones
    var deleteTelephones = angular.copy($scope.originalTelephoneNumbers);

    for (var a=0; a < deleteTelephones.length; a++) {
      for (var i=0; i < $scope.telephoneNumbers.length; i++) {
        if (typeof deleteTelephones[a] == 'undefined' || typeof deleteTelephones[a].id == 'undefined') {
          deleteTelephones.splice(a, 1);
          continue;
        }
        if (deleteTelephones[a].id == $scope.telephoneNumbers[i].id) {
          deleteTelephones.splice(a, 1);
        }
      }
    }

    var changeTelephone = function(i){
      var defer = $q.defer();
      waidService.userTelephonePut($scope.telephoneNumbers[i].id, $scope.telephoneNumbers[i]).then(function(data){
        defer.resolve(data);
      }, function(data){
        $scope.telephoneNumbers[i].errors = data;
        defer.reject(data);
      });
      return defer.promise;
    }

    var newTelephone = function(i){
      var defer = $q.defer();
      waidService.userTelephonePost($scope.telephoneNumbers[i]).then(function(data){
        defer.resolve(data);
      }, function(data){
        $scope.telephoneNumbers[i].errors = data;
        defer.reject(data);
      });
      return defer.promise;
    }

    var deleteTelephone = function(i){
      var defer = $q.defer();
      waidService.userTelephoneDelete(deleteTelephones[i].id).then(function(data){
        defer.resolve(data);
      }, function(data) {
        $scope.telephoneNumbers[i].errors = data;
        defer.reject(data);
      });
      return defer.promise;
    };
    var promises = new Array();
    for (var i=0; i < $scope.telephoneNumbers.length; i++) {
      if ($scope.telephoneNumbers[i].action == 'change') {
        promises.push(changeTelephone(i));
      }
      if ($scope.telephoneNumbers[i].action == 'new') {
        promises.push(newTelephone(i));
      }
    }
    
    for (var i=0; i < deleteTelephones.length; i++) {
      // Might have an empty telephone
      promises.push(deleteTelephone(i));

    }

    var defer = $q.defer();
    $q.all(promises).then(function () {
      $scope.loadTelephoneList();
      defer.resolve();
    }, function (errors) {
      defer.reject(errors);
    });
    return defer.promise;
  }

  $scope.saveAddressList = function() {
    for (var i=0; i < $scope.addresses.length; i++) {
      $scope.addresses[i].action = '';
      $scope.addresses[i].errors = [];
      if (!$scope.checkAddressAnyFieldFilled($scope.addresses[i])) {
        continue;
      }
      // Add new
      if ($scope.addresses[i].id == 'new') {
        $scope.addresses[i].action = 'new';
        continue;
      };

      // Changed values
      for (var a=0; a < $scope.originalAddresses.length; a++) {
        // If original id match new id
        if ($scope.originalAddresses[a].id == $scope.addresses[i].id) {
          // If changed
          if ($scope.checkAddressChanged($scope.originalAddresses[a], $scope.addresses[i])) {
            $scope.addresses[i].action = 'change';
          }
        }
      }
    }

    // Deleted addresses
    var deleteAddresss = angular.copy($scope.originalAddresses);

    for (var a=0; a < deleteAddresss.length; a++) {
      for (var i=0; i < $scope.addresses.length; i++) {
        if (typeof deleteAddresss[a] == 'undefined' || typeof deleteAddresss[a].id == 'undefined') {
          deleteAddresss.splice(a, 1);
          continue;
        }
        if (deleteAddresss[a].id == $scope.addresses[i].id) {
          deleteAddresss.splice(a, 1);
        }
      }
    }

    var changeAddress = function(i){
      var defer = $q.defer();
      waidService.userAddressPut($scope.addresses[i].id, $scope.addresses[i]).then(function(data){
        defer.resolve(data);
      }, function(data){
        $scope.addresses[i].errors = data;
        defer.reject(data);
      });
      return defer.promise;
    }

    var newAddress = function(i){
      var defer = $q.defer();
      waidService.userAddressPost($scope.addresses[i]).then(function(data){
        defer.resolve(data);
      }, function(data){
        $scope.addresses[i].errors = data;
        defer.reject(data);
      });
      return defer.promise;
    }

    var deleteAddress = function(i){
      var defer = $q.defer();
      waidService.userAddressDelete(deleteAddresss[i].id).then(function(data){
        defer.resolve(data);
      }, function(data) {
        $scope.addresses[i].errors = data;
        defer.reject(data);
      });
      return defer.promise;
    };
    var promises = new Array();
    for (var i=0; i < $scope.addresses.length; i++) {
      if ($scope.addresses[i].action == 'change') {
        promises.push(changeAddress(i));
      }
      if ($scope.addresses[i].action == 'new') {
        promises.push(newAddress(i));
      }
    }
    
    for (var i=0; i < deleteAddresss.length; i++) {
      // Might have an empty telephone
      promises.push(deleteAddress(i));

    }

    var defer = $q.defer();
    $q.all(promises).then(function () {
      $scope.loadAddressList();
      defer.resolve();
    }, function (errors) {
      defer.reject(errors);
    });
    return defer.promise;
  }



  $scope.loadTelephoneList = function() {
    waidService.userTelephoneListGet().then(function(data){
      $scope.telephoneNumbers = data.results;
      $scope.originalTelephoneNumbers = angular.copy($scope.telephoneNumbers);
      $scope.checkNewTelephoneNumer();
    })
  };


  $scope.changeAddressValue = function(fieldName, addressField, key) {
    $scope.fieldChange(fieldName);
    $scope.checkNewAddress();
  };

  $scope.addNewAddress = function() {
    $scope.addresses.push({
      'id':'new',
      'address':'',
      'city':'',
      'zipcode':'',
      'country':'',
      'action': '',
      'errors':[]
    });
  }

  $scope.checkAddressChanged = function(originalObject, newObject) {
    if (originalObject.address != newObject.address) {
      return true;
    }
    if (originalObject.zipcode != newObject.zipcode) {
      return true;
    }
    if (originalObject.city != newObject.city) {
      return true;
    }
    if (originalObject.country != newObject.country) {
      return true;
    }
    return false;
  };

  $scope.deleteAddress = function(key) {
    $scope.addresses.splice(key, 1)
  }
  // Checks if any field is filled in..
  $scope.checkAddressAnyFieldFilled = function(address) {
    if (address.address != "") {
      return true;
    }
    if (address.zipcode != "") {
      return true;
    }
    if (address.city != "") {
      return true;
    }
    if (address.country != "") {
      return true;
    }
    return false;
  }

  $scope.checkNewAddress = function(){
    var lastItem = $scope.addresses.slice(-1).pop();
    if (typeof lastItem == 'undefined' || $scope.checkAddressAnyFieldFilled(lastItem)) {
      $scope.addNewAddress();
    }
  }

  $scope.loadAddressList = function() {
    waidService.userAddressListGet().then(function(data){
      $scope.addresses = data.results;
      $scope.originalAddresses = angular.copy($scope.addresses);
      $scope.checkNewAddress();
    })
  };


  $scope.init = function() {
    $scope.updateProfileInfo();
    $scope.loadEmailList();
    $scope.loadTelephoneList();
    $scope.loadAddressList();
  }

  $scope.init();
  
}).controller('WAIDIDMCompleteProfileCtrl', function ($scope, $location, $window, waidService) {
  $scope.mode = 'complete';
}).controller('WAIDIDMLinkSocialProfileCtrl', function ($scope, $location, $window, waidService) {
  $scope.model = {'password':''}
  $scope.errors = [];
  $scope.linkSocialProfile = function(){
    $scope.errors = [];
    waidService.userLinkSocialProfilePost($scope.model).then(function(data){
      $scope.errors = [];
    }, function(data){
      $scope.errors = data;
    })
  }
})
.controller('WAIDIDMLoginCtrl', function ($scope, $location, waidService, waidCore) {
  $scope.waid = waidCore;
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
}).controller('WAIDIDMLostLoginCtrl', function ($scope, $location, waidService, waidCore) {
  $scope.waid = waidCore;
  $scope.model = { 'email': '' };
  $scope.errors = [];
  $scope.submit = function () {
    waidService.userLostLoginPost($scope.model).then(function (data) {
      $scope.errors = [];
    }, function (data) {
      $scope.errors = data;
    });
  };
}).controller('WAIDIDMSocialCtrl', function ($scope, $location, waidService, $window, waidCore) {
  $scope.waid = waidCore;
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
  $scope.getProviders();
}).controller('WAIDIDMAssociatedSocialAccountsCtrl', function ($scope, $location, waidService, $window, waidCore) {
  $scope.waid = waidCore;
  $scope.providers = [];
  $scope.getProviders = function () {
    waidService.socialProviderListGet().then(function (data) {
      for (var i = 0; i < data.length; i++) {
        data[i].url = data[i].url + '?waid=' + encodeURIComponent(data[i].waid_data) + '&return_url=' + encodeURIComponent(waidCore.getAlCodeUrl());
      }
      $scope.providers = data;
    });
  };
  $scope.associateSocialAction = function (provider) {
    // Toggle between linking and unlinking
    if (provider.linked) {
      waidService.userAssociateSocialDelete(provider.backend).then(function(){
        $scope.getProviders();
      })
    } else {
      $window.location.assign(provider.url);
    }
  };
  $scope.getProviders();
}).controller('WAIDIDMRegisterCtrl', function ($scope, $route, waidService, $location, $uibModal, waidCore) {
  $scope.waid = waidCore;
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
]).directive('waidProfile', function (waidCore) {
  return {
    restrict: 'E',
    controller: 'WAIDIDMProfileCtrl',
    scope:{
      currentFieldSet:'@'
    },
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('idm', 'profile');
    }
  };
}).directive('waidLinkSocialProfile', function (waidCore) {
  return {
    restrict: 'E',
    controller: 'WAIDIDMLinkSocialProfileCtrl',
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('idm', 'linkSocialProfile');
    }
  };
}).directive('waidUserProfileNavbar', function (waidCore) {
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
}).directive('waidLoginAndRegisterHome', function (waidCore) {
  return {
    restrict: 'E',
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('idm', 'loginAndRegisterHome');
    }
  };
}).directive('waidLogin', function (waidCore) {
  return {
    restrict: 'E',
    controller:'WAIDIDMLoginCtrl',
    scope:{},
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('idm', 'login');
    }
  };
}).directive('waidRegister', function ($rootScope, waidCore) {
  return {
    restrict: 'E',
    controller: 'WAIDIDMRegisterCtrl',
    scope:{
      modus:'@'
    },
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('idm', 'register');
    }
  };
}).directive('waidSocialLogin', function (waidCore) {
  return {
    restrict: 'E',
    controller: 'WAIDIDMSocialCtrl',
    scope:{},
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('idm', 'socialLogin');
    }
  };
}).directive('waidLostLogin', function (waidCore) {
  return {
    restrict: 'E',
    controller: 'WAIDIDMLostLoginCtrl',
    scope:{},
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('idm', 'lostLogin');
    }
  };
}).directive('waidAssociatedSocialAccounts', function (waidCore) {
  return {
    restrict: 'E',
    controller: 'WAIDIDMAssociatedSocialAccountsCtrl',
    scope:{},
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('idm', 'associatedSocialAccounts');
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
      'commentsOrderButton': '/templates/comments/comments-order-button.html',
      'commentsItem':'/templates/comments/comment-item.html'
    },
    'translations': {
      'postCommentButton': 'Plaats comment',
      'actionDropdownTitle': 'Opties',
      'editCommentTitle': 'Aanpassen',
      'markCommentSpamTitle': 'Markeer als spam',
      'commentMarkedAsSpam': 'Gemarkeerd als spam!',
      'deleteCommentTitle': 'Verwijderen',
      'confirmDeleteContentBody': 'Weet je zeker dat je de comment wilt verwijderen?',
      'confirmDeleteContentTitle': 'Comment verwijderen?',
      'updateCommentButton': 'Aanpassen',
      'voteOrderNewestFirst': 'Nieuwste eerst',
      'voteOrderOldestFirst': 'Oudste eerst',
      'voteOrderTopFirst': 'Top comments',
      'addEmoticonButtonText': 'Emoji toevoegen',
      'isLockedTitle': 'Comment is gelocked',
      'loadMoreComments':'Laad meer'
    }
  });
});
'use strict';
angular.module('waid.comments.controllers', [
  'waid.core',
  'waid.core.strategy',
  'waid.core.app.strategy'
]).controller('WAIDCommentsCtrl', function ($scope, $rootScope, waidService, $q, waidCore, waidCoreStrategy, waidCoreAppStrategy) {
  $scope.ordering = angular.isDefined($scope.ordering) ? $scope.ordering : '-created';
  $scope.orderingEnabled = angular.isDefined($scope.orderingEnabled) && $scope.orderingEnabled == 'false' ? false : true;
  $scope.objectId = angular.isDefined($scope.objectId) ? $scope.objectId : 'currenturl';
  $scope.waid = $rootScope.waid;
  $scope.comment = { 'comment': '' };
  $scope.limit = 10;
  $scope.offset = 0;
  $scope.showMore = false;

  $scope.orderCommentList = function (ordering) {
    $scope.ordering = ordering;
    $scope.loadComments();
  };
  $scope.voteComment = function (comment, vote) {
    if (!$rootScope.waid.user) {
      waidCore.openLoginAndRegisterHome();
    } else {
      waidService.commentVotePost(comment.id, vote).then(function (data) {
        comment.vote_up_count = data.vote_up_count;
        comment.vote_down_count = data.vote_down_count;
        comment.vote_count = data.vote_count;
      });
    }
  };
  $scope.markComment = function (comment, mark) {
    waidService.commentMarkPost(comment.id, mark).then(function (data) {
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
    waidService.userCommentPatch(comment.id, patch_comment).then(function (data) {
      comment.is_edit = false;
      comment.comment_formatted = data.comment_formatted;
      comment.comment = data.comment;
    });
  };
  $scope.deleteComment = function (comment) {
    waidService.userCommentDelete(comment.id).then(function (data) {
      var index = $scope.comments.indexOf(comment);
      $scope.comments.splice(index, 1);
    });
  };
 
  /**
   * Process comments recursively, add extra data
   */
  $scope.processComments = function (comments) {
    for(var i = 0; i < comments.length; i++) {
      comments[i].is_edit = false;
      if (comments[i].user.id == $rootScope.waid.user.id) {
        comments[i].is_owner = true;
      }
      if (typeof comments[i].children != 'undefined' && comments[i].children && comments[i].children.length > 0) {
        comments[i].children = $scope.processComments(comments[i].children);
      }
    }
    return comments;
  }
  $scope.loadComments = function (append) {
    var params = {
      'object_id': $scope.objectId,
      'ordering': $scope.ordering
    }
    if (typeof append == 'undefined') {
      var append = false;
      $scope.offset = 0;
    } else {
      var append = true;
    }
    params['limit'] = $scope.limit;

    if (append) {
      $scope.offset = $scope.offset + $scope.limit;
      params['offset'] = $scope.offset;
    }

    waidService.commentListGet(params).then(function (data) {
      if (data.results.length == 0 || data.results.length < $scope.limit) {
        $scope.showMore = false;
      } else {
        $scope.showMore = true;
      }

      if (data.results.length > 0) {
        data.results = $scope.processComments(data.results);

        // Check if we need to append comments
        if (append) {
          for (var i = 0; data.results.length > i; i++) {
            $scope.comments.push(data.results[i]);
          }
        } else {
          $scope.comments = data.results;
        }
      }
    });
  };
  $scope.post = function () {
    $scope.comment.object_id = $scope.objectId;
    if (!$rootScope.waid.user) {
      waidCore.setLastAction('comment_post', $scope.comment);
      waidCore.openLoginAndRegisterHome();
      $scope.comment.comment = '';
    } else {
      waidService.userCommentPost($scope.comment).then(function (data) {
        $scope.comment.comment = '';
        $scope.loadComments();
      });
    }
  };
  $scope.addEmoji = function (targetId, comment) {
    if (comment.id) {
      var commentText = comment.comment_formatted;
    } else {
      var commentText = comment.comment;
    }
    waidCore.openEmoticonsModal(targetId, commentText).then(function (data) {
      if (comment.id) {
        for (var i = 0; i < $scope.comments.length; i++) {
          if ($scope.comments[i].id = comment.id) {
            $scope.comments[i].comment = data;
            $scope.comments[i].comment_formatted = data;
          }
        }
      } else {
        $scope.comment.comment = data;
      }
    });
  };

  $scope.$on('waid.core.lastAction.commentPost', function(data) {
    $scope.loadComments();
  });
});
'use strict';
angular.module('waid.comments.directives', [
  'waid.core',
  'waid.comments.controllers'
]).directive('waidComments', function (waidCore, $window) {
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
    },
    link: function ($scope, $element, attr){
      var isLoaded = false;

      // Main function to check if element is visible in viewport
      function elementInViewport(el) {
        var top = el.offsetTop;
        var left = el.offsetLeft;
        var width = el.offsetWidth;
        var height = el.offsetHeight;

        while(el.offsetParent) {
          el = el.offsetParent;
          top += el.offsetTop;
          left += el.offsetLeft;
        }
        var load = (
          top >= window.pageYOffset &&
          left >= window.pageXOffset &&
          (top + height) <= (window.pageYOffset + window.innerHeight) &&
          (left + width) <= (window.pageXOffset + window.innerWidth)
        );
        if (load) {
          $scope.loadComments();
          isLoaded = true;
        }
      };

      // on scroll check
      $(window).scroll(function(){
        if (!isLoaded) {
          elementInViewport($element[0]);
        }
      });

      // Intitial check
      elementInViewport($element[0]);
    }
  };
}).directive('waidCommentsOrderButton', function (waidCore) {
  return {
    restrict: 'E',
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('comments', 'commentsOrderButton');
    }
  };
}).directive('waidCommentsItem', function (waidCore) {
  return {
    scope:{
      'comment':'=',
      'markComment':'=',
      'editComment':'=',
      'deleteComment':'=',
      'voteComment':'=',
      'updateComment':'=',
      'addEmoji':'=',
      'waid':'='
    },
    restrict: 'E',
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('comments', 'commentsItem');
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
    'templates': { 'ratingWidget': '/templates/rating/widget.html' },
    'translations': {}
  });
});
'use strict';
angular.module('waid.rating.controllers', [
  'waid.core',
  'waid.core.strategy',
  'waid.core.app.strategy'
]).controller('WAIDRatingCtrl', function ($scope, $rootScope, waidCore, waidService, waidCoreStrategy, waidCoreAppStrategy) {
  $scope.objectId = angular.isDefined($scope.objectId) ? $scope.objectId : 'currenturl';
  // Fixed for now..
  $scope.stars = [
    {
      'active': false,
      'value': 1
    },
    {
      'active': false,
      'value': 2
    },
    {
      'active': false,
      'value': 3
    },
    {
      'active': false,
      'value': 4
    },
    {
      'active': false,
      'value': 5
    }
  ];
  $scope.rating = {
    'average': 0,
    'total_votes': 0,
    'rating': []
  };
  $scope.rate = function (value) {
    var data = {
      'object_id': $scope.objectId,
      'value': value
    };
    if (!$rootScope.waid.user) {
      waidCore.setLastAction('rating_post', data);
      waidCore.openLoginAndRegisterHome();
    } else {
      waidService.ratingPost(data).then(function (data) {
        $scope.rating = data;
        $scope.rateOut();
      });
    }
  };
  $scope.rateOver = function (value) {
    for (var i = 0; $scope.stars.length > i; i++) {
      if (i < value) {
        $scope.stars[i].active = true;
      } else {
        $scope.stars[i].active = false;
      }
    }
  };
  // Rateout initialises the rating based on the current rating object
  $scope.rateOut = function () {
    var average_rounded = Math.round($scope.rating.average);
    for (var i = 0; $scope.stars.length > i; i++) {
      if (i < average_rounded) {
        $scope.stars[i].active = true;
      } else {
        $scope.stars[i].active = false;
      }
    }
  };
  
  $scope.loadRating = function() {
    waidService.ratingGet($scope.objectId).then(function (data) {
      $scope.rating = data;
      // Init rating on view
      $scope.rateOut();
    });
  };
  
  $scope.$on('waid.core.lastAction.ratingPost', function(data) {
    $scope.loadRating();
  });
});
'use strict';
angular.module('waid.rating.directives', [
  'waid.core',
  'waid.rating.controllers'
]).directive('waidRating', function (waidCore) {
  return {
    restrict: 'E',
    scope: { objectId: '@?' },
    controller: 'WAIDRatingCtrl',
    templateUrl: function (elem, attrs) {
      return attrs.templateUrl || waidCore.config.getTemplateUrl('rating', 'ratingWidget');
    },
    link: function ($scope, $element, attr){
      var isLoaded = false;

      // Main function to check if element is visible in viewport
      function elementInViewport(el) {
        var top = el.offsetTop;
        var left = el.offsetLeft;
        var width = el.offsetWidth;
        var height = el.offsetHeight;

        while(el.offsetParent) {
          el = el.offsetParent;
          top += el.offsetTop;
          left += el.offsetLeft;
        }
        var load = (
          top >= window.pageYOffset &&
          left >= window.pageXOffset &&
          (top + height) <= (window.pageYOffset + window.innerHeight) &&
          (left + width) <= (window.pageXOffset + window.innerWidth)
        );
        if (load) {
          $scope.loadRating();
          isLoaded = true;
        }
      };

      // on scroll check
      $(window).scroll(function(){
        if (!isLoaded) {
          elementInViewport($element[0]);
        }
      });

      // Intitial check
      elementInViewport($element[0]);
    }
  };
});