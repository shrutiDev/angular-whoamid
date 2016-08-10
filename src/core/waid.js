'use strict';
angular.module('waid.core', [])
  .service('waidCore', function ($rootScope, waidCoreStrategy, waidService) {
    var waid = angular.isDefined($rootScope.waid) ? $rootScope.waid : {};

    // Assume user is not logged in until we hear otherwise

    waid.logout = function() {
        waidService.userLogoutPost();
    };
    waid.logoutAll = function() {
        waidService.userLogoutAllPost();
    };
    waid.openLoginAndRegisterHomeModal = function() {
        waidCoreStrategy.openLoginAndRegisterHomeModal();
    };
    waid.openUserProfileHomeModal = function() {
        waidCoreStrategy.openUserProfileHomeModal();
    };
    waid.openLostLoginModal = function() {
        this.closeAllModals();
        waidCoreStrategy.openLostLoginModal();
    };
    waid.openTermsAndConditionsModal = function() {
        waidCoreStrategy.openTermsAndConditionsModal();
    };
    waid.openEmoticonsModal = function(text) {
        waidCoreStrategy.openEmoticonsModal(text);
    };
    waid.closeEmoticonsModal =  function(){
        waidCoreStrategy.closeEmoticonsModal();
    };
    waid.closeAllModals = function(){
        waidCoreStrategy.closeUserProfileModal();
        waidCoreStrategy.closeLoginAndRegisterModal();
        waidCoreStrategy.closeLostLoginModal();
        waidCoreStrategy.closeTermsAndConditionsModal();
    };
    waid.getTranslation = function(module, key) {
        if (typeof waid.config[module].translations[key] != 'undefined') {
            return waid.config[module].translations[key];
        } 
        return 'Unknown key `' + key + '` for module `' + module + '`';
    };

    waid.getConfig = function(key) {
        return waid.config.getConfig(key);
    };

    waid.user = false;
    waid.account = false;
    waid.application = false;

    return waid;
  });
