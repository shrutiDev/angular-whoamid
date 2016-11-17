'use strict';
angular.module('waid.core.services', ['waid.core']).service('waidService', function ($q, $http, $cookies, $rootScope, $location, waidCore, $window) {
  var service = {
    'API_URL': '',
    'apiVersion': 'v1',
    'token': null,
    'authenticated': false,
    'fp': '',
    'running': [],
    'request': function (args) {
      var that = this;
      // Set CSRFToken
      $http.defaults.headers.common['X-CSRFToken'] = $cookies.get('csrftoken');
      // Set authorization token
      if (waidCore.token != null && waidCore.token != '' && waidCore.token != 'null') {
        $http.defaults.headers.common.Authorization = 'Token ' + waidCore.token;
      } else {
        $http.defaults.headers.common.Authorization = null;
      }
      $http.defaults.headers.common.FPID = this.fp;
      $http.defaults.headers.common.CID = 'AngularJS ' + waidCore.config.version;
      // Extend headers
      var headers = {};
      if (typeof args.headers != 'undefined') {
        angular.extend(headers, args.headers);
      }
      params = args.params || {};
      args = args || {};
      var deferred = $q.defer(), url = args.url, method = args.method || 'GET', params = params, data = args.data || {};
      that.running.push(url);
      waidCore.isLoading = true;
      // Fire the request, as configured.
      $http({
        url: url,
        method: method.toUpperCase(),
        headers: headers,
        params: params,
        data: data
      }).success(angular.bind(this, function (data, status, headers, config) {
        //$rootScope.waid.isLoading = false;
        var index = this.running.indexOf(url);
        if (index > -1) {
          this.running.splice(index, 1);
          if (this.running.length > 0) {
            waidCore.isLoading = true;
          } else {
            waidCore.isLoading = false;
          }
        }
        deferred.resolve(data, status);
      })).error(angular.bind(this, function (data, status, headers, config) {
        var index = this.running.indexOf(url);
        if (index > -1) {
          this.running.splice(index, 1);
          if (this.running.length > 0) {
            waidCore.isLoading = true;
          } else {
            waidCore.isLoading = false;
          }
        }
        // Set request status
        if (data) {
          data.status = status;
        }
        if (typeof data != 'undefined' && typeof data.error != 'undefined' && data.error.code != 'undefined' && data.error.code == 'invalid_authentication_credentials') {
          that._clearAuthorizationData();
        }
        // Forbidden, send out event..
        if (status == 403) {
          $rootScope.$broadcast('waid.services.request.noPermission', data);
        }
        if (status == 0) {
          if (data == '') {
            data = {};
            data.status = 0;
            data.non_field_errors = ['Could not connect. Please try again.'];
          }
          // or if the data is null, then there was a timeout.
          if (data == null) {
            // Inject a non field error alerting the user
            // that there's been a timeout error.
            data = {};
            data.status = 0;
            data.non_field_errors = ['Server timed out. Please try again.'];
          }
        }
        deferred.reject(data, status, headers, config);
      }));
      return deferred.promise;
    },
    '_login': function (token) {
      waidCore.token = token;
      waidCore.isLoggedIn = true;
      waidCore.authenticateCheck = false;
      waidCore.saveWaidData();
      this.authenticate();
    },
    '_clearAuthorizationData': function () {
      this.authenticated = false;
      waidCore.token = null;
    },
    '_makeFileRequest': function (method, type, path, broadcast, data) {
      var that = this;
      var deferred = $q.defer();
      this.request({
        'method': method,
        'url': that._buildUrl(type, path),
        'data': data,
        'headers': { 'Content-Type': undefined }
      }).then(function (data) {
        $rootScope.$broadcast('waid.services.' + broadcast + '.' + method.toLowerCase() + '.ok', data);
        deferred.resolve(data);
      }, function (data) {
        $rootScope.$broadcast('waid.services.' + broadcast + '.' + method.toLowerCase() + '.error', data);
        deferred.reject(data);
      });
      return deferred.promise;
    },
    '_buildUrl': function (type, path) {
      switch (type) {
      case 'admin':
        return this.API_URL + '/admin/' + this.apiVersion + '/' + waidCore.account.id + path;
      case 'app':
        return this.API_URL + '/application/' + this.apiVersion + '/' + waidCore.account.id + '/' + $rootScope.waid.application.id + path;
      case 'public':
        return this.API_URL + '/public/' + this.apiVersion + path;
      default:
        return '';
      }
    },
    '_makeRequest': function (method, type, path, broadcast, data, skipIsInit) {
      var that = this;
      // If not dependend on initialisation then return promise of request
      if (waidCore.isInit || typeof skipIsInit != 'undefined' && skipIsInit == true) {
        var deferred = $q.defer();
        that.request({
          'method': method,
          'url': that._buildUrl(type, path),
          'data': data
        }).then(function (data) {
          $rootScope.$broadcast('waid.services.' + broadcast + '.' + method.toLowerCase() + '.ok', data);
          deferred.resolve(data);
        }, function (data) {
          $rootScope.$broadcast('waid.services.' + broadcast + '.' + method.toLowerCase() + '.error', data);
          deferred.reject(data);
        });
        return deferred.promise;
      } else {
        // If dependent on initialisation, return promise of isInit
        var deferred = $q.defer();
        var unregister = $rootScope.$watch('waid.isInit', function (isInit) {
          if (isInit) {
            that.request({
              'method': method,
              'url': that._buildUrl(type, path),
              'data': data
            }).then(function (data) {
              $rootScope.$broadcast('waid.services.' + broadcast + '.' + method.toLowerCase() + '.ok', data);
              deferred.resolve(data);
              unregister();
            }, function (data) {
              $rootScope.$broadcast('waid.services.' + broadcast + '.' + method.toLowerCase() + '.error', data);
              deferred.reject(data);
              unregister();
            });
          }
        });
        return deferred.promise;
      }
    },
    'makeExternalRequest': function(method, url, data) {
      var that = this;
      var deferred = $q.defer();
      this.request({
        'method': method,
        'url': url,
        'data': data,
        'headers': { 'Content-Type': undefined }
      }).then(function (data) {
        deferred.resolve(data);
      }, function (data) {
        deferred.reject(data);
      });
      return deferred.promise;
    },
    'userRegisterPost': function (data) {
      if (typeof data.return_url == 'undefined' || data.return_url == '') {
        data.return_url = waidCore.getAlCodeUrl();
      }
      return this._makeRequest('POST', 'app', '/user/register/', 'application.userRegister', data);
    },
    'userCompleteProfilePost': function (data) {
      if (typeof data.return_url == 'undefined' || data.return_url == '') {
        data.return_url = waidCore.getAlCodeUrl();
      }
      return this._makeRequest('POST', 'app', '/user/complete-profile/', 'application.userCompleteProfile', data);
    },
    'userCompleteProfileGet': function () {
      return this._makeRequest('GET', 'app', '/user/complete-profile/', 'application.userCompleteProfile');
    },
    'userLoginPost': function (data) {
      this._clearAuthorizationData();
      var that = this;
      return this._makeRequest('POST', 'app', '/user/login/', 'application.userLogin', data).then(function (data) {
        that._login(data.token);
        return data;
      });
    },
    'userAutoLoginGet': function (code) {
      var that = this;
      this._clearAuthorizationData();
      return this._makeRequest('GET', 'app', '/user/autologin/' + code + '/', 'application.userAutoLogin', null, true).then(function (data) {
        that._login(data.token);
        return data;
      });
    },
    'userLostLoginPost': function (data) {
      this._clearAuthorizationData();
      if (typeof data.return_url == 'undefined' || data.return_url == '') {
        data.return_url = waidCore.getAlCodeUrl();
      }
      return this._makeRequest('POST', 'app', '/user/lost-login/', 'application.userLostLogin', data);
    },
    'userLogoutPost': function () {
      var that = this;
      return this._makeRequest('POST', 'app', '/user/logout/', 'application.userLogout').then(function (data) {
        that._clearAuthorizationData();
        return data;
      });
    },
    'userLogoutAllPost': function () {
      var that = this;
      return this._makeRequest('POST', 'app', '/user/logout-all/', 'application.userLogoutAll').then(function (data) {
        that._clearAuthorizationData();
        return data;
      });
    },
    'userProfileGet': function () {
      return this._makeRequest('GET', 'app', '/user/profile/', 'application.userProfile');
    },
    'userPasswordPut': function (data) {
      return this._makeRequest('PUT', 'app', '/user/password/', 'application.userPassword', data);
    },
    'userProfilePatch': function (data) {
      return this._makeRequest('PATCH', 'app', '/user/profile/', 'application.userProfile', data);
    },
    'userMetadataPost': function(data){
      return this._makeRequest('POST', 'app', '/user/metadata/', 'application.userMetadata', data);
    },
    'userMetadataGet': function(){
      return this._makeRequest('GET', 'app', '/user/metadata/', 'application.userMetadata');
    },
    'userUsernamePut': function (data) {
      return this._makeRequest('PUT', 'app', '/user/username/', 'application.userUsername', data);
    },
    // Email
    'userEmailListGet': function () {
      return this._makeRequest('GET', 'app', '/user/email/', 'application.userEmailList');
    },
    'userEmailPost': function (data) {
      if (typeof data.return_url == 'undefined' || data.return_url == '') {
        data.return_url = waidCore.getAlCodeUrl();
      }
      return this._makeRequest('POST', 'app', '/user/email/', 'application.userEmail', data);
    },
    'userEmailDelete': function (id) {
      return this._makeRequest('DELETE', 'app', '/user/email/' + id + '/', 'application.userEmail');
    },
    // Telephone
    'userTelephoneListGet': function() {
      return this._makeRequest('GET', 'app', '/user/telephone/', 'application.userTelephoneList');
    },
    'userTelephonePost': function (data) {
      return this._makeRequest('POST', 'app', '/user/telephone/', 'application.userTelephone', data);
    },
    'userTelephonePut': function (id, data) {
      return this._makeRequest('PUT', 'app', '/user/telephone/' + id + '/', 'application.userTelephone', data);
    },
    'userTelephoneDelete': function (id) {
      return this._makeRequest('DELETE', 'app', '/user/telephone/' + id + '/', 'application.userTelephone');
    },
    // Addresses
    'userAddressListGet': function() {
      return this._makeRequest('GET', 'app', '/user/address/', 'application.userAddressList');
    },
    'userAddressPost': function (data) {
      return this._makeRequest('POST', 'app', '/user/address/', 'application.userAddress', data);
    },
    'userAddressPut': function (id, data) {
      return this._makeRequest('PUT', 'app', '/user/address/' + id + '/', 'application.userAddress', data);
    },
    'userAddressDelete': function (id) {
      return this._makeRequest('DELETE', 'app', '/user/address/' + id + '/', 'application.userAddress');
    },
    // Avatar
    'userAvatarPut': function (fd) {
      return this._makeFileRequest('PUT', 'app', '/user/avatar/', 'application.userAvatar', fd);
    },
    'socialProviderListGet': function () {
      return this._makeRequest('GET', 'app', '/social/providers/', 'application.socialProviderList');
    },
    'userCommentsPatch': function (id, data) {
      return this._makeRequest('PATCH', 'app', '/user/comments/' + id + '/', 'application.userComments', data);
    },
    'userCommentsPost': function (data) {
      if (typeof data.object_id != 'undefined' && data.object_id == 'currenturl') {
        data.object_id = waidCore.slugify($location.absUrl());
      }
      data.url = $location.absUrl();
      return this._makeRequest('POST', 'app', '/user/comments/', 'application.userComments', data);
    },
    'userCommentsDelete': function (id) {
      return this._makeRequest('DELETE', 'app', '/user/comments/' + id + '/', 'application.userComments');
    },
    'userCommentsListGet': function (params) {
      if (typeof params != 'undefined') {
        if (typeof params.object_id != 'undefined' && params.object_id == 'currenturl') {
          params.object_id = waidCore.slugify($location.absUrl());
        }
        var query = '?' + $.param(params);
      } else {
        var query = '';
      }
      return this._makeRequest('GET', 'app', '/user/comments/' + query, 'application.userCommentsList');
    },
    'commentsListGet': function (params) {
      if (typeof params != 'undefined') {
        if (typeof params.object_id != 'undefined' && params.object_id == 'currenturl') {
          params.object_id = waidCore.slugify($location.absUrl());
        }
        var query = '?' + $.param(params);
      } else {
        var query = '';
      }
      return this._makeRequest('GET', 'app', '/comments/' + query, 'application.commentsList');
    },
    'commentsVotePost': function (id, vote) {
      var data = { 'vote': vote };
      return this._makeRequest('POST', 'app', '/comments/' + id + '/vote/', 'application.commentsVote', data);
    },
    'commentsMarkPost': function (id, mark) {
      var data = { 'mark': mark };
      return this._makeRequest('POST', 'app', '/comments/' + id + '/mark/', 'application.commentsMark', data);
    },
    'ratingPost': function (data) {
      if (typeof data.object_id != 'undefined' && data.object_id == 'currenturl') {
        data.object_id = waidCore.slugify($location.absUrl());
      }
      data.url = $location.absUrl();
      return this._makeRequest('POST', 'app', '/rating/', 'application.rating', data);
    },
    'ratingGet': function (object_id) {
      return this._makeRequest('GET', 'app', '/rating/' + object_id + '/', 'application.rating');
    },
    'articlesListGet': function () {
      return this._makeRequest('GET', 'app', '/articles/', 'application.articlesList');
    },
    'articlesGet': function (id) {
      return this._makeRequest('GET', 'app', '/articles/' + id + '/', 'application.articles');
    },
    'applicationGet': function (id) {
      return this._makeRequest('GET', 'app', '/', 'application');
    },
    'documentGet': function (doc) {
      return this._makeRequest('GET', 'app', '/docs/' + doc + '/', 'applicationDocumentGet');
    },
    'adminCommentsListGet': function (params) {
      if (typeof params != 'undefined') {
        var query = '?' + $.param(params);
      } else {
        var query = '';
      }
      return this._makeRequest('GET', 'admin', '/comments/' + query, 'admin.commentsListGet');
    },
    'adminDefaultEmailTemplatesGet': function () {
      if (!this.adminDefaultEmailTemplatesGetRunning) {
        this.adminDefaultEmailTemplatesGetRunning = this._makeRequest('GET', 'admin', '/default-email-templates/', 'application.adminDefaultEmailTemplates');
      }
      return this.adminDefaultEmailTemplatesGetRunning;
    },
    'adminCommentsPatch': function (id, data) {
      return this._makeRequest('PATCH', 'admin', '/comments/' + id + '/', 'admin.commentsPatch', data);
    },
    'adminCommentsDelete': function (id) {
      return this._makeRequest('DELETE', 'admin', '/comments/' + id + '/', 'admin.CommentsDelete');
    },
    'adminAccountGet': function () {
      return this._makeRequest('GET', 'admin', '/account/', 'admin.account');
    },
    'adminAccountPatch': function (data) {
      return this._makeRequest('PATCH', 'admin', '/account/', 'admin.account', data);
    },
    'adminApplicationListGet': function () {
      return this._makeRequest('GET', 'admin', '/application/', 'admin.applicationList');
    },
    'adminApplicationGet': function (id) {
      return this._makeRequest('GET', 'admin', '/application/' + id + '/', 'admin.application');
    },
    'adminApplicationPatch': function (data) {
      return this._makeRequest('PATCH', 'admin', '/application/' + data.id + '/', 'admin.application', data);
    },
    'publicAccountGet': function (account) {
      return this._makeRequest('GET', 'public', '/account/' + account + '/', 'public.account', null, true);
    },
    'publicAccountCreatePost': function (data) {
      data.redirect_to_url = $location.absUrl() + 'admin/' + data.slug + '/';
      return this._makeRequest('POST', 'public', '/account/create/', 'admin.accountCreate', data, true);
    },
    'authenticate': function () {
      var that = this;
      var deferred = $q.defer();
      if (waidCore.token != null && waidCore.token != '' && waidCore.token != 'null') {
        this._makeRequest('GET', 'app', '/user/profile/', 'application.userProfile', null, true).then(function (data) {
          that.authenticated = true;
          waidCore.user = data;
          $rootScope.$broadcast('waid.services.authenticate.ok', that);
          deferred.resolve(data);
        }, function (data) {
          that.authenticated = false;
          $rootScope.$broadcast('waid.services.authenticate.error', that);
          deferred.reject(data);
        });
      } else {
        that.authenticated = false;
        $rootScope.$broadcast('waid.services.authenticate.none');
        deferred.reject();
      }
      return deferred.promise;
    },
    'initialize': function (url) {
      var that = this;
      this.API_URL = $window.location.protocol + '//';
      this.API_URL += url;
      return this;
    }
  };
  service.initialize();
  return service;
});