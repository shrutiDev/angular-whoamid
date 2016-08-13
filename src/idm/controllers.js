'use strict';

angular.module('waid.idm.controllers', ['waid.core',])

  .controller('ClientSocialError', function ($scope, $rootScope, growl, $routeParams, $location) {
    growl.addErrorMessage(config.errorCodes[$routeParams.error]);
  }) 
  
  .controller('WAIDIdmUserProfileHomeCtrl', function($scope, waidService, $routeParams) {
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
  })
  .controller('WAIDCompleteProfileCtrl', function ($scope, $location, $window, waidService, $uibModalInstance) {
    $scope.mode = 'complete';
    $scope.close = function () {
      $uibModalInstance.dismiss('close');
    };
  }) 
  .controller('WAIDLoginCtrl', function ($scope, $location, waidService) {

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
  .controller('WAIDLostLoginCtrl', function ($scope, $location, waidService) {

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
  .controller('WAIDUserProfileInterestsCtrl', function ($scope, $rootScope, $location, waidService) {
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
      }, function(data) {
        $scope.errors = data;
      });
    }
  })

  .controller('WAIDUserProfileOverviewCtrl', function ($scope, $rootScope, $location, waidService) {
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

  .controller('WAIDUserProfileMainCtrl', function ($scope, $rootScope, $location, waidService, $filter, $timeout) {
    $scope.model = {};
    $scope.errors = [];
    
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
      waidService.userProfilePatch($scope.model).then(function(data) {
        var dateParts = data.date_of_birth.split('-')
        data.date_of_birth = new Date(dateParts[0],dateParts[1]-1,dateParts[2]);
        $scope.model = data;
        $scope.errors = [];
      }, function(data) {
        $scope.errors = data;
      });
    }
    $scope.updateProfileInfo();
  })
  .controller('WAIDUserProfilePasswordCtrl', function ($scope, $rootScope, $location, waidService, $filter) {
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
  .controller('WAIDUserProfileUsernameCtrl', function ($scope, $rootScope, $location, waidService, $filter) {
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
      }, function(data) {
        $scope.errors = data;
      });
    }
  })
  .controller('WAIDUserProfileEmailCtrl', function ($scope, $rootScope, $location, waidService) {
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
  .controller('WAIDSocialCtrl', function ($scope, $location, waidService, $window) {
    $scope.providers = [];
    $scope.getProviders = function() {
      waidService.socialProviderListGet().then(function(data){
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
  .controller('WAIDRegisterCtrl', function ($scope, $route, waidService, $location, $uibModal) {
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
