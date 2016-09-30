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
    return '/static/idm/angular-whoamid/src' + this[module]['templates'][key];
  };
  waid.config.getTemplate = function(url) {
    return '/static/idm/angular-whoamid/src' + url;
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
  waid.isAuthenticated = function () {
    if (waid.user && waid.account && waid.application) {
      return true;
    }
    return false;
  };
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