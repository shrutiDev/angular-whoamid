'use strict';
angular.module('waid.core', [])
  .service('waidCore', function ($rootScope) {
    var waid = angular.isDefined($rootScope.waid) ? $rootScope.waid : {};


    waid.config = {};
    waid.config.mergeRecursive = function(obj1, obj2) {
        for (var p in obj2) {
          try {
            // Property in destination object set; update its value.
            if ( obj2[p].constructor==Object ) {
              obj1[p] = this.mergeRecursive(obj1[p], obj2[p]);
            } else {
              obj1[p] = obj2[p];
            }
          } catch(e) {
            obj1[p] = obj2[p];
          }
        }
        return obj1;
    }

    waid.config.patchConfig = function(key, config) {
        this[key] = this.mergeRecursive(this[key], config)
    }

    waid.config.setConfig = function(key, config) {
        this[key] = config;
    }

    waid.config.getConfig = function(key) {
        //console.log(key);
        parts = key.split('.')
        if (parts.length > 0) {
          var config = this;
          for (var i=0; i < parts.length; i++) {
            if (typeof config[parts[i]] !== 'undefined') {
              if (typeof config[parts[i]] == 'object') {
                // set new config
                config = config[parts[i]];
                continue;
              } else {
                return config[parts[i]]
              }
            } else {
              return false;
            }
          }
        }
        return this[key];
    }

    // waid.config = {};

    // Assume user is not logged in until we hear otherwise

    // waid.openLoginAndRegisterHomeModal = function() {
    //     waidCoreStrategy.openLoginAndRegisterHomeModal();
    // };
    // waid.openUserProfileHomeModal = function() {
    //     waidCoreStrategy.openUserProfileHomeModal();
    // };
    // waid.openLostLoginModal = function() {
    //     this.closeAllModals();
    //     waidCoreStrategy.openLostLoginModal();
    // };
    // waid.openTermsAndConditionsModal = function() {
    //     waidCoreStrategy.openTermsAndConditionsModal();
    // };
    // waid.openEmoticonsModal = function(text) {
    //     waidCoreStrategy.openEmoticonsModal(text);
    // };
    // waid.closeEmoticonsModal =  function(){
    //     waidCoreStrategy.closeEmoticonsModal();
    // };
    waid.closeAllModals = function(){
        waid.closeUserProfileModal();
        waid.closeLoginAndRegisterModal();
        waid.closeLostLoginModal();
        waid.closeTermsAndConditionsModal();
    };
    waid.getTranslation = function(module, key) {
        if (typeof waid.config[module].translations[key] != 'undefined') {
            return waid.config[module].translations[key];
        } 
        return 'Unknown key `' + key + '` for module `' + module + '`';
    };

    waid.clearAccount = function() {
        $cookies.remove('account');
        $cookies.remove('application');
        $rootScope.waid.account = false;
        $rootScope.waid.application = false;
        $rootScope.waid.user = false;
        // waidService._clearAuthorizationData();
    };

    waid.clearUser = function(){
         $rootScope.waid.user = false;
         // waidService._clearAuthorizationData();
    };
  
    waid.utils = {};


    waid.user = false;
    waid.account = false;
    waid.application = false;
    waid.isInit = false;

    $rootScope.waid = waid;
    
    return waid;
  });
