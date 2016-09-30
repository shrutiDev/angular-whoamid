'use strict';
angular.module('waid.core.services', ['waid.core']).service('waidService', function ($q, $http, $cookies, $rootScope, $location, waidCore) {
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
      // Extend headers
      var headers = {};
      if (typeof args.headers != 'undefined') {
        angular.extend(headers, args.headers);
      }
      params = args.params || {};
      args = args || {};
      var deferred = $q.defer(), url = this.API_URL + args.url, method = args.method || 'GET', params = params, data = args.data || {};
      that.running.push(url);
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
        }
        deferred.resolve(data, status);
      })).error(angular.bind(this, function (data, status, headers, config) {
        var index = this.running.indexOf(url);
        if (index > -1) {
          this.running.splice(index, 1);
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
          $rootScope.$broadcast('waid.services.request.error', data);
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
      waidCore.saveWaidData();
      this.authenticate();
      console.log('Login initialized');
    },
    '_clearAuthorizationData': function () {
      this.authenticated = false;
      waidCore.token = null;
      console.log('Logout initialized');
    },
    '_makeFileRequest': function (method, path, broadcast, data) {
      var deferred = $q.defer();
      this.request({
        'method': method,
        'url': path,
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
    '_makeRequest': function (method, path, broadcast, data) {
      var deferred = $q.defer();
      this.request({
        'method': method,
        'url': path,
        'data': data
      }).then(function (data) {
        $rootScope.$broadcast('waid.services.' + broadcast + '.' + method.toLowerCase() + '.ok', data);
        deferred.resolve(data);
      }, function (data) {
        $rootScope.$broadcast('waid.services.' + broadcast + '.' + method.toLowerCase() + '.error', data);
        deferred.reject(data);
      });
      return deferred.promise;
    },
    '_getAdminUrl': function (url) {
      return '/admin/' + this.apiVersion + '/' + waidCore.account.id + url;
    },
    '_getAppUrl': function (url) {
      return '/application/' + this.apiVersion + '/' + waidCore.account.id + '/' + $rootScope.waid.application.id + url;
    },
    '_getPublicUrl': function (url) {
      return '/public/' + this.apiVersion + url;
    },
    'userRegisterPost': function (data) {
      if (typeof data.return_url == 'undefined' || data.return_url == '') {
        data.return_url = waidCore.getAlCodeUrl();
      }
      return this._makeRequest('POST', this._getAppUrl('/user/register/'), 'application.userRegister', data);
    },
    'userCompleteProfilePost': function (data) {
      if (typeof data.return_url == 'undefined' || data.return_url == '') {
        data.return_url = waidCore.getAlCodeUrl();
      }
      return this._makeRequest('POST', this._getAppUrl('/user/complete-profile/'), 'application.userCompleteProfile', data);
    },
    'userCompleteProfileGet': function () {
      return this._makeRequest('GET', this._getAppUrl('/user/complete-profile/'), 'application.userCompleteProfile');
    },
    'userLoginPost': function (data) {
      this._clearAuthorizationData();
      var that = this;
      return this._makeRequest('POST', this._getAppUrl('/user/login/'), 'application.userLogin', data).then(function (data) {
        that._login(data.token);
        return data;
      });
    },
    'userAutoLoginGet': function (code) {
      var that = this;
      this._clearAuthorizationData();
      return this._makeRequest('GET', this._getAppUrl('/user/autologin/' + code + '/'), 'application.userAutoLogin').then(function (data) {
        that._login(data.token);
        return data;
      });
    },
    'userLostLoginPost': function (data) {
      this._clearAuthorizationData();
      return this._makeRequest('POST', this._getAppUrl('/user/lost-login/'), 'application.userLostLogin', data);
    },
    'userLogoutPost': function () {
      var that = this;
      return this._makeRequest('POST', this._getAppUrl('/user/logout/'), 'application.userLogout').then(function (data) {
        that._clearAuthorizationData();
        waidCore.user = false;
        return data;
      });
    },
    'userLogoutAllPost': function () {
      var that = this;
      return this._makeRequest('POST', this._getAppUrl('/user/logout-all/'), 'application.userLogoutAll').then(function (data) {
        that._clearAuthorizationData();
        waidCore.user = false;
        return data;
      });
    },
    'userProfileGet': function () {
      return this._makeRequest('GET', this._getAppUrl('/user/profile/'), 'application.userProfile');
    },
    'userPasswordPut': function (data) {
      return this._makeRequest('PUT', this._getAppUrl('/user/password/'), 'application.userPassword', data);
    },
    'userProfilePatch': function (data) {
      return this._makeRequest('PATCH', this._getAppUrl('/user/profile/'), 'application.userProfile', data);
    },
    'userUsernamePut': function (data) {
      return this._makeRequest('PUT', this._getAppUrl('/user/username/'), 'application.userUsername', data);
    },
    'userEmailListGet': function () {
      return this._makeRequest('GET', this._getAppUrl('/user/email/'), 'application.userEmailList');
    },
    'userEmailPost': function (data) {
      if (typeof data.return_url == 'undefined' || data.return_url == '') {
        data.return_url = waidCore.getAlCodeUrl();
      }
      return this._makeRequest('POST', this._getAppUrl('/user/email/'), 'application.userEmail', data);
    },
    'userEmailDelete': function (id) {
      return this._makeRequest('DELETE', this._getAppUrl('/user/email/' + id + '/'), 'application.userEmail');
    },
    'userAvatarPut': function (fd) {
      return this._makeFileRequest('PUT', this._getAppUrl('/user/avatar/'), 'application.userAvatar', fd);
    },
    'socialProviderListGet': function () {
      return this._makeRequest('GET', this._getAppUrl('/social/providers/'), 'application.socialProviderList');
    },
    'userCommentsPatch': function (id, data) {
      return this._makeRequest('PATCH', this._getAppUrl('/user/comments/' + id + '/'), 'application.userComments', data);
    },
    'userCommentsPost': function (data) {
      if (typeof data.thread_id != 'undefined' && data.thread_id == 'currenturl') {
        data.thread_id = waidCore.slugify($location.absUrl());
      }
      data.url = $location.absUrl();
      return this._makeRequest('POST', this._getAppUrl('/user/comments/'), 'application.userComments', data);
    },
    'userCommentsDelete': function (id) {
      return this._makeRequest('DELETE', this._getAppUrl('/user/comments/' + id + '/'), 'application.userComments');
    },
    'userCommentsListGet': function (params) {
      if (typeof params != 'undefined') {
        if (typeof params.thread_id != 'undefined' && params.thread_id == 'currenturl') {
          params.thread_id = waidCore.slugify($location.absUrl());
        }
        var query = '?' + $.param(params);
      } else {
        var query = '';
      }
      return this._makeRequest('GET', this._getAppUrl('/user/comments/' + query), 'application.userCommentsList');
    },
    'commentsListGet': function (params) {
      if (typeof params != 'undefined') {
        if (typeof params.thread_id != 'undefined' && params.thread_id == 'currenturl') {
          params.thread_id = waidCore.slugify($location.absUrl());
        }
        var query = '?' + $.param(params);
      } else {
        var query = '';
      }
      return this._makeRequest('GET', this._getAppUrl('/comments/' + query), 'application.commentsList');
    },
    'commentsVotePost': function (id, vote) {
      var data = { 'vote': vote };
      return this._makeRequest('POST', this._getAppUrl('/comments/' + id + '/vote/'), 'application.commentsVote', data);
    },
    'commentsMarkPost': function (id, mark) {
      var data = { 'mark': mark };
      return this._makeRequest('POST', this._getAppUrl('/comments/' + id + '/mark/'), 'application.commentsMark', data);
    },
    'articlesListGet': function () {
      return this._makeRequest('GET', this._getAppUrl('/articles/'), 'application.articlesList');
    },
    'articlesGet': function (id) {
      return this._makeRequest('GET', this._getAppUrl('/articles/' + id + '/'), 'application.articles');
    },
    'applicationGet': function(id) {
      return this._makeRequest('GET', this._getAppUrl('/'), 'application');
    },
    'adminCommentsListGet': function (params) {
      if (typeof params != 'undefined') {
        var query = '?' + $.param(params);
      } else {
        var query = '';
      }
      return this._makeRequest('GET', this._getAdminUrl('/comments/' + query), 'admin.commentsListGet');
    },
    'adminDefaultEmailTemplatesGet': function () {
      if (!this.adminDefaultEmailTemplatesGetRunning) {
        this.adminDefaultEmailTemplatesGetRunning = this._makeRequest('GET', this._getAdminUrl('/default-email-templates/'), 'application.adminDefaultEmailTemplates');
      }
      return this.adminDefaultEmailTemplatesGetRunning;
    },
    'adminCommentsPatch': function (id, data) {
      return this._makeRequest('PATCH', this._getAdminUrl('/comments/' + id + '/'), 'admin.commentsPatch', data);
    },
    'adminCommentsDelete': function (id) {
      return this._makeRequest('DELETE', this._getAdminUrl('/comments/' + id + '/'), 'admin.CommentsDelete');
    },
    'adminAccountGet': function () {
      return this._makeRequest('GET', this._getAdminUrl('/account/'), 'admin.account');
    },
    'adminAccountPatch': function (data) {
      return this._makeRequest('PATCH', this._getAdminUrl('/account/'), 'admin.account', data);
    },
    'adminApplicationListGet': function () {
      return this._makeRequest('GET', this._getAdminUrl('/application/'), 'admin.applicationList');
    },
    'adminApplicationGet': function (id) {
      return this._makeRequest('GET', this._getAdminUrl('/application/' + id + '/'), 'admin.application');
    },
    'adminApplicationPatch': function (data) {
      return this._makeRequest('PATCH', this._getAdminUrl('/application/' + data.id + '/'), 'admin.application', data);
    },
    'publicAccountGet': function (account) {
      return this._makeRequest('GET', this._getPublicUrl('/account/' + account + '/'), 'public.account');
    },
    'publicAccountCreatePost': function (data) {
      data.redirect_to_url = $location.absUrl() + 'admin/' + data.slug + '/';
      return this._makeRequest('POST', this._getPublicUrl('/account/create/'), 'admin.accountCreate', data);
    },
    'authenticate': function () {
      var that = this;
      var deferred = $q.defer();
      if (waidCore.token != null && waidCore.token != '' && waidCore.token != 'null') {
        this.userProfileGet().then(function (data) {
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
    'getAccountId': function () {
      return waidCore.account.id;
    },
    'initialize': function (url) {
      var that = this;
      if (window.location.port == '8000') {
        this.API_URL = waidCore.config.getConfig('api.environment.development.url');
      } else if (window.location.port == '8001') {
        this.API_URL = waidCore.config.getConfig('api.environment.test.url');
      } else if (window.location.port == '8002') {
        this.API_URL = waidCore.config.getConfig('api.environment.staging.url');
      } else {
        this.API_URL = waidCore.config.getConfig('api.environment.production.url');
      }
      new Fingerprint2().get(function (result, components) {
        that.fp = result;
        that.fpComponents = components;
      });
      return this;
    }
  };
  service.initialize();
  return service;
});