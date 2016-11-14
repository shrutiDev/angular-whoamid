'use strict';
angular.module('waid.idm.controllers', ['waid.core']).controller('WAIDIDMTermsAndConditionsCtrl', function ($scope, $rootScope, waidService, $interpolate) {
  waidService.documentGet('terms-and-conditions').then(function (data) {
    var text = $interpolate(data.text)($rootScope);
    $scope.document = text;
  });
}).controller('WAIDIDMProfileCtrl', function ($scope, $rootScope, waidCore, waidService, $filter, $timeout, $q) {
  $scope.waid = waidCore;
  // Set profile definition
  $scope.profileDefinition = waidCore.config.idm.profileDefinition;
  // Default fieldset
  $scope.currentFieldSet = 'overview';
  // Emails fields
  $scope.inactiveEmails = [];
  $scope.activeEmails = [];
  $scope.email = { 'add': '' };
  // some weird stuff with model?
  // Main errors array
  $scope.errors = [];
  // Flag if uploading of avatar is running.
  $scope.isUploading = false;
  // Holds field names that are changed.
  $scope.changedFields = [];
  $scope.showFieldSet = function (fieldSet) {
    return fieldSet == $scope.currentFieldSet ? true : false;
  };
  $scope.getActiveFieldSetMenuClass = function (fieldSet) {
    return fieldSet == $scope.currentFieldSet ? 'active' : '';
  };
  $scope.goToFieldSet = function (fieldSet) {
    $scope.currentFieldSet = fieldSet;
    $scope.errors = [];
  };
  $scope.getAllFieldDefinitions = function () {
    var fieldDefinitions = [];
    for (var i = 0; $scope.profileDefinition.fieldSet.length > i; i++) {
      if (typeof $scope.profileDefinition.fieldSet[i].fieldDefinitions != 'undefined') {
        for (var a = 0; $scope.profileDefinition.fieldSet[i].fieldDefinitions.length > a; a++) {
          fieldDefinitions.push($scope.profileDefinition.fieldSet[i].fieldDefinitions[a]);
        }
      }
    }
    return fieldDefinitions;
  };
  $scope.dateOptions = {
    dateDisabled: false,
    maxDate: new Date(),
    minDate: new Date(1940, 1, 1),
    startingDay: 1,
    datepickerMode: 'year'
  };
  $scope.popup = { opened: false };
  $scope.open = function () {
    $scope.popup.opened = true;
  };
  $scope.fieldChange = function (fieldName) {
    if ($scope.changedFields.indexOf(fieldName) == -1) {
      $scope.changedFields.push(fieldName);
    }
  };
  $scope.updateProfileInfo = function () {
    var defer = $q.defer();
    waidService.userProfileGet().then(function (data) {
      var data = $scope.formatDataFromApi(data);
      $scope.errors = [];
      $scope.model = data;
      waidCore.user = data;
      defer.resolve(data);
    }, function (data) {
      $scope.errors = data;
      defer.reject(data);
    });
    return defer.promise;
  };
  $scope.uploadFile = function (files) {
    if (typeof files != 'undefined' && files.length > 0) {
      $scope.isUploading = true;
      var fd = new FormData();
      fd.append('file', files[0]);
      waidService.userAvatarPut(fd).then(function (data) {
        $timeout(function () {
          // Still buggy, save will redirect to overview...
          $scope.save(true);
          $scope.isUploading = false;
        }, 1000);
      });
    }
  };
  $scope.formatDataFromApi = function (data) {
    var fieldDefinitions = $scope.getAllFieldDefinitions();
    for (var i = 0; fieldDefinitions.length > i; i++) {
      var fieldDefinition = fieldDefinitions[i];
      // Format date
      if (fieldDefinition.type == 'date') {
        if (typeof data[fieldDefinition.name] != 'undefined' && data[fieldDefinition.name] && !(data[fieldDefinition.name] instanceof Date)) {
          var dateParts = data[fieldDefinition.name].split('-');
          data[fieldDefinition.name] = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
          continue;
        }
      }
    }
    return data;
  };
  $scope.formatDataToApi = function (data) {
    var fieldDefinitions = $scope.getAllFieldDefinitions();
    var fieldValues = {};
    for (var i = 0; fieldDefinitions.length > i; i++) {
      var fieldDefinition = fieldDefinitions[i];
      // Format date
      if (fieldDefinition.type == 'date') {
        if (typeof data[fieldDefinition.name] != 'undefined' && data[fieldDefinition.name] instanceof Date) {
          fieldValues[fieldDefinition.name] = $filter('date')(data[fieldDefinition.name], 'yyyy-MM-dd');
          continue;
        }
      }
      fieldValues[fieldDefinition.name] = data[fieldDefinition.name];
    }
    return fieldValues;
  };
  $scope.saveDefault = function (defaultProfilePostData) {
    var defer = $q.defer();
    waidService.userProfilePatch(defaultProfilePostData).then(function (data) {
      defer.resolve(data);
    }, function (data) {
      angular.extend($scope.errors, data);
      defer.reject(data);
    });
    return defer.promise;
  };
  $scope.saveUsername = function (usernameProfilePostData) {
    var defer = $q.defer();
    waidService.userUsernamePut(usernameProfilePostData).then(function (data) {
      defer.resolve(data);
    }, function (data) {
      angular.extend($scope.errors, data);
      defer.reject(data);
    });
    return defer.promise;
  };
  $scope.savePassword = function (passwordProfilePostData) {
    var defer = $q.defer();
    waidService.userPasswordPut(passwordProfilePostData).then(function (data) {
      defer.resolve(data);
    }, function (data) {
      angular.extend($scope.errors, data);
      defer.reject(data);
    });
    return defer.promise;
  };
  $scope.save = function (forceProfileUpdate) {
    $scope.errors = [];
    var dataPrepared = $scope.formatDataToApi($scope.model);
    //var profilePostData = angular.copy($scope.model);
    //console.log(profilePostData);
    var defaultProfilePostData = {};
    var passwordProfilePostData = {};
    var usernameProfilePostData = {};
    for (var key in dataPrepared) {
      if ($scope.changedFields.indexOf(key) != -1) {
        if (key == 'username') {
          usernameProfilePostData[key] = dataPrepared[key];
          continue;
        }
        if (key == 'password' || key == 'password_confirm') {
          passwordProfilePostData[key] = dataPrepared[key];
          continue;
        }
        defaultProfilePostData[key] = dataPrepared[key];
      }
    }
    var promises = [];
    if (Object.keys(passwordProfilePostData).length) {
      promises.push($scope.savePassword(passwordProfilePostData));
    }
    if (Object.keys(usernameProfilePostData).length) {
      promises.push($scope.saveUsername(usernameProfilePostData));
    }
    if (Object.keys(defaultProfilePostData).length) {
      promises.push($scope.saveDefault(defaultProfilePostData));
    }
    $q.all(promises).then(function () {
      $scope.errors = [];
      $rootScope.$broadcast('waid.idm.userProfile.save.ok');
      $scope.currentFieldSet = 'overview';
      if (forceProfileUpdate) {
        $scope.updateProfileInfo();
      }
    }, function (errors) {
      alert('Fatal error saving data');
    });
  };
  $scope.initEmails = function (data) {
    $scope.emails = data;
    $scope.inactiveEmails = [];
    $scope.activeEmails = [];
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].is_verified == 1) {
          $scope.activeEmails.push(data[i]);
        } else {
          $scope.inactiveEmails.push(data[i]);
        }
      }
    }
  };
  $scope.addEmailEnter = function (keyEvent) {
    if (keyEvent.which === 13) {
      $scope.addEmail($scope.email.add);
      keyEvent.preventDefault();
    }
  };
  $scope.deleteEmail = function (id) {
    waidService.userEmailDelete(id).then(function (data) {
      $scope.errors = [];
      $scope.loadEmailList();
    }, function (data) {
      $scope.errors = data;
    });
  };
  $scope.addEmail = function () {
    var data = { 'email': $scope.email.add };
    waidService.userEmailPost(data).then(function (data) {
      $scope.errors = [];
      $scope.loadEmailList();
      $scope.email.add = '';
    }, function (data) {
      $scope.errors = data;
    });
  };
  $scope.loadEmailList = function () {
    waidService.userEmailListGet().then(function (data) {
      $scope.initEmails(data.results);
    });
  };
  if (waidCore.user) {
    waidCore.user = $scope.formatDataFromApi(waidCore.user);
    $scope.model = waidCore.user;
    $scope.loadEmailList();
  } else {
    $rootScope.$on('waid.core.isInit', function (user) {
      waidCore.user = $scope.formatDataFromApi(waidCore.user);
      $scope.model = waidCore.user;
      $scope.loadEmailList();
    });
  }
}).controller('WAIDIDMCompleteProfileCtrl', function ($scope, $location, $window, waidService) {
  $scope.mode = 'complete';
}).controller('WAIDIDMLoginCtrl', function ($scope, $location, waidService, waidCore) {
  $scope.waid = waidCore;
  $scope.model = {
    'username': '',
    'password': ''
  };
  $scope.errors = [];
  $scope.login = function () {
    waidService.userLoginPost($scope.model).then(function (data) {
    }, function (data) {
      $scope.errors = data;
    });
  };
}).controller('WAIDIDMLostLoginCtrl', function ($scope, $location, waidService, waidCore) {
  $scope.waid = waidCore;
  $scope.model = { 'email': '' };
  $scope.errors = [];
  $scope.submit = function () {
    waidService.userLostLoginPost($scope.model).then(function (data) {
      $scope.errors = [];
    }, function (data) {
      $scope.errors = data;
    });
  };
}).controller('WAIDIDMSocialCtrl', function ($scope, $location, waidService, $window, waidCore) {
  $scope.waid = waidCore;
  $scope.providers = [];
  $scope.getProviders = function () {
    waidService.socialProviderListGet().then(function (data) {
      for (var i = 0; i < data.length; i++) {
        data[i].url = data[i].url + '?return_url=' + encodeURIComponent(waidCore.getAlCodeUrl());
      }
      $scope.providers = data;
    });
  };
  $scope.goToSocialLogin = function (provider) {
    $window.location.assign(provider.url);
  };
  $scope.getProviders();
}).controller('WAIDIDMRegisterCtrl', function ($scope, $route, waidService, $location, $uibModal, waidCore) {
  $scope.waid = waidCore;
  $scope.show = {};
  $scope.missingEmailVerification = false;
  if ($scope.modus == 'complete') {
    // Check for logged-in user
    waidService.userCompleteProfileGet().then(function (data) {
      $scope.model = data.user;
      if (typeof data.profile_status != 'undefined' && data.profile_status.indexOf('email_is_not_verified') !== -1) {
        $scope.missingEmailVerification = true;
      }
      // Set missing data
      for (var i = 0; i < data.missing_data.length; i++) {
        $scope.show[data.missing_data[i]] = true;
      }
    }, function (data) {
    });
  } else {
    $scope.missingEmailVerification = false;
    $scope.show = {
      'username': true,
      'password': true,
      'email': true,
      'terms_and_conditions_check': true
    };
  }
  // $scope.model = {
  //   'username':'',
  //   'password':'',
  //   'email':'',
  //   'terms_and_conditions_check':false
  // };
  $scope.register = function () {
    if ($scope.model.terms_and_conditions_check) {
      $scope.errors = [];
      if ($scope.modus == 'complete') {
        waidService.userCompleteProfilePost($scope.model).then(function (data) {
          $scope.model = {};
        }, function (data) {
          $scope.errors = data;
        });
      } else {
        waidService.userRegisterPost($scope.model).then(function (data) {
          $scope.model = {};
        }, function (data) {
          $scope.errors = data;
        });
      }
    }
  };
});