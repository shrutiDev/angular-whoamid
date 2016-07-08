'use strict';

angular.module('client.controllers', ['app'])
  .controller('ClientSocialError', function ($scope, $rootScope, growl, $routeParams, $location) {
    growl.addErrorMessage(config.errorCodes[$routeParams.error]);
    $location.path("/");
  }) 
  .controller('DefaultModalCtrl', function ($scope, $location, waidService,  $uibModalInstance) {
    $scope.close = function () {
      $uibModalInstance.dismiss('close');
    };
  }) 

  .controller('CompleteProfileCtrl', function ($scope, $location, $window, waidService,  $uibModalInstance) {
    $scope.mode = 'complete';
    $scope.close = function () {
      $uibModalInstance.dismiss('close');
    };
  }) 
  .controller('CommentCtrl', function($scope, waidService) {
    // TODO
    var params = {
      'ordering': '-created',
      'page_id': 'page_1'
    }
    waidService.commentsListGet(params).then(function(data){
      console.log(data);
    });
  })
  .controller('MainCtrl', function ($scope, $location, waidService,  $uibModal) {
    $scope.completeProfile = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'waid/client/complete-profile.html',
        controller: 'CompleteProfileCtrl',
        size: 'lg',
        resolve: {
          account: function () {
            return $scope.account;
          }
        }
      });
    }

    $scope.lostLogin = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'waid/client/lost-login-modal.html',
        controller: 'DefaultModalCtrl',
        size: 'lg',
        resolve: {
          account: function () {
            return $scope.account;
          }
        }
      });
    }
  }) 
  .controller('LoginCtrl', function ($scope, $location, waidService) {

    $scope.model = {
      'username':'',
      'password':''
    };

    $scope.errors = [];

    $scope.login = function() {
      waidService.userLoginPost($scope.model)
        .then(function(data){
          if(typeof data.profile_status != "undefined" && data.profile_status.indexOf('missing_profile_data') !== -1) {
            $scope.completeProfile();
          }
        },function(data){
          $scope.errors = data;
        }
      );
    }
  })
  .controller('LostLoginCtrl', function ($scope, $location, waidService) {

    $scope.model = {
      'email':'',
    };

    $scope.errors = [];

    $scope.submit = function() {
      waidService.userLostLoginPost($scope.model)
        .then(function(data){
          $scope.errors = [];
          $scope.close();
        },function(data){
          $scope.errors = data;
        }
      );
    }
  }) 
  .controller('AutoLoginCtrl', function ($scope, $location, waidService, $routeParams) {
    waidService.userAutoLoginGet($routeParams.code).then(function(data) {
      if(typeof data.profile_status != "undefined" && data.profile_status.indexOf('missing_profile_data') !== -1) {
        $scope.completeProfile(data);
      }
    });
  })  
  // .controller('ProfileLoginCtrl', function ($scope, $rootScope, $location, waidService) {
  //   $scope.currentPanel = 'login';
  // })
  .controller('ProfileInterestsCtrl', function ($scope, $rootScope, $location, waidService) {
    // $scope.currentPanel = 'interests';
    $scope.model = {};

    waidService.userProfileGet().then(function(data) {
      $scope.errors = [];
      $scope.model = data;
    }, function(data) {
      $scope.errors = data;
    });

    $scope.save = function(){
      waidService.userProfilePatch($scope.model).then(function(data) {
        $scope.errors = [];
        $location.path("/profile/overview/");
      }, function(data) {
        $scope.errors = data;
      });
    }
  })

  .controller('ProfileOverviewCtrl', function ($scope, $rootScope, $location, waidService) {
    waidService.userProfileGet().then(function(data) {
      $scope.errors = [];
      $scope.model = data;
    }, function(data) {
      $scope.errors = data;
    });

    waidService.userEmailListGet().then(function(data) {
        $scope.emails = data;
    });
  })

  .controller('ProfileMainCtrl', function ($scope, $rootScope, $location, waidService, $filter, $timeout) {
    $scope.model = {};
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
        if (data.date_of_birth) {
          var dateParts = data.date_of_birth.split('-')
          data.date_of_birth = new Date(dateParts[0],dateParts[1]-1,dateParts[2]);
        }
        $scope.model = data;
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
      $scope.model.date_of_birth = $filter('date')($scope.model.date_of_birth, 'yyyy-MM-dd');

      console.log($scope.model.avatar);

      waidService.userProfilePatch($scope.model).then(function(data) {
        $scope.errors = [];
        $location.path("/profile/overview/");
      }, function(data) {
        $scope.errors = data;
      });
    }

    $scope.updateProfileInfo();
  })
  .controller('ProfilePasswordCtrl', function ($scope, $rootScope, $location, waidService, $filter) {
    $scope.model = {};

    $scope.save = function(){
      waidService.userPasswordPut($scope.model).then(function(data) {
        $scope.errors = [];
        $location.path("/profile/overview/");
      }, function(data) {
        $scope.errors = data;
      });
    }
  })
  .controller('ProfileUsernameCtrl', function ($scope, $rootScope, $location, waidService, $filter) {
    //$scope.model = {};

    waidService.userProfileGet().then(function(data) {
      $scope.errors = [];
      $scope.model = {'username':data.username};
    }, function(data) {
      $scope.errors = data;
    });

    $scope.save = function(){
      waidService.userUsernamePut($scope.model).then(function(data) {
        $scope.errors = [];
        $location.path("/profile/overview/");
      }, function(data) {
        $scope.errors = data;
      });
    }
  })
  .controller('ProfileEmailCtrl', function ($scope, $rootScope, $location, waidService) {
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
  .controller('SocialCtrl', function ($scope, $location, waidService) {
    $scope.providers = [];
    $scope.getProviders = function() {
      waidService.socialProviderListGet().then(function(data){
        $scope.providers = data;
      });
    }
    $scope.getProviders();
  })
  .controller('LogoutCtrl', function ($scope, $location, waidService) {
    $scope.logout = function() {
      waidService.userLogoutPost();
    }
    $scope.logoutAll = function() {
      waidService.userLogoutAllPost();
    }
  })
  .controller('RegisterCtrl', function ($scope, $route, waidService, $location, $uibModal) {
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


    $scope.openTermsAndConditions = function (template) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'waid/client/terms-and-conditions.html',
        controller: 'DefaultModalCtrl',
        size: 'lg',
        resolve: {
          application: function () {
            return $scope.application;
          }
        }
      });
    };

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
              $scope.close();
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
