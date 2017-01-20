'use strict';
angular.module('waid.core', ['ngCookies', 'LocalStorageModule']).service('waidCore', ['$rootScope', '$cookies', 'localStorageService', '$location', function ($rootScope, $cookies, localStorageService, $location) {
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
    localStorageService.set('waid_last_action', object);
  };
  waid.getLastAction = function () {
    var object = localStorageService.get('waid_last_action');
    if (object) {
      return object;
    }
    return false;
  };
  waid.setLastProfileFieldSet = function(action) {
    localStorageService.set('waid_last_profile_field_set', action);
  }
  waid.getLastProfileFieldSet = function () {
    var data = localStorageService.get('waid_last_profile_field_set');
    if (data) {
      localStorageService.remove('waid_last_profile_field_set');
      return data;
    }
    return false;
  };
  waid.clearLastAction = function (){
    localStorageService.remove('waid_last_action');
  };
  waid.clearWaidData = function () {
    $rootScope.waid.account = false;
    $rootScope.waid.application = false;
    $rootScope.waid.user = false;
    $rootScope.waid.isLoggedIn = false;
    $rootScope.waid.token = false;
    localStorageService.remove('waid');
  };
  waid.clearUserData = function () {
    $rootScope.waid.user = false;
    $rootScope.waid.isLoggedIn = false;
    $rootScope.waid.token = false;
    waid.saveWaidData();
  };
  waid.saveWaidData = function (waid) {
    var encrypted = false;
    if (waid) {
      waid['timestamp'] = Date.now();
      var jsonData = JSON.stringify(waid);
      var encrypted = CryptoJS.AES.encrypt(jsonData, $location.host()).toString();
    }
    localStorageService.set('waid', encrypted, 'localStorage');
  };
  waid.getWaidData = function () {
    var waid = localStorageService.get('waid');

    if (waid) {
      try{
        var decrypted = CryptoJS.AES.decrypt(waid, $location.host());
        return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
      } catch (err) {
        return false;
      }
    }
    return false;
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
}]);