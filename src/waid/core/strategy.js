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
    if (waidCore.account.id && waidCore.application.id) {
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
        console.log('Fatal error');
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