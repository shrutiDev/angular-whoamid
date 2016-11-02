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
  waidCore.logout = function () {
    waidService.userLogoutPost().then(function(){
      waidCore.clearUserData();
    }, function(){
      waidCore.clearUserData();
    });
  };
  waidCore.logoutAll = function () {
    waidService.userLogoutAllPost().then(function(){
      waidCore.clearUserData();
    }, function(){
      waidCore.clearUserData();
    });
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
      waidService.applicationGet().then(function (data) {
        waidCore.application = data;
      });
      waidCore.saveWaidData();
    });
  };
  
  waidCore.initAlCode = function(){
    var deferred = $q.defer();
    var waidAlCode = $location.search().waidAlCode;
    if (waidAlCode) {
      waidService.userAutoLoginGet(waidAlCode).then(function (data) {
         deferred.resolve(data);
         $location.search('waidAlCode', null);
      }, function(data) {
         deferred.reject(data);
      });
    } else {
      deferred.resolve();
    }

    return deferred.promise;
  }

  waidCore.initFP = function() {
    var deferred = $q.defer();
    new Fingerprint2().get(function (result, components) {
      waidService.fp = result;
      deferred.resolve(result);
    });
    return deferred.promise;
  }

  // Main initializer for waid
  waidCore.initialize = function () {
    // Set fingerpint
    waidCore.initFP().then(function(){
      // Init if account and app are fixed
      if (waidCore.account.id && waidCore.application.id) {
        // Try to set by cookie
        var waid = waidCore.getWaidData();
        if (waid && waid.account && waid.account.id == waidCore.account.id && waid.application && waid.application.id == waidCore.application.id) {
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
        // Try to get by cookie
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

      // If all isset, then continue to validate user
      waidCore.initAlCode().then(function(){
        if (waidCore.isBaseVarsSet()) {
          if (waidCore.token) {
            waidService.authenticate().then(function () {
              waidCore.isLoggedIn = true;
              waidCore.isInit = true;
              $rootScope.$broadcast('waid.core.isInit', waidCore);
            }, function () {
              waidCore.isLoggedIn = false;
              waidCore.isInit = true;
              $rootScope.$broadcast('waid.core.isInit', waidCore);
            });
          } else {
            waidCore.isInit = true;
            $rootScope.$broadcast('waid.core.isInit', waidCore);
          }
        }
      });
    });
  };

  waidCore.isBaseVarsSet = function() {
     if (typeof waidCore.account != 'undefined' && typeof waidCore.application != 'undefined' &&
         waidCore.account != false && waidCore.application != false) {
        return true;
     } else {
        return false;
     }
  }

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
});