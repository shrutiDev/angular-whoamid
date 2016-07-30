'use strict';

angular.module('waid.idm.controllers', ['waid.core.services'])
  .controller('WAIDIdmCtrl', function ($scope, $rootScope, $location, $window, waidService, growl, $routeParams, $log,  $uibModal) {
    // Assume user is not logged in until we hear otherwise
    $rootScope.waid = {
      'logout' : function() {
        waidService.userLogoutPost();
      },
      'logoutAll' : function() {
        waidService.userLogoutAllPost();
      },
      'openLoginAndRegisterHomeModal' : function() {
        $scope.openLoginAndRegisterHomeModal();
      },
      'openUserProfileHomeModal' : function() {
        $scope.openUserProfileHomeModal();
      },
      'openLostLoginModal' : function() {
        $scope.openLostLoginModal();
      },
      'openTermsAndConditionsModal' : function() {
        $scope.openTermsAndConditionsModal();
      },
      'user': false,
      'accountId': false,
      'applicationId': false,
    };

    var waidAlCode = $location.search().waidAlCode; 
    if (waidAlCode) {
      waidService.userAutoLoginGet(waidAlCode).then(function(data) {
        
      });
    }

    waidService.userProfileGet();


    $scope.openTermsAndConditionsModal = function (template) {
       $scope.openTermsAndConditionsModalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/idm/templates/terms-and-conditions-modal.html',
        controller: 'DefaultModalCtrl',
        size: 'lg',
        resolve: {
          application: function () {
            return $scope.application;
          }
        }
      });
    };

    $scope.closeTermsAndConditionsModal = function () {
      if ($scope.openTermsAndConditionsModalInstance) {
        $scope.openTermsAndConditionsModalInstance.dismiss('close');
      }
    }

    $scope.openCompleteProfileModal = function () {
      $scope.openCompleteProfileModalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/idm/templates/complete-profile.html',
        controller: 'WAIDCompleteProfileCtrl',
        size: 'lg'
      });
    }

    $scope.closeCompleteProfileModal = function () {
      if ($scope.openCompleteProfileModalInstance) {
        $scope.openCompleteProfileModalInstance.dismiss('close');
      }
    }

    $scope.openLostLoginModal = function () {
      $scope.closeAllModals();
      $scope.lostLoginModalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/idm/templates/lost-login-modal.html',
        controller: 'DefaultModalCtrl',
        size: 'lg'
      });
    }

    $scope.closeLostLoginModal = function() {
      if ($scope.lostLoginModalInstance) {
        $scope.lostLoginModalInstance.dismiss('close');
      }
    }

    $scope.openLoginAndRegisterHomeModal = function () {
      $scope.loginAndRegisterHomeModalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/idm/templates/login-and-register-modal.html',
        controller: 'DefaultModalCtrl',
        size: 'lg'
      });
    }

    $scope.closeLoginAndRegisterModal = function() {
       if ($scope.loginAndRegisterHomeModalInstance) {
        $scope.loginAndRegisterHomeModalInstance.dismiss('close');
      }
    }

    $scope.openUserProfileHomeModal = function () {
      $scope.userProfileHomeModalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/idm/templates/user-profile-modal.html',
        controller: 'DefaultModalCtrl',
        size: 'lg'
      });
    }

    $scope.closeUserProfileModal = function() {
      if ($scope.userProfileHomeModalInstance) {
        $scope.userProfileHomeModalInstance.dismiss('close');
      }
    }
  
    $scope.closeAllModals = function(){
      $scope.closeUserProfileModal();
      $scope.closeLoginAndRegisterModal();
      $scope.closeLostLoginModal();
      $scope.closeTermsAndConditionsModal();
    }

    $rootScope.authenticated = false;

    $rootScope.$on('waid.services.authenticate.ok', function(event, data) {
      $rootScope.authenticated = true;
    });

    $scope.loginCheck = function(data) {
      
      if (typeof data.profile_status != "undefined" && data.profile_status.length > 0) {
        if(data.profile_status.indexOf('profile_ok') !== -1) {
           growl.addSuccessMessage("Succesvol ingelogd.");
           $scope.closeAllModals();
        }

        if(typeof data.profile_status != "undefined" && data.profile_status.indexOf('missing_profile_data') !== -1) {
          $scope.closeAllModals();
          $scope.openCompleteProfileModal();
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
      $rootScope.authenticated = false;
      $scope.waid.user = false;
      $scope.closeAllModals();
    });

    $rootScope.$on('waid.services.application.userLogoutAll.post.ok', function(event, data) {
      $rootScope.authenticated = false;
      $scope.waid.user = false;
      $scope.closeAllModals();
    });

    $scope.$on('waid.services.application.userProfile.get.ok', function(event, data) {
      $scope.waid.user = data;
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
          console.log('Do....');
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
      $scope.closeAllModals();
    });
    $scope.$on('waid.services.application.userRegister.post.ok', function(event, data) {
      growl.addSuccessMessage("Geregistreerd als nieuwe gebruiker! Controleer je mail om de account te verifieren.",  {ttl: -1});
      $scope.isRegister = true;
    });

  })
  .controller('ClientSocialError', function ($scope, $rootScope, growl, $routeParams, $location) {
    growl.addErrorMessage(config.errorCodes[$routeParams.error]);
  }) 

  .controller('DefaultModalCtrl', function ($scope, $location, waidService,  $uibModalInstance) {
    $scope.close = function () {
      $uibModalInstance.dismiss('close');
    };
  })
  .controller('WAIDPageCtrl', function($scope, waidService, $routeParams) {
    // console.log($routeParams.page);
  })
  
  .controller('WAIDUserProfileHomeCtrl', function($scope, waidService, $routeParams) {
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
  .controller('WAIDCommentsCtrl', function($scope, waidService, $q) {
    $scope.ordering =  angular.isDefined($scope.ordering) ? $scope.ordering : '-created';
    $scope.orderingEnabled =  angular.isDefined($scope.orderingEnabled) && $scope.orderingEnabled == 'false' ? false : true;
    $scope.threadId =  angular.isDefined($scope.threadId) ? $scope.threadId : 'currenturl';

    $scope.comment = {
      'comment':''
    }

    $scope.orderCommentList = function(ordering) {
      $scope.ordering = ordering;
      $scope.loadComments();
    }

    $scope.voteComment = function(comment, vote){
      if (!$scope.waid.user) {
        $scope.waid.openLoginAndRegisterHomeModal();
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
            if (data[i].user.id == $scope.waid.user.id) {
              data[i].is_owner = true;
            }
          }
          $scope.comments = data
        },function(data){
          alert('Cannot retrieve comments.');
        }
      );
    }

    $scope.post = function(){
      waidService.userCommentsPost($scope.comment).then(function(data){
        console.log(data);
        $scope.comment.comment = '';
        $scope.loadComments();
      })
    }

    $scope.loadComments();

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
  .controller('WAIDSocialCtrl', function ($scope, $location, waidService) {
    $scope.providers = [];
    $scope.getProviders = function() {
      waidService.socialProviderListGet().then(function(data){
        $scope.providers = data;
      });
    }
    $scope.getProviders();
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
