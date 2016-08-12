'use strict';

angular.module('waid.core.controllers', ['waid.core', 'waid.core.services', 'waid.idm.controllers', 'waid.core.strategy'])
  .controller('WAIDCoreDefaultModalCtrl', function ($scope, $location, waidService, waidCore, waidCoreStrategy, $uibModalInstance) {
    $scope.close = function () {
      $uibModalInstance.dismiss('close');
    };
  })
  .controller('WAIDCoreEmoticonModalCtrl', function($scope, $rootScope){
    $scope.emoticons = {
      'people':['😄','😆','😊','😃','😏','😍','😘','😚','😳','😌','😆','😁','😉','😜','😝','😀','😗','😙','😛','😴','😟','😦','😧','😮','😬','😕','😯','😑','😒','😅','😓','😥','😩','😔','😞','😖','😨','😰','😣','😢','😭','😂','😲','😱','😫','😠','😡','😤','😪','😋','😷','😎','😵','👿','😈','😐','😶','😇','👽','💛','💙','💜','❤','💚','💔','💓','💗','💕','💞','💘','💖','✨','⭐','🌟','💫','💥','💥','💢','❗','❓','❕','❔','💤','💨','💦','🎶','🎵','🔥','💩','💩','💩','👍','👍','👎','👎','👌','👊','👊','✊','✌','👋','✋','✋','👐','☝','👇','👈','👉','🙌','🙏','👆','👏','💪','🏃','🏃','👫','👪','👬','👭','💃','👯','🙆','🙅','💁','🙋','👰','🙎','🙍','🙇','💏','💑','💆','💇','💅','👦','👧','👩','👨','👶','👵','👴','👱','👲','👳','👷','👮','👼','👸','😺','😸','😻','😽','😼','🙀','😿','😹','😾','👹','👺','🙈','🙉','🙊','💂','💀','🐾','👄','💋','💧','👂','👀','👃','👅','💌','👤','👥','💬','💭'],
      'nature':['☀','☂','☁','❄','☃','⚡','🌀','🌁','🌊','🐱','🐶','🐭','🐹','🐰','🐺','🐸','🐯','🐨','🐻','🐷','🐽','🐮','🐗','🐵','🐒','🐴','🐎','🐫','🐑','🐘','🐼','🐍','🐦','🐤','🐥','🐣','🐔','🐧','🐢','🐛','🐝','🐜','🐞','🐌','🐙','🐠','🐟','🐳','🐋','🐬','🐄','🐏','🐀','🐃','🐅','🐇','🐉','🐐','🐓','🐕','🐖','🐁','🐂','🐲','🐡','🐊','🐪','🐆','🐈','🐩','🐾','💐','🌸','🌷','🍀','🌹','🌻','🌺','🍁','🍃','🍂','🌿','🍄','🌵','🌴','🌲','🌳','🌰','🌱','🌼','🌾','🐚','🌐','🌞','🌝','🌚','🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘','🌜','🌛','🌙','🌍','🌎','🌏','🌋','🌌','⛅'],
      'objects':['🎍','💝','🎎','🎒','🎓','🎏','🎆','🎇','🎐','🎑','🎃','👻','🎅','🎄','🎁','🔔','🔕','🎋','🎉','🎊','🎈','🔮','💿','📀','💾','📷','📹','🎥','💻','📺','📱','☎','☎','📞','📟','📠','💽','📼','🔉','🔈','🔇','📢','📣','⌛','⏳','⏰','⌚','📻','📡','➿','🔍','🔎','🔓','🔒','🔏','🔐','🔑','💡','🔦','🔆','🔅','🔌','🔋','📲','✉','📫','📮','🛀','🛁','🚿','🚽','🔧','🔩','🔨','💺','💰','💴','💵','💷','💶','💳','💸','📧','📥','📤','✉','📨','📯','📪','📬','📭','📦','🚪','🚬','💣','🔫','🔪','💊','💉','📄','📃','📑','📊','📈','📉','📜','📋','📆','📅','📇','📁','📂','✂','📌','📎','✒','✏','📏','📐','📕','📗','📘','📙','📓','📔','📒','📚','🔖','📛','🔬','🔭','📰','🏈','🏀','⚽','⚾','🎾','🎱','🏉','🎳','⛳','🚵','🚴','🏇','🏂','🏊','🏄','🎿','♠','♥','♣','♦','💎','💍','🏆','🎼','🎹','🎻','👾','🎮','🃏','🎴','🎲','🎯','🀄','🎬','📝','📝','📖','🎨','🎤','🎧','🎺','🎷','🎸','👞','👡','👠','💄','👢','👕','👕','👔','👚','👗','🎽','👖','👘','👙','🎀','🎩','👑','👒','👞','🌂','💼','👜','👝','👛','👓','🎣','☕','🍵','🍶','🍼','🍺','🍻','🍸','🍹','🍷','🍴','🍕','🍔','🍟','🍗','🍖','🍝','🍛','🍤','🍱','🍣','🍥','🍙','🍘','🍚','🍜','🍲','🍢','🍡','🍳','🍞','🍩','🍮','🍦','🍨','🍧','🎂','🍰','🍪','🍫','🍬','🍭','🍯','🍎','🍏','🍊','🍋','🍒','🍇','🍉','🍓','🍑','🍈','🍌','🍐','🍍','🍠','🍆','🍅','🌽'],
      'places':['🏠','🏡','🏫','🏢','🏣','🏥','🏦','🏪','🏩','🏨','💒','⛪','🏬','🏤','🌇','🌆','🏯','🏰','⛺','🏭','🗼','🗾','🗻','🌄','🌅','🌠','🗽','🌉','🎠','🌈','🎡','⛲','🎢','🚢','🚤','⛵','⛵','🚣','⚓','🚀','✈','🚁','🚂','🚊','🚞','🚲','🚡','🚟','🚠','🚜','🚙','🚘','🚗','🚗','🚕','🚖','🚛','🚌','🚍','🚨','🚓','🚔','🚒','🚑','🚐','🚚','🚋','🚉','🚆','🚅','🚄','🚈','🚝','🚃','🚎','🎫','⛽','🚦','🚥','⚠','🚧','🔰','🏧','🎰','🚏','💈','♨','🏁','🎌','🏮','🗿','🎪','🎭','📍','🚩']
    }
  })
  .controller('WAIDCoreCtrl', function ($scope, waidCore, $rootScope, $location, $window, waidService, growl, $routeParams, $log, waidCore, $cookies) {
    
    // $rootScope.waid.getTranslation = function(module, key) {
    //   config_key = module + '.translations.' + key
    //   return waid.config.getConfig(config_key);
    // }

    // waidCore.config = angular.isDefined($rootScope.config) ? $rootScope.config : false;
    // console.log($rootScope.config);
    waidCore.account = {'id':angular.isDefined($rootScope.accountId) ? $rootScope.accountId : false};
    waidCore.application = {'id':angular.isDefined($rootScope.applicationId) ? $rootScope.applicationId : false};
    
    console.log(waidCore);

    $scope.checkLoading = function(){
      if(waidService.running.length > 0) {
          return true;
      } 
      return false;
    }

    


    $scope.initRetrieveData = function(accountId, applicationId) {
      waidService.publicAccountGet(accountId).then(function(){
        var application = data.main_application;
        delete data.main_application

        $rootScope.waid.account = data;
        // TODO retrieve full application info
        $rootScope.waid.application = {'id':applicationId};

        $cookies.putObject('account', $rootScope.waid.account);
        $cookies.putObject('application', $rootScope.waid.application);
      });
    }

    $scope.initWaid = function() {
      // Init if account and app are fixed
      if ($scope.accountId && $scope.applicationId) {
        if ($cookies.getObject('account') && $cookies.getObject('application')) {
          try {
            $rootScope.waid.account = $cookies.getObject('account');
            $rootScope.waid.application = $cookies.getObject('application');
          } catch(err) {
            $scope.initRetrieveData($scope.accountId, $scope.applicationId);
          }
        } else {
          $scope.initRetrieveData($scope.accountId, $scope.applicationId);
        }
      } else {
        // Try to set by cookie
        if ($cookies.getObject('account') && $cookies.getObject('application')) {
            try {
              $rootScope.waid.account = $cookies.getObject('account');
              $rootScope.waid.application = $cookies.getObject('application');
            } catch(err) {
              $rootScope.waid.clearAccount();
              waidService._clearAuthorizationData();
            }
        } else {
          $rootScope.waid.clearAccount();
          waidService._clearAuthorizationData();
        }
      }
    }

    $rootScope.authenticated = false;

    $rootScope.$on('waid.services.authenticate.ok', function(event, data) {
      $rootScope.authenticated = true;
    });

    $scope.loginCheck = function(data) {
      
      if (typeof data.profile_status != "undefined" && data.profile_status.length > 0) {
        if(data.profile_status.indexOf('profile_ok') !== -1) {
           growl.addSuccessMessage(waidCore.config.getConfig('core.translations.growlLoggedInSucces'));
           waidCore.closeAllModals();
        }

        if(typeof data.profile_status != "undefined" && data.profile_status.indexOf('missing_profile_data') !== -1) {
          waidCore.closeAllModals();
          waidCore.openCompleteProfileModal();
        }
      }
    };

    $rootScope.$on('waid.services.application.userAutoLogin.get.ok', function(event, data) {
      $scope.loginCheck(data);
    });

    $rootScope.$on('waid.services.application.userAutoLogin.get.error', function(event, data) {
    });

    $rootScope.$on('waid.services.application.userLogin.post.ok', function(event, data) {
      $scope.loginCheck(data);
    });

    $rootScope.$on('waid.services.application.userLogout.post.ok', function(event, data) {
      waidCore.authenticated = false;
      waidCore.user = false;
      waidCore.closeAllModals();
    });

    $rootScope.$on('waid.services.application.userLogoutAll.post.ok', function(event, data) {
      waidCore.authenticated = false;
      waidCore.user = false;
      waidCore.closeAllModals();
    });

    $rootScope.$on('waid.services.application.userRegister.post.ok', function(event, data) {
      waidCore.closeAllModals();
    });

    $scope.$on('waid.services.application.userProfile.get.ok', function(event, data) {
      waidCore.user = data;
    });

    $scope.$on('waid.services.application.userCompleteProfile.post.ok', function(event, data) {
      // Reload profile info
      if (data.profile_status.indexOf('profile_ok') !== -1) {
        // Wait for data to be stored
        setTimeout(function() {
          waidService.userProfileGet();
        }, 1000);
      }
      $scope.closeCompleteProfileModal();
      if(data.profile_status.indexOf('email_is_not_verified') !== -1) {
          growl.addErrorMessage("Er is activatie e-mail verstuurd. Controleer je e-mail om de login te verifieren.",  {ttl: -1});
      }
    });

    $scope.$on('waid.services.application.userEmail.post.ok', function(event, data) {
      growl.addSuccessMessage("Nieuw e-mail adres toegevoegd, controleer je mail om deze te verifieren.",  {ttl: -1});
    });

    $scope.$on('waid.services.application.userProfile.patch.ok', function(event, data) {
      growl.addSuccessMessage("Profiel informatie opgeslagen");
    });

    $scope.$on('waid.services.application.userPassword.put.ok', function(event, data) {
      growl.addSuccessMessage("Wachtwoord is gewijzigd.");
    });

     $scope.$on('waid.services.application.userLostLogin.post.ok', function(event, data) {
      growl.addSuccessMessage("Instructies om in te loggen zijn naar jouw e-mail gestuurd.");
      waidCore.closeAllModals();
    });
    $scope.$on('waid.services.application.userRegister.post.ok', function(event, data) {
      growl.addSuccessMessage("Geregistreerd als nieuwe gebruiker! Controleer je mail om de account te verifieren.",  {ttl: -1});
      $scope.isRegister = true;
    });

    // Main init
    $scope.initWaid();
  });