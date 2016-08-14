angular.module('waid', [
  'waid.templates',

  'waid.core',
  'waid.core.strategy',
  'waid.core.services',
  'waid.core.controllers',
  'waid.core.directives',

  // 'waid.idm.controllers',
  // 'waid.idm.directives',
  'waid.idm',
  'waid.comments',
]).run(function(waidCore, waidCoreStrategy, waidCoreAppStrategy, waidService) {
  waidCore.config.setConfig('api', {
    'environment' : {
      'development':{
        'url': 'http://dev.whoamid.com:8000/nl/api'
      },
      'test':{
        'url': 'http://test.whoamid.com:8001/nl/api'
      },
      'staging':{
        'url': 'http://test.whoamid.com:8002/nl/api'
      },
      'production':{
        'url': 'http://eu.whoamid.com/nl/api'
      }
    }
    // 'accountId' : 'efa26bbd-33dc-4148-b135-a1e9234e0fef',
    // 'applicationId' : 'c7d23002-da7d-4ad3-a665-9ae9de276c9e',
  });

  waidCore.config.setConfig('core', {
    'templates':{
      'core': '/core/templates/core.html',
      'emoticonsModal':'/core/templates/emoticons-modal.html'
    },
    'errorCodes':{
      'auth-cancelled' : 'Authentication was canceled by the user.',
      'auth-failed' : 'Authentication failed for some reason.',
      'auth-unknown-error' : 'An unknown error stoped the authentication process.',
      'auth-missing-parameter' : 'A needed parameter to continue the process was missing, usually raised by the services that need some POST data like myOpenID.',
      'auth-state-missing' : 'The state parameter is missing from the server response.',
      'auth-state-forbidden' : 'The state parameter returned by the server is not the one sent.',
      'auth-token-error' : 'Unauthorized or access token error, it was invalid, impossible to authenticate or user removed permissions to it.',
      'auth-already-associated' : 'A different user has already associated the social account that the current user is trying to associate.',
      'system-error' : 'System error, failed for some reason.'
    },
    'translations':{
      'emoticons':{
        'people':'Mensen',
        'nature':'Natuur',
        'objects':'Objecten',
        'places':'Plaatsen'
      }
    }
  });


  waidService.initialize();
});



'use strict';
angular.module('waid.core', [])
  .service('waidCore', function ($rootScope, $cookies) {
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

    waid.isAuthenticated = function() {
        if (waid.user && waid.account && waid.application) {
            return true;
        }
        return false;
    }

    waid.closeAllModals = function(){
        waid.closeUserProfileModal();
        waid.closeLoginAndRegisterModal();
        waid.closeLostLoginModal();
        waid.closeTermsAndConditionsModal();
    };

    waid.clearAccount = function() {
        $cookies.remove('account');
        $cookies.remove('application');
        $rootScope.waid.account = false;
        $rootScope.waid.application = false;
        $rootScope.waid.user = false;
    };
  
    waid.utils = {};


    waid.user = false;
    waid.account = false;
    waid.application = false;
    waid.isInit = false;

    $rootScope.waid = waid;
    

    return waid;
  });

'use strict';
angular.module('waid.core.strategy', ['waid.core', 'waid.core.services'])
  .service('waidCoreStrategy', function ($rootScope, waidCore, waidService, $location, $cookies) {

    waidCore.checkLoading = function(){
      if(waidService.running.length > 0) {
          return true;
      } 
      return false;
    }

    waidCore.logout = function() {
       waidService.userLogoutPost();
    };
    
    waidCore.logoutAll = function() {
      waidService.userLogoutAllPost();
    };

    waidCore.addEmoticon = function(emoticon) {
      var input = document.getElementById(this.targetId);
      input.value = [input.value.slice(0, input.selectionStart), emoticon, input.value.slice(input.selectionStart)].join('');
      input.focus();
      $rootScope.waid.closeEmoticonsModal();
    }

    
    var initRetrieveData = function(accountId, applicationId) {
      waidService.publicAccountGet(accountId).then(function(){
        var application = data.main_application;
        delete data.main_application

        waidCore.account = data;
        // TODO retrieve full application info
        waidCore.application = {'id':applicationId};

        $cookies.putObject('account', waidCore.account);
        $cookies.putObject('application', waidCore.application);
      });
    }
    
    waidCore.initialize = function() {
      // Init if account and app are fixed
      if (waidCore.account.id && waidCore.application.id) {
        if ($cookies.getObject('account') && $cookies.getObject('application')) {
          try {
            waidCore.account = $cookies.getObject('account');
            waidCore.application = $cookies.getObject('application');
          } catch(err) {
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
            } catch(err) {
              waidCore.clearAccount();
              waidService._clearAuthorizationData();
            }
        } else {
          waidCore.clearAccount();
          waidService._clearAuthorizationData();
        }
      }
    }

    waidCore.loginCheck = function(data) {
      if (typeof data.profile_status != "undefined" && data.profile_status.length > 0) {
        if(data.profile_status.indexOf('profile_ok') !== -1) {
          $rootScope.$broadcast("waid.core.strategy.loginCheck.success", data);
        }

        if(typeof data.profile_status != "undefined" && data.profile_status.indexOf('missing_profile_data') !== -1) {
          $rootScope.$broadcast("waid.core.strategy.loginCheck.completeProfile", data);
        }
      }
    };


    $rootScope.$watch('waid', function(waid){
      if (typeof waid != "undefined") {
        // Init once
        if (!waid.isInit) {
          if (waid.account && waid.application) {
            waid.isInit = true;
            waidService.authenticate();
          }
        }

        var waidAlCode = $location.search().waidAlCode; 
        if (waidAlCode) {
          waidService.userAutoLoginGet(waidAlCode).then(function(data) {
            $location.search('waidAlCode', null);
          });
        };
      }
    }, true);


  });

'use strict';
angular.module('waid.core.services', ['waid.core'])
  .service('waidService', function idm($q, $http, $cookies, $rootScope, $location, Slug, waidCore) {
    var service = {
        'API_URL': '',
        'apiVersion': 'v1',
        'token':null,
        'authenticated':false,
        'fp':'',
        'running':new Array(),
        'request': function(args) {
            var that = this;
            
            // Set CSRFToken
            $http.defaults.headers.common['X-CSRFToken'] = $cookies.get('csrftoken');

            // Set authorization token
            if (this.token!= null && this.token != "" && this.token != "null") {
                $http.defaults.headers.common['Authorization'] = 'Token ' + this.token;
            } else {
                $http.defaults.headers.common['Authorization'] = null;
            }

            $http.defaults.headers.common['FPID'] = this.fp;

            // Extend headers
            var headers = {}
            if (typeof args.headers != 'undefined') {
                angular.extend(headers, args.headers);
            }

            params = args.params || {}
            args = args || {};
            var deferred = $q.defer(),
                url = this.API_URL + args.url,
                method = args.method || "GET",
                params = params,
                data = args.data || {};
            
            that.running.push(url);
            
            // Fire the request, as configured.
            $http({
                url: url,
                method: method.toUpperCase(),
                headers: headers,
                params: params,
                data: data
            }).success(angular.bind(this,function(data, status, headers, config) {
                //$rootScope.waid.isLoading = false;
                var index = this.running.indexOf(url);
                if (index > -1) {
                    this.running.splice(index, 1);
                }
                deferred.resolve(data, status);
            })).error(angular.bind(this,function(data, status, headers, config) {
                var index = this.running.indexOf(url);
                if (index > -1) {
                    this.running.splice(index, 1);
                }
                // Set request status
                if(data){
                    data.status = status;
                }

                if (typeof data != 'undefined' 
                    && typeof data.error != 'undefined' 
                    && data.error.code != 'undefined' 
                    && data.error.code == 'invalid_authentication_credentials') {
                    that._clearAuthorizationData();
                }
                
                // Forbidden, send out event..
                if (status == 403) {
                    $rootScope.$broadcast("waid.services.request.error", data);
                }

                if(status == 0){
                    if(data == ""){
                        data = {};
                        data['status'] = 0;
                        data['non_field_errors'] = ["Could not connect. Please try again."];
                    }
                    // or if the data is null, then there was a timeout.
                    if(data == null){
                        // Inject a non field error alerting the user
                        // that there's been a timeout error.
                        data = {};
                        data['status'] = 0;
                        data['non_field_errors'] = ["Server timed out. Please try again."];
                    }
                }
                deferred.reject(data, status, headers, config);
            }));
            return deferred.promise;
        },
        '_login' : function(token) {
            $cookies.put('token', token, {'path':'/'});
            this.token = token;
            this.authenticate();
        },
        '_clearAuthorizationData': function() {
            this.authenticated = false;
            $cookies.remove('token', {'path':'/'});
            this.token = null;
        },
        '_makeFileRequest': function(method, path, broadcast, data) {
            var deferred = $q.defer();
            this.request({
                'method': method,
                'url': path,
                'data' :data,
                'headers':{'Content-Type': undefined }
            }).then(function(data){
                $rootScope.$broadcast("waid.services." + broadcast + '.' + method.toLowerCase() + ".ok", data);
                deferred.resolve(data);
            }, function(data){
                $rootScope.$broadcast("waid.services." + broadcast + '.' + method.toLowerCase() + ".error", data);
                deferred.reject(data);
            });
            return deferred.promise;
        },
        '_makeRequest': function(method, path, broadcast, data) {
            var deferred = $q.defer();
            this.request({
                'method': method,
                'url': path,
                'data' :data
            }).then(function(data){
                $rootScope.$broadcast("waid.services." + broadcast + '.' + method.toLowerCase() + ".ok", data);
                deferred.resolve(data);
            }, function(data){
                $rootScope.$broadcast("waid.services." + broadcast + '.' + method.toLowerCase() + ".error", data);
                deferred.reject(data);
            });
            return deferred.promise;
        },
        '_getAdminUrl': function(url) {
            return '/admin/' + this.apiVersion + '/' + waidCore.account.id + url;
        },
        '_getAppUrl': function(url) {
            return '/application/' + this.apiVersion + '/' + waidCore.account.id + '/' + $rootScope.waid.application.id + url;
        },
        '_getPublicUrl': function(url) {
            return '/public/' + this.apiVersion + url;
        },
        'userRegisterPost': function(data) {
            if (typeof data.return_url == 'undefined' || data.return_url == '') {
                data.return_url = $location.absUrl() + '?waidAlCode=[code]';
            }
            return this._makeRequest('POST', this._getAppUrl("/user/register/"), 'application.userRegister', data);
        },
        'userCompleteProfilePost': function(data) {
            if (typeof data.return_url == 'undefined' || data.return_url == '') {
                data.return_url = $location.absUrl() + '?waidAlCode=[code]';
            }
            return this._makeRequest('POST', this._getAppUrl("/user/complete-profile/"), 'application.userCompleteProfile', data);
        },
        'userCompleteProfileGet': function() {
            return this._makeRequest('GET', this._getAppUrl("/user/complete-profile/"), 'application.userCompleteProfile');
        },
        'userLoginPost': function(data) {
            this._clearAuthorizationData();
            var that = this
            return this._makeRequest('POST', this._getAppUrl("/user/login/"), 'application.userLogin', data).then(function(data){
                that._login(data.token);
                return data;
            });
        },
        'userAutoLoginGet': function(code) {
            var that = this
            this._clearAuthorizationData();
            return this._makeRequest('GET', this._getAppUrl("/user/autologin/" + code + '/'), 'application.userAutoLogin').then(function(data){
                that._login(data.token);
                return data;
            });
        },
        'userLostLoginPost': function(data) {
            this._clearAuthorizationData();
            return this._makeRequest('POST', this._getAppUrl("/user/lost-login/"), 'application.userLostLogin', data);
        },
        'userLogoutPost': function() {
            var that = this
            return this._makeRequest('POST', this._getAppUrl("/user/logout/"), 'application.userLogout').then(function(data){
                that._clearAuthorizationData();
                waidCore.user = false;
                return data;
            });

        },
        'userLogoutAllPost': function() {
            var that = this;
            return this._makeRequest('POST', this._getAppUrl("/user/logout-all/"), 'application.userLogoutAll').then(function(data){
                this._clearAuthorizationData();
                waidCore.user = false;
                return data;
            });
        },
        'userProfileGet': function() {
            return this._makeRequest('GET', this._getAppUrl("/user/profile/"), 'application.userProfile');
        },
        'userPasswordPut': function(data) {
            return this._makeRequest('PUT', this._getAppUrl("/user/password/"), 'application.userPassword', data);
        },
        'userProfilePatch': function(data) {
            return this._makeRequest('PATCH', this._getAppUrl("/user/profile/"), 'application.userProfile', data);
        },
        'userUsernamePut': function(data) {
            return this._makeRequest('PUT', this._getAppUrl("/user/username/"), 'application.userUsername', data);
        },
        'userEmailListGet': function() {
            return this._makeRequest('GET', this._getAppUrl("/user/email/"), 'application.userEmailList');
        },
        'userEmailPost': function(data) {
            if (typeof data.return_url == 'undefined' || data.return_url == '') {
                data.return_url = $location.absUrl() + '?waidAlCode=[code]';
            }
            return this._makeRequest('POST', this._getAppUrl("/user/email/"), 'application.userEmail', data);
        },
        'userEmailDelete': function(id) {
            return this._makeRequest('DELETE', this._getAppUrl("/user/email/" + id + "/"), 'application.userEmail');
        },
        'userAvatarPut': function(fd) {
            return this._makeFileRequest('PUT', this._getAppUrl("/user/avatar/"), 'application.userAvatar', fd);
        },
        'socialProviderListGet': function() {
            return this._makeRequest('GET', this._getAppUrl("/social/providers/"), 'application.socialProviderList');
        },
        'userCommentsPatch': function(id, data) {
            return this._makeRequest('PATCH', this._getAppUrl("/user/comments/" + id + "/"), 'application.userComments', data);
        },
        'userCommentsPost': function(data) {
            if (typeof data.thread_id != "undefined" && data.thread_id == 'currenturl') {
                data.thread_id = Slug.slugify($location.absUrl());
            }
            data.url = $location.absUrl();
            return this._makeRequest('POST', this._getAppUrl("/user/comments/"), 'application.userComments', data);
        },
        'userCommentsDelete': function(id) {
            return this._makeRequest('DELETE', this._getAppUrl("/user/comments/" + id + "/"), 'application.userComments');
        },
        'userCommentsListGet': function(params) {
            if (typeof params != "undefined") {
                if (typeof params.thread_id != "undefined" && params.thread_id == 'currenturl') {
                    params.thread_id = Slug.slugify($location.absUrl());
                }
                var query = '?' + $.param(params);
            } else {
                var query = '';
            }
            return this._makeRequest('GET', this._getAppUrl("/user/comments/" + query), 'application.userCommentsList');
        },
        'commentsListGet': function(params) {
            if (typeof params != "undefined") {
                if (typeof params.thread_id != "undefined" && params.thread_id == 'currenturl') {
                    params.thread_id = Slug.slugify($location.absUrl());
                }
                var query = '?' + $.param(params);
            } else {
                var query = '';
            }
            return this._makeRequest('GET', this._getAppUrl("/comments/" + query), 'application.commentsList');
        },
        'commentsVotePost': function(id, vote) {
            var data = {'vote':vote};
            return this._makeRequest('POST', this._getAppUrl("/comments/" + id + "/vote/"), 'application.commentsVote', data);
        },
        'commentsMarkPost': function(id, mark) {
            var data = {'mark':mark};
            return this._makeRequest('POST', this._getAppUrl("/comments/" + id + "/mark/"), 'application.commentsMark', data);
        },
        'articlesListGet': function() {
            return this._makeRequest('GET', this._getAppUrl("/articles/"), 'application.articlesList');
        },
        'articlesGet': function(id) {
            return this._makeRequest('GET', this._getAppUrl("/articles/" + id + '/'), 'application.articles');
        },
        'adminAccountGet': function() {
            return this._makeRequest('GET', this._getAdminUrl("/account/"), 'admin.account');
        },
        'adminAccountPatch': function(data) {
            return this._makeRequest('PATCH', this._getAdminUrl("/account/"), 'admin.account', data);
        },
        'adminApplicationListGet': function() {
            return this._makeRequest('GET', this._getAdminUrl("/application/"), 'admin.applicationList');
        },
        'adminApplicationGet': function(id) {
            return this._makeRequest('GET', this._getAdminUrl("/application/" + id + "/"), 'admin.application');
        },
        'adminApplicationPatch': function(data) {
            return this._makeRequest('PATCH', this._getAdminUrl("/application/" + data.id + "/"), 'admin.application', data);
        },
        'publicAccountGet': function(account) {
            return this._makeRequest('GET', this._getPublicUrl("/account/" + account + "/"), 'public.account');   
        },
        'publicAccountCreatePost': function(data) {
            data.redirect_to_url = $location.absUrl() + 'admin/' + data.slug + '/';
            return this._makeRequest('POST', this._getPublicUrl("/account/create/"), 'admin.accountCreate', data);
        },
        'authenticate': function()
        {
            var that = this;
            var deferred = $q.defer();

            this.token = $cookies.get('token');
            if (this.token != null && this.token != "" && this.token != "null") {
                this.userProfileGet().then(function(data){
                    that.authenticated = true;
                    waidCore.user = data;
                    $rootScope.$broadcast("waid.services.authenticate.ok", that);
                    deferred.resolve(data);
                }, function(data){
                    that.authenticated = false;
                    $rootScope.$broadcast("waid.services.authenticate.error", that);
                    deferred.reject(data);
                })
            } else {
                that.authenticated = false;
                $rootScope.$broadcast("waid.services.authenticate.none");
                deferred.reject();
            }

            return deferred.promise;  
        },
        'getAccountId':function() {
            return waidCore.account.id;
        },
        'initialize': function(url){
            var that = this;
            if (window.location.port == '8000'){
              this.API_URL = waidCore.config.getConfig('api.environment.development.url');
            } else if (window.location.port == '8001') {
              this.API_URL = waidCore.config.getConfig('api.environment.test.url');
            } else if (window.location.port == '8002') {
              this.API_URL = waidCore.config.getConfig('api.environment.staging.url');
            } else {
              this.API_URL = waidCore.config.getConfig('api.environment.production.url');
            }
            new Fingerprint2().get(function(result, components){
              that.fp = result;
              that.fpComponents = components;
            });

            return this
        }

    }
    service.initialize();
    return service;
  });


'use strict';

angular.module('waid.core.controllers', ['waid.core', 'waid.core.services', 'waid.idm.controllers', 'waid.core.strategy', 'waid.core.app.strategy'])
  .controller('WAIDCoreEmoticonModalCtrl', function($scope, $rootScope){
    $scope.emoticons = {
      'people':['😄','😆','😊','😃','😏','😍','😘','😚','😳','😌','😆','😁','😉','😜','😝','😀','😗','😙','😛','😴','😟','😦','😧','😮','😬','😕','😯','😑','😒','😅','😓','😥','😩','😔','😞','😖','😨','😰','😣','😢','😭','😂','😲','😱','😫','😠','😡','😤','😪','😋','😷','😎','😵','👿','😈','😐','😶','😇','👽','💛','💙','💜','❤','💚','💔','💓','💗','💕','💞','💘','💖','✨','⭐','🌟','💫','💥','💥','💢','❗','❓','❕','❔','💤','💨','💦','🎶','🎵','🔥','💩','💩','💩','👍','👍','👎','👎','👌','👊','👊','✊','✌','👋','✋','✋','👐','☝','👇','👈','👉','🙌','🙏','👆','👏','💪','🏃','🏃','👫','👪','👬','👭','💃','👯','🙆','🙅','💁','🙋','👰','🙎','🙍','🙇','💏','💑','💆','💇','💅','👦','👧','👩','👨','👶','👵','👴','👱','👲','👳','👷','👮','👼','👸','😺','😸','😻','😽','😼','🙀','😿','😹','😾','👹','👺','🙈','🙉','🙊','💂','💀','🐾','👄','💋','💧','👂','👀','👃','👅','💌','👤','👥','💬','💭'],
      'nature':['☀','☂','☁','❄','☃','⚡','🌀','🌁','🌊','🐱','🐶','🐭','🐹','🐰','🐺','🐸','🐯','🐨','🐻','🐷','🐽','🐮','🐗','🐵','🐒','🐴','🐎','🐫','🐑','🐘','🐼','🐍','🐦','🐤','🐥','🐣','🐔','🐧','🐢','🐛','🐝','🐜','🐞','🐌','🐙','🐠','🐟','🐳','🐋','🐬','🐄','🐏','🐀','🐃','🐅','🐇','🐉','🐐','🐓','🐕','🐖','🐁','🐂','🐲','🐡','🐊','🐪','🐆','🐈','🐩','🐾','💐','🌸','🌷','🍀','🌹','🌻','🌺','🍁','🍃','🍂','🌿','🍄','🌵','🌴','🌲','🌳','🌰','🌱','🌼','🌾','🐚','🌐','🌞','🌝','🌚','🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘','🌜','🌛','🌙','🌍','🌎','🌏','🌋','🌌','⛅'],
      'objects':['🎍','💝','🎎','🎒','🎓','🎏','🎆','🎇','🎐','🎑','🎃','👻','🎅','🎄','🎁','🔔','🔕','🎋','🎉','🎊','🎈','🔮','💿','📀','💾','📷','📹','🎥','💻','📺','📱','☎','☎','📞','📟','📠','💽','📼','🔉','🔈','🔇','📢','📣','⌛','⏳','⏰','⌚','📻','📡','➿','🔍','🔎','🔓','🔒','🔏','🔐','🔑','💡','🔦','🔆','🔅','🔌','🔋','📲','✉','📫','📮','🛀','🛁','🚿','🚽','🔧','🔩','🔨','💺','💰','💴','💵','💷','💶','💳','💸','📧','📥','📤','✉','📨','📯','📪','📬','📭','📦','🚪','🚬','💣','🔫','🔪','💊','💉','📄','📃','📑','📊','📈','📉','📜','📋','📆','📅','📇','📁','📂','✂','📌','📎','✒','✏','📏','📐','📕','📗','📘','📙','📓','📔','📒','📚','🔖','📛','🔬','🔭','📰','🏈','🏀','⚽','⚾','🎾','🎱','🏉','🎳','⛳','🚵','🚴','🏇','🏂','🏊','🏄','🎿','♠','♥','♣','♦','💎','💍','🏆','🎼','🎹','🎻','👾','🎮','🃏','🎴','🎲','🎯','🀄','🎬','📝','📝','📖','🎨','🎤','🎧','🎺','🎷','🎸','👞','👡','👠','💄','👢','👕','👕','👔','👚','👗','🎽','👖','👘','👙','🎀','🎩','👑','👒','👞','🌂','💼','👜','👝','👛','👓','🎣','☕','🍵','🍶','🍼','🍺','🍻','🍸','🍹','🍷','🍴','🍕','🍔','🍟','🍗','🍖','🍝','🍛','🍤','🍱','🍣','🍥','🍙','🍘','🍚','🍜','🍲','🍢','🍡','🍳','🍞','🍩','🍮','🍦','🍨','🍧','🎂','🍰','🍪','🍫','🍬','🍭','🍯','🍎','🍏','🍊','🍋','🍒','🍇','🍉','🍓','🍑','🍈','🍌','🍐','🍍','🍠','🍆','🍅','🌽'],
      'places':['🏠','🏡','🏫','🏢','🏣','🏥','🏦','🏪','🏩','🏨','💒','⛪','🏬','🏤','🌇','🌆','🏯','🏰','⛺','🏭','🗼','🗾','🗻','🌄','🌅','🌠','🗽','🌉','🎠','🌈','🎡','⛲','🎢','🚢','🚤','⛵','⛵','🚣','⚓','🚀','✈','🚁','🚂','🚊','🚞','🚲','🚡','🚟','🚠','🚜','🚙','🚘','🚗','🚗','🚕','🚖','🚛','🚌','🚍','🚨','🚓','🚔','🚒','🚑','🚐','🚚','🚋','🚉','🚆','🚅','🚄','🚈','🚝','🚃','🚎','🎫','⛽','🚦','🚥','⚠','🚧','🔰','🏧','🎰','🚏','💈','♨','🏁','🎌','🏮','🗿','🎪','🎭','📍','🚩']
    }
  })
  .controller('WAIDCoreCtrl', function ($scope, waidCore, $rootScope, $location, $window, waidService, growl, $routeParams, $log, $cookies) {
    if (angular.isDefined($rootScope.config)) {
      waidCore.config.patchConfig($rootScope.config);
    }
    // console.log($rootScope.config);
    waidCore.account = {'id':angular.isDefined($rootScope.accountId) ? $rootScope.accountId : false};
    waidCore.application = {'id':angular.isDefined($rootScope.applicationId) ? $rootScope.applicationId : false};

    waidCore.initialize();
  });
'use strict';

angular.module('waid.core.directives', ['waid.core', 'waid.core.controllers',])
  .directive('waid', function (waidCore) {
  return {
  	scope:{
      'config':'@',
  		'applicationId':'@',
  		'accountId':'@'
  	},
    restrict: 'E',
      controller: 'WAIDCoreCtrl',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || waidCore.config.core.templates.core
      }
    }
  });
'use strict';
angular.module('waid.core.app.strategy', ['waid.core', 'waid.core.services'])
  .service('waidCoreAppStrategy', function ($rootScope, $uibModal, waidCore, waidService, $location, $cookies, growl) {
    var emoticonsModalInstance = null;
    var termsAndConditionsModalInstance = null;
    var completeProfileModalInstance = null;
    var lostLoginModalInstance = null;
    var loginAndRegisterHomeModalInstance = null;
    var userProfileHomeModalInstance = null;


    waidCore.checkIfModalIsOpen = function(modal) {
      if (modal == 'completeProfile' && completeProfileModalInstance) {
        return true;
      }
      return false;
    }

    waidCore.closeAllModals = function() {
      this.closeEmoticonsModal();
      this.closeTermsAndConditionsModal();
      this.closeCompleteProfileModal();
      this.closeLostLoginModal();
      this.closeLoginAndRegisterModal();
      this.closeUserProfileModal();
    };

    waidCore.openEmoticonsModal = function (targetId) {
      this.targetId = targetId;
      emoticonsModalInstance = $uibModal.open({
        animation: true,
        templateUrl: waidCore.config.getConfig('core.templates.emoticonsModal'),
        controller: 'WAIDCoreEmoticonModalCtrl',
        size: 'lg',
        backdrop: 'static'
      });
    };

    waidCore.closeEmoticonsModal = function () {
      if (emoticonsModalInstance) {
        emoticonsModalInstance.dismiss('close');
      }
    };

    waidCore.openTermsAndConditionsModal = function (template) {
       termsAndConditionsModalInstance = $uibModal.open({
        animation: true,
        templateUrl: waidCore.config.getConfig('idm.templates.termsAndConditionsModal'),
        size: 'lg',
        backdrop: 'static'
      });
    };

    waidCore.closeTermsAndConditionsModal = function () {
      if (termsAndConditionsModalInstance) {
        termsAndConditionsModalInstance.dismiss('close');
      }
    };

    waidCore.openCompleteProfileModal = function () {
      completeProfileModalInstance = $uibModal.open({
        animation: true,
        templateUrl: waidCore.config.getConfig('idm.templates.completeProfile'),
        controller: 'WAIDCompleteProfileCtrl',
        size: 'lg',
        backdrop: 'static'
      });
    };

    waidCore.closeCompleteProfileModal = function () {
      if (completeProfileModalInstance) {
        completeProfileModalInstance.dismiss('close');
      }
    };

    waidCore.openLostLoginModal = function () {
      lostLoginModalInstance = $uibModal.open({
        animation: true,
        templateUrl: waidCore.config.getConfig('idm.templates.lostLoginModal'),
        size: 'lg',
        backdrop: 'static'
      });
    };

    waidCore.closeLostLoginModal = function() {
      if (lostLoginModalInstance) {
        lostLoginModalInstance.dismiss('close');
      }
    };

    waidCore.openLoginAndRegisterHomeModal = function () {
      loginAndRegisterHomeModalInstance = $uibModal.open({
        animation: true,
        templateUrl: waidCore.config.getConfig('idm.templates.loginAndRegisterModal'),
        size: 'lg',
        backdrop: 'static'
      });
    };

    waidCore.closeLoginAndRegisterModal = function() {
       if (loginAndRegisterHomeModalInstance) {
        loginAndRegisterHomeModalInstance.dismiss('close');
      }
    };

    waidCore.openUserProfileHomeModal = function () {
      userProfileHomeModalInstance = $uibModal.open({
        animation: true,
        templateUrl: waidCore.config.getConfig('idm.templates.userProfileModal'),
        size: 'lg',
        backdrop: 'static'
      });
    };

    waidCore.closeUserProfileModal = function() {
      if (userProfileHomeModalInstance) {
        userProfileHomeModalInstance.dismiss('close');
      }
    }

    $rootScope.$on('waid.services.request.error', function(event, data) {
      if (waidService.token && waidCore.checkIfModalIsOpen('completeProfile') == false) {
        waidService.userCompleteProfileGet().then(function(data){
          waidCore.loginCheck(data);
        })
      }
    });

    $rootScope.$on('waid.services.application.userCompleteProfile.post.ok', function(event, data) {
      // Reload profile info
      if (data.profile_status.indexOf('profile_ok') !== -1) {
        // Wait for data to be stored
        setTimeout(function() {
          waidService.authenticate();
        }, 1000);
      }
      waidCore.closeCompleteProfileModal();

      if(data.profile_status.indexOf('email_is_not_verified') !== -1) {
          growl.addErrorMessage("Er is activatie e-mail verstuurd. Controleer je e-mail om de login te verifieren.",  {ttl: -1});
      }
    });

    $rootScope.$on('waid.core.strategy.loginCheck.completeProfile', function(event, data) {
      waidCore.closeAllModals();
      waidCore.openCompleteProfileModal();
    });

    $rootScope.$on('waid.core.strategy.loginCheck.success', function(event, data) {
      growl.addSuccessMessage(waidCore.config.getConfig('idm.translations.loggedin_success'));
      waidCore.closeAllModals();
    });
          
    $rootScope.$on('waid.services.application.userEmail.post.ok', function(event, data) {
      growl.addSuccessMessage("Nieuw e-mail adres toegevoegd, controleer je mail om deze te verifieren.",  {ttl: -1});
    });

    $rootScope.$on('waid.services.application.userProfile.patch.ok', function(event, data) {
      waidCore.user = data;
      growl.addSuccessMessage("Profiel informatie opgeslagen");
    });

    $rootScope.$on('waid.services.application.userProfile.get.ok', function(event, data) {
      waidCore.user = data;
    });

    $rootScope.$on('waid.services.application.userPassword.put.ok', function(event, data) {
      growl.addSuccessMessage("Wachtwoord is gewijzigd.");
    });

    $rootScope.$on('waid.services.application.userUsername.put.ok', function(event, data) {
      growl.addSuccessMessage("Gebruikersnaam is gewijzigd.");
    });

    $rootScope.$on('waid.services.application.userLostLogin.post.ok', function(event, data) {
      growl.addSuccessMessage("Instructies om in te loggen zijn naar jouw e-mail gestuurd.");
      waidCore.closeAllModals();
    });

    $rootScope.$on('waid.services.application.userRegister.post.ok', function(event, data) {
      growl.addSuccessMessage("Geregistreerd als nieuwe gebruiker! Controleer je mail om de account te verifieren.",  {ttl: -1});
    });

    $rootScope.$on('waid.services.application.userRegister.post.ok', function(event, data) {
      waidCore.closeAllModals();
    });

    $rootScope.$on('waid.services.application.userLogout.post.ok', function(event, data) {
      waidCore.closeAllModals();
    });

    $rootScope.$on('waid.services.application.userLogoutAll.post.ok', function(event, data) {
      waidCore.closeAllModals();
    });

    $rootScope.$on('waid.services.application.userAutoLogin.get.ok', function(event, data) {
      waidCore.loginCheck(data);
    });

    $rootScope.$on('waid.services.application.userLogin.post.ok', function(event, data) {
      waidCore.loginCheck(data);
    });


  });

angular.module('waid.idm', [
  'waid.templates',
  'waid.core',
  'waid.idm.controllers',
  'waid.idm.directives',
]).run(function(waidCore, waidCoreStrategy, waidCoreAppStrategy, waidService) {
  waidCore.config.setConfig('idm', {
    'templates':{
      'userProfileNavbar':'/idm/templates/user-profile-navbar.html',
      'userProfileStatusButton': '/idm/templates/user-profile-status-button.html',
      'termsAndConditionsModal': '/idm/templates/terms-and-conditions-modal.html',
      'completeProfile': '/idm/templates/complete-profile.html',
      'lostLoginModal': '/idm/templates/lost-login-modal.html',
      'loginAndRegisterModal':'/idm/templates/login-and-register-modal.html',
      'userProfileModal':'/idm/templates/user-profile-modal.html'
    },
    'translations':{
      'loggedin_success': "Succesvol ingelogd.",
      'complete_profile_intro': 'Om verder te gaan met jouw account hebben we wat extra gegevens nodig...',
      'male':'Man',
      'female':'Vrouw'
    }
  });
});



'use strict';

angular.module('waid.idm.controllers', ['waid.core',])
  .controller('WAIDIDMUserProfileHomeCtrl', function($scope, $rootScope, waidService, $routeParams) {
    $scope.currentProfilePage = 'overview';

    $scope.showProfilePage = function(page) {
      return (page == $scope.currentProfilePage) ? true : false;
    };

    $scope.getActiveProfilePageMenuClass = function(page) {
      return (page == $scope.currentProfilePage) ? 'active' : '';
    }

    $scope.goToProfilePage = function(page) {
      $scope.currentProfilePage = page;
    }

    $rootScope.$on('waid.services.application.userProfile.patch.ok', function(event, data) {
      $scope.currentProfilePage = 'overview';
    });

    $rootScope.$on('waid.services.application.userProfile.put.ok', function(event, data) {
      $scope.currentProfilePage = 'overview';
    });
  })
  .controller('WAIDIDMCompleteProfileCtrl', function ($scope, $location, $window, waidService) {
    $scope.mode = 'complete';
  }) 
  .controller('WAIDIDMLoginCtrl', function ($scope, $location, waidService) {

    $scope.model = {
      'username':'',
      'password':''
    };

    $scope.errors = [];

    $scope.login = function() {
      waidService.userLoginPost($scope.model)
        .then(function(data){
          
        },function(data){
          $scope.errors = data;
        }
      );
    }
  })
  .controller('WAIDIDMLostLoginCtrl', function ($scope, $location, waidService) {

    $scope.model = {
      'email':'',
    };

    $scope.errors = [];

    $scope.submit = function() {
      waidService.userLostLoginPost($scope.model)
        .then(function(data){
          $scope.errors = [];
        },function(data){
          $scope.errors = data;
        }
      );
    }
  }) 
  .controller('WAIDIDMUserProfileInterestsCtrl', function ($scope, $rootScope, $location, waidCore, waidService) {
    $scope.model = waidCore.user;
    $scope.save = function(){
      waidService.userProfilePatch($scope.model).then(function(data) {
        $scope.errors = [];
      }, function(data) {
        $scope.errors = data;
      });
    }
  })

  .controller('WAIDIDMUserProfileOverviewCtrl', function ($scope, $rootScope, $location, waidCore, waidService) {
    $scope.model = waidCore.user;
    waidService.userEmailListGet().then(function(data) {
        $scope.emails = data;
    });
  })

  .controller('WAIDIDMUserProfileMainCtrl', function ($scope, $rootScope, $location, waidCore, waidService, $filter, $timeout) {
    $scope.model = waidCore.user;
    $scope.errors = [];
    $scope.profileDate = false;

    $scope.isUploading = false;
    $scope.dateOptions = {
      dateDisabled: false,
      maxDate: new Date(),
      minDate: new Date(1940, 1, 1),
      startingDay: 1,
      datepickerMode: 'year'
    };

    
    $scope.popup = {
      opened: false
    };
    $scope.open = function() {
      $scope.popup.opened = true;
    };

    $scope.updateProfileInfo = function() {
      waidService.userProfileGet().then(function(data) {
        $scope.errors = [];
        $scope.model = data;
        waidCore.user = data;
      }, function(data) {
        $scope.errors = data;
      });
    }


    $scope.uploadFile = function(files) {
      $scope.isUploading = true;
      var fd = new FormData();
      fd.append("file", files[0]);
      waidService.userAvatarPut(fd).then(function(data){
        $timeout(function(){
          $scope.updateProfileInfo();
          $scope.isUploading = false;
        }, 1000);
        
      })
    }
    $scope.save = function(){
      if (typeof $scope.profileDate != 'undefined' && $scope.profileDate) {
        $scope.model.date_of_birth = $filter('date')($scope.profileDate, 'yyyy-MM-dd');
      }
      waidService.userProfilePatch($scope.model).then(function(data) {
        $scope.model = data;
        waidCore.user = data;
        $scope.errors = [];
      }, function(data) {
        $scope.errors = data;
      });
    }

    // Format date string to javascript date
    $scope.$watch('model.date_of_birth', function(date){
      var dateParts = date.split('-')
      $scope.profileDate = new Date(dateParts[0],dateParts[1]-1,dateParts[2]);
    });

  })
  .controller('WAIDIDMUserProfilePasswordCtrl', function ($scope, $rootScope, $location, waidService, $filter) {
    $scope.model = {};

    $scope.save = function(){
      waidService.userPasswordPut($scope.model).then(function(data) {
        $scope.errors = [];
        $scope.model = {};
      }, function(data) {
        $scope.errors = data;
      });
    }
  })
  .controller('WAIDIDMUserProfileUsernameCtrl', function ($scope, $rootScope, $location, waidCore, waidService, $filter) {
    $scope.model  = {'username': waidCore.user.username};

    $scope.save = function(){
      waidService.userUsernamePut($scope.model).then(function(data) {
        $scope.errors = [];
      }, function(data) {
        $scope.errors = data;
      });
    }
  })
  .controller('WAIDIDMUserProfileEmailCtrl', function ($scope, $rootScope, $location, waidService) {
    $scope.inactiveEmails = [];
    $scope.activeEmails = [];

    $scope.emailAdd = '';

    $scope.initEmails = function(data) {
      $scope.inactiveEmails = [];
      $scope.activeEmails = [];

      if (data.length > 0) {
        for (var i=0; i<data.length; i++) {
          if (data[i].is_verified == 1) {
            $scope.activeEmails.push(data[i]);
          } else {
            $scope.inactiveEmails.push(data[i]);
          }
        }
      }
    };

    $scope.deleteEmail = function(id) {
      waidService.userEmailDelete(id).then(function(data) {
        $scope.errors = [];
        $scope.loadEmailList();
      }, function(data) {
        $scope.errors = data;
      });
    };

    $scope.addEmail = function() {
      var data = {'email': $scope.emailAdd}
      waidService.userEmailPost(data).then(function(data) {
        $scope.errors = [];
        $scope.loadEmailList();
        $scope.emailAdd = '';
      }, function(data) {
        $scope.errors = data;
      });
    };

    $scope.loadEmailList = function() {
      waidService.userEmailListGet().then(function(data) {
        $scope.initEmails(data);
      });
    };

    $scope.loadEmailList();
    
  })
  .controller('WAIDIDMSocialCtrl', function ($scope, $location, waidService, $window) {
    $scope.providers = [];
    $scope.getProviders = function() {
      waidService.socialProviderListGet().then(function(data){
        for (var i=0; i<data.length; i++) {
          data[i].url = data[i].url + '?return_url=' + encodeURIComponent($location.absUrl() + '?waidAlCode=[code]');
        }
        $scope.providers = data;
      });
    }
    
    $scope.goToSocialLogin = function(provider) {
      $window.location.assign(provider.url);
    }

    $scope.$watch('waid', function(waid){
      if (waid.account && waid.application) {
        $scope.getProviders();
      }
    }, true);
  })
  .controller('WAIDIDMRegisterCtrl', function ($scope, $route, waidService, $location, $uibModal) {
    $scope.show = {};
    $scope.missingEmailVerification = false;
    if ($scope.modus == 'complete') {
      // Check for logged-in user
      waidService.userCompleteProfileGet().then(function(data) {
        $scope.model = data.user;
        if(typeof data.profile_status != "undefined" && data.profile_status.indexOf('email_is_not_verified') !== -1) {
           $scope.missingEmailVerification = true;
        }

        // Set missing data
        for (var i=0; i < data.missing_data.length; i++) {
          $scope.show[data.missing_data[i]] = true;
        }
      }, function(data) {
        // Not logged in
      });
    } else {
      $scope.missingEmailVerification = false;
      $scope.show = {
        'username':true,
        'password':true,
        'email':true,
        'terms_and_conditions_check':true
      }
    }
    
    // $scope.model = {
    //   'username':'',
    //   'password':'',
    //   'email':'',
    //   'terms_and_conditions_check':false
    // };
    $scope.register = function(){
      if ($scope.model.terms_and_conditions_check) {
        $scope.errors = [];
        if ($scope.modus == 'complete') {
          waidService.userCompleteProfilePost($scope.model)
            .then(function(data){
              $scope.model = {};
            },function(data){
              $scope.errors = data;
            }
          );
        } else {
          waidService.userRegisterPost($scope.model)
            .then(function(data){
              $scope.model = {};
            },function(data){
              $scope.errors = data;
            }
          );
        }
      }
    }
  });

'use strict';

angular.module('waid.idm.directives', ['waid.core', 'waid.idm.controllers',])
  .directive('waidUserProfileNavbar', function (waidCore) {
  return {
    restrict: 'E',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || waidCore.config.idm.templates.userProfileNavbar
      }
    }
  })
  .directive('waidUserProfileStatusButton', function (waidCore) {
  return {
    restrict: 'E',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || waidCore.config.idm.templates.userProfileStatusButton
      }
    }
  });
angular.module('waid.comments', [
  'waid.templates',
  'waid.core',
  'waid.idm',
  'waid.comments.controllers',
  'waid.comments.directives'
]).run(function(waidCore, waidCoreStrategy, waidCoreAppStrategy, waidService) {
  waidCore.config.setConfig('comments', {
    'templates':{
      'commentsHome': '/comments/templates/comments-home.html',
      'commentsOrderButton': '/comments/templates/comments-order-button.html'
    },
    'translations':{
      'title':'Comments',
      'notLoggedInText':'Om comments te plaatsen dien je een account te hebben, login of registreer je snel!',
      'postCommentButton':'Plaats comment',
      'actionDropdownTitle':'Opties',
      'editCommentTitle':'Aanpassen',
      'markCommentSpamTitle':'Markeer als spam',
      'commentMarkedAsSpam':'Gemarkeerd als spam!',
      'deleteCommentTitle':'Verwijderen',
      'confirmDeleteContentBody': 'Weet u zeker dat je de comment wilt verwijderen?',
      'confirmDeleteContentTitle':'Comment verwijderen?',
      'updateCommentButton':'Aanpassen',
      'voteOrderNewestFirst':'Nieuwste eerst',
      'voteOrderOldestFirst':'Oudste eerst',
      'voteOrderTopFirst':'Top comments'
    }
  });
});



'use strict';

angular.module('waid.comments.controllers', ['waid.core', 'waid.core.strategy', 'waid.core.app.strategy'])
  .controller('WAIDCommentsCtrl', function($scope, $rootScope, waidService, $q, waidCoreStrategy, waidCoreAppStrategy) {
    $scope.ordering =  angular.isDefined($scope.ordering) ? $scope.ordering : '-created';
    $scope.orderingEnabled =  angular.isDefined($scope.orderingEnabled) && $scope.orderingEnabled == 'false' ? false : true;
    $scope.threadId =  angular.isDefined($scope.threadId) ? $scope.threadId : 'currenturl';
    $scope.waid = $rootScope.waid;
    
    $scope.comment = {
      'comment':''
    }

    $scope.orderCommentList = function(ordering) {
      $scope.ordering = ordering;
      $scope.loadComments();
    }

    $scope.voteComment = function(comment, vote){
      if (!$rootScope.waid.user) {
        $rootScope.waid.openLoginAndRegisterHomeModal();
      } else {
        waidService.commentsVotePost(comment.id, vote).then(function(data){
          comment.vote_up_count = data.vote_up_count;
          comment.vote_down_count = data.vote_down_count;
          comment.vote_count = data.vote_count;
        })
      }
    }

    $scope.markComment = function(comment, mark) {
      waidService.commentsMarkPost(comment.id, mark).then(function(data){
        comment.marked_as_spam = data.marked_as_spam;
      })
    }
    
    $scope.editComment = function(comment) {
      comment.is_edit = true;
    }

    $scope.updateComment = function(comment) {
      var patch_comment = {
        'comment':comment.comment_formatted
      }

      waidService.userCommentsPatch(comment.id, patch_comment).then(function(data){
        comment.is_edit = false;
        comment.comment_formatted = data.comment_formatted
        comment.comment = data.comment
      });
    }

    $scope.deleteComment = function(comment) {
      waidService.userCommentsDelete(comment.id).then(function(data){
        var index = $scope.comments.indexOf(comment);
        $scope.comments.splice(index, 1);
      })
    }

    $scope.loadComments = function() {
      waidService.commentsListGet({'thread_id': $scope.threadId, 'ordering':$scope.ordering})
        .then(function(data){
          for(var i=0; i < data.length; i++) {
            data[i].is_edit = false;
            if (data[i].user.id == $rootScope.waid.user.id) {
              data[i].is_owner = true;
            }
          }
          $scope.comments = data
        }
      );
    }

    $scope.post = function(){
      $scope.comment.thread_id = $scope.threadId;
      waidService.userCommentsPost($scope.comment).then(function(data){
        $scope.comment.comment = '';
        $scope.loadComments();
      })
    }

    $scope.$watch('threadId', function(threadId){
      if (threadId != '') {
        $scope.loadComments();
      }
    });
  });

'use strict';

angular.module('waid.comments.directives', ['waid.core', 'waid.comments.controllers',])
  .directive('waidComments', function (waidCore) {
  return {
    restrict: 'E',
      scope: {
        ordering:"@?",
        threadId:"@?",
        orderingEnabled:"=?"
      },
      controller: 'WAIDCommentsCtrl',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || waidCore.config.getConfig('comments.templates.commentsHome')
      }
    }
  })
  .directive('waidCommentsOrderButton', function (waidCore) {
  return {
    restrict: 'E',
      templateUrl: function(elem,attrs) {
        return attrs.templateUrl || waidCore.config.getConfig('comments.templates.commentsOrderButton')
      }
    }
  });