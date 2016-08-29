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
    waidCore.clearWaidData();
  };
  waidCore.logoutAll = function () {
    waidService.userLogoutAllPost();
    waidCore.clearWaidData();
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
  waidCore.initRetrieveData = function (accountId, applicationId) {
    waidService.publicAccountGet(accountId).then(function (data) {
      var application = data.main_application;
      delete data.main_application;

      waidCore.account = data;
      waidCore.application = application;
      waidCore.isInit = true;
      waidCore.saveWaidData();
    });
  };
  waidCore.initialize = function () {
    // Check url params to set account and application manually
    var waidAccountId = $location.search().waidAccountId;
    var waidApplicationId = $location.search().waidApplicationId;

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
      // Init once
      if (!waid.isInit) {
        if (waid.account && waid.application && waid.token) {
          waidService.authenticate().then(function(){
            waid.isInit = true;
          }, function(){
            waid.isInit = true;
          })
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