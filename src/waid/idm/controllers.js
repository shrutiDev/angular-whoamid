'use strict';
angular.module('waid.idm.controllers', ['waid.core']).controller('WAIDIDMUserProfileHomeCtrl', function ($scope, $rootScope, waidService, $routeParams) {
  $scope.currentProfilePage = 'overview';
  $scope.showProfilePage = function (page) {
    return page == $scope.currentProfilePage ? true : false;
  };
  $scope.getActiveProfilePageMenuClass = function (page) {
    return page == $scope.currentProfilePage ? 'active' : '';
  };
  $scope.goToProfilePage = function (page) {
    $scope.currentProfilePage = page;
  };
  $rootScope.$on('waid.services.application.userProfile.patch.ok', function (event, data) {
    $scope.currentProfilePage = 'overview';
  });
  $rootScope.$on('waid.services.application.userProfile.put.ok', function (event, data) {
    $scope.currentProfilePage = 'overview';
  });
}).controller('WAIDIDMCompleteProfileCtrl', function ($scope, $location, $window, waidService) {
  $scope.mode = 'complete';
}).controller('WAIDIDMLoginCtrl', function ($scope, $location, waidService) {
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
}).controller('WAIDIDMLostLoginCtrl', function ($scope, $location, waidService) {
  $scope.model = { 'email': '' };
  $scope.errors = [];
  $scope.submit = function () {
    waidService.userLostLoginPost($scope.model).then(function (data) {
      $scope.errors = [];
    }, function (data) {
      $scope.errors = data;
    });
  };
}).controller('WAIDIDMUserProfileInterestsCtrl', function ($scope, $rootScope, $location, waidCore, waidService) {
  $scope.model = waidCore.user;
  $scope.save = function () {
    waidService.userProfilePatch($scope.model).then(function (data) {
      $scope.errors = [];
    }, function (data) {
      $scope.errors = data;
    });
  };
}).controller('WAIDIDMUserProfileOverviewCtrl', function ($scope, $rootScope, $location, waidCore, waidService) {
  $scope.model = waidCore.user;
  waidService.userEmailListGet().then(function (data) {
    console.log(data);
    $scope.emails = data.results;
  });
  // Update stuff
  $rootScope.$watch('waid.user', function (data) {
    $scope.model = data;
  }, true);
}).controller('WAIDIDMUserProfileMainCtrl', function ($scope, $rootScope, $location, waidCore, waidService, $filter, $timeout) {
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
  $scope.popup = { opened: false };
  $scope.open = function () {
    $scope.popup.opened = true;
  };
  $scope.updateProfileInfo = function () {
    waidService.userProfileGet().then(function (data) {
      $scope.errors = [];
      $scope.model = data;
      waidCore.user = data;
    }, function (data) {
      $scope.errors = data;
    });
  };
  $scope.uploadFile = function (files) {
    $scope.isUploading = true;
    var fd = new FormData();
    fd.append('file', files[0]);
    waidService.userAvatarPut(fd).then(function (data) {
      $timeout(function () {
        // Still buggy, save will redirect to overview...
        $scope.save();
        $scope.isUploading = false;
      }, 1000);
    });
  };
  $scope.save = function () {
    if (typeof $scope.profileDate != 'undefined' && $scope.profileDate) {
      $scope.model.date_of_birth = $filter('date')($scope.profileDate, 'yyyy-MM-dd');
    }
    waidService.userProfilePatch($scope.model).then(function (data) {
      $scope.model = data;
      waidCore.user = data;
      $scope.errors = [];
    }, function (data) {
      $scope.errors = data;
    });
  };
  // Format date string to javascript date
  $scope.$watch('model.date_of_birth', function (date) {
    if (typeof date != 'undefined' && date != null) {
      var dateParts = date.split('-');
      $scope.profileDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    }
  });
}).controller('WAIDIDMUserProfilePasswordCtrl', function ($scope, $rootScope, $location, waidService, $filter) {
  $scope.model = {};
  $scope.save = function () {
    waidService.userPasswordPut($scope.model).then(function (data) {
      $scope.errors = [];
      $scope.model = {};
    }, function (data) {
      $scope.errors = data;
    });
  };
}).controller('WAIDIDMUserProfileUsernameCtrl', function ($scope, $rootScope, $location, waidCore, waidService, $filter) {
  $scope.model = { 'username': waidCore.user.username };
  $scope.save = function () {
    waidService.userUsernamePut($scope.model).then(function (data) {
      $scope.errors = [];
    }, function (data) {
      $scope.errors = data;
    });
  };
}).controller('WAIDIDMUserProfileEmailCtrl', function ($scope, $rootScope, $location, waidService) {
  $scope.inactiveEmails = [];
  $scope.activeEmails = [];
  $scope.emailAdd = '';
  $scope.initEmails = function (data) {
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
  $scope.deleteEmail = function (id) {
    waidService.userEmailDelete(id).then(function (data) {
      $scope.errors = [];
      $scope.loadEmailList();
    }, function (data) {
      $scope.errors = data;
    });
  };
  $scope.addEmail = function () {
    var data = { 'email': $scope.emailAdd };
    waidService.userEmailPost(data).then(function (data) {
      $scope.errors = [];
      $scope.loadEmailList();
      $scope.emailAdd = '';
    }, function (data) {
      $scope.errors = data;
    });
  };
  $scope.loadEmailList = function () {
    waidService.userEmailListGet().then(function (data) {
      $scope.initEmails(data.results);
    });
  };
  $scope.$watch('waid.isInit', function (isInit) {
    if (isInit) {
      $scope.loadEmailList();
    }
  }, true);
}).controller('WAIDIDMSocialCtrl', function ($scope, $location, waidService, $window, waidCore) {
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
  $scope.$watch('waid.isInit', function (isInit) {
    if (isInit) {
      $scope.getProviders();
    }
  }, true);
}).controller('WAIDIDMRegisterCtrl', function ($scope, $route, waidService, $location, $uibModal) {
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