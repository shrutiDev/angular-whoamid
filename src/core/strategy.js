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
  waidCore.logout = function () {
    waidService.userLogoutPost();
  };
  waidCore.logoutAll = function () {
    waidService.userLogoutAllPost();
  };
  waidCore.addEmoticon = function (emoticon) {
    var input = document.getElementById(this.targetId);
    input.value = [
      input.value.slice(0, input.selectionStart),
      emoticon,
      input.value.slice(input.selectionStart)
    ].join('');
    input.focus();
    $rootScope.waid.closeEmoticonsModal();
  };
  var initRetrieveData = function (accountId, applicationId) {
    waidService.publicAccountGet(accountId).then(function () {
      var application = data.main_application;
      delete data.main_application;
      waidCore.account = data;
      // TODO retrieve full application info
      waidCore.application = { 'id': applicationId };
      $cookies.putObject('account', waidCore.account);
      $cookies.putObject('application', waidCore.application);
    });
  };
  waidCore.initialize = function () {
    // Init if account and app are fixed
    if (waidCore.account.id && waidCore.application.id) {
      if ($cookies.getObject('account') && $cookies.getObject('application')) {
        try {
          waidCore.account = $cookies.getObject('account');
          waidCore.application = $cookies.getObject('application');
        } catch (err) {
          initRetrieveData(waidCore.account.id, waidCore.application.id);
        }
      } else {
        initRetrieveData(waidCore.account.id, waidCore.application.id);
      }
    } else {
      // Try to set by cookie
      if ($cookies.getObject('account') && $cookies.getObject('application')) {
        try {
          waidCore.account = $cookies.getObject('account');
          waidCore.application = $cookies.getObject('application');
        } catch (err) {
          waidCore.clearAccount();
          waidService._clearAuthorizationData();
        }
      } else {
        waidCore.clearAccount();
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
        if (waid.account && waid.application) {
          waid.isInit = true;
          waidService.authenticate();
        }
      }
      var waidAlCode = $location.search().waidAlCode;
      if (waidAlCode) {
        waidService.userAutoLoginGet(waidAlCode).then(function (data) {
          $location.search('waidAlCode', null);
        });
      }
      ;
    }
  }, true);
});