'use strict';

angular.module('waid.admin.controllers', ['waid'])
  .controller('WAIDAdminCtrl', function ($scope, $rootScope, waidCore, waidCoreStrategy, waidService, growl, $location, $uibModal, $cookies, $location, $window) {
    $scope.account = '';

    $scope.changeAccount = function() {
      $scope.account = '';
      $scope.waid.clearAccount();
    }

    $scope.goToAccount = function(){
      if($scope.account.length > 0) {
        waidService.publicAccountGet($scope.account).then(function(data){
          //$window.location.href = '/admin/' + data.slug + '/';
          var application = data.main_application;
          delete data.main_application

          $scope.waid.account = data;
          $scope.waid.application = application;

          $cookies.putObject('account', $scope.waid.account);
          $cookies.putObject('application', $scope.waid.application);
        }, function(data){
          growl.addErrorMessage("Geen geldige account.");
          $cookies.remove('account');
          $cookies.remove('application');
        });
      }
    }

    $scope.createAccount = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/admin/templates/create-account-modal.html',
        controller: 'WAIDCreateAccountCtrl',
        size: 'lg',
        resolve: {
          account: function () {
            return $scope.account;
          }
        }
      });
    };
    
    $scope.$on('waid.services.admin.account.get.error', function(event, data) {
      growl.addErrorMessage("Geen permissie om in deze admin in te loggen.");
      $scope.waid.clearUser();
      $location.path('/');
      // TODO : Fix this buggy refresh
      $window.location.href = '/';
    });

    $scope.$on('waid.services.application.userLogout.post.ok', function(event, data) {
      $location.path('/');
    });

    $scope.$on('waid.services.application.userLogoutAll.post.ok', function(event, data) {
      $location.path('/');
    });

    $scope.$on('waid.services.admin.application.patch.ok', function(event, data) {
      growl.addSuccessMessage("Applicatie gegevens zijn opgeslagen.");
    });

    $scope.$on('waid.services.admin.account.patch.ok', function(event, data) {
      growl.addSuccessMessage("Account gegevens zijn opgeslagen.");
    });

    $scope.adminAccountChecked = false;
    
    $scope.$watch('waid', function(waid){
      if ($scope.adminAccountChecked == false && typeof waid != "undefined" && waid.account && waid.user) {
         waidService.adminAccountGet();
         $scope.adminAccountChecked = true;
      }

      if (typeof waid != "undefined" && $scope.waid.user && $scope.waid.account) {
        $scope.account = $scope.waid.account.slug;
      }

      if (typeof waid != "undefined" && waid.user){
        if($location.path() != '/page/overview/') {
          $location.path('/page/overview/');
        }
      } else {
        if($location.path() != '/') {
          $location.path('/');
        }
      }
    }, true);


    
  })
  .controller('WAIDCreateAccountCtrl', function ($scope, $uibModalInstance, Slug, waidService, account) {
      $scope.errors = [];
      $scope.registrationDone = false;
      $scope.model = {
          'name':account
      };
      $scope.showRegisterButton = true;
      
      $scope.$watch('model.name', function(){
        $scope.model.slug = Slug.slugify($scope.model.name);
      });

      $scope.slugify = function(){
          $scope.model.slug = Slug.slugify($scope.model.slug);
      }

      $scope.ok = function () {
        waidService.publicAccountCreatePost($scope.model).then(function(data){
            $scope.errors = [];
            $scope.registrationDone = true;
            $scope.showRegisterButton = false;
        }, function(data){
            $scope.errors = data;
        });
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
  })
  .controller('ErrorCodesCtrl', function ($scope, $rootScope, $location, waidService) {
    $scope.errorCodes = config.errorCodes;
  })
  .controller('AdminPageCtrl', function ($scope, $rootScope, $location, waidService) {
    $scope.applications = [];
  })
  .controller('AdminApplicationOverviewCtrl', function ($scope, $rootScope, $location, waidService) {
    $scope.applications = [];

    $scope.getApplicationList = function(){
      waidService.adminApplicationListGet().then(function(data){
        $scope.applications = data
      })
    };

    $scope.getApplicationList();
    
  })
  .controller('AdminApplicationMenuCtrl', function ($scope, $rootScope, $routeParams, waidService) {
    // Load main application object
    waidService.adminApplicationGet($routeParams.applicationId).then(function(data) {
      $rootScope.application = data;
    });
  })
  .controller('ApplicationDetailMainCtrl', function ($scope, $rootScope, $routeParams, waidService) {
    $scope.save = function() {
      waidService.adminApplicationPatch($scope.application).then(function(data){
        $rootScope.application = data;
        $scope.errors = [];
      }, function(data){
        $scope.errors = data;
      });
    }
  })
  .controller('AdminApplicationDetailOverviewCtrl', function ($scope, $rootScope, $routeParams, waidService) {
    $scope.hasSocialSettings = false;
    $rootScope.$watch('application', function(){
      if ($rootScope.application) {
        angular.forEach($rootScope.application, function(value, key) {
          if (key.lastIndexOf('social_auth', 0) === 0) {
            if (typeof value !== 'undefined' && value) {
              $scope.hasSocialSettings = true;
            }
          }
        });
      }
    });
  })
  .controller('AdminApplicationDetailSocialLoginCtrl', function ($scope, $rootScope, $routeParams, waidService) {
    $scope.save = function() {
      waidService.adminApplicationPatch($scope.application).then(function(data){
        $rootScope.application = data;
        $scope.errors = [];
      }, function(data){
        $scope.errors = data;
      });
    }
  })
  .controller('AdminApplicationDetailMailTemplatesCtrl', function ($scope, $rootScope, $routeParams, waidService) {
    $scope.save = function() {
      waidService.adminApplicationPatch($scope.application).then(function(data){
        $rootScope.application = data;
        $scope.errors = [];
      }, function(data){
        $scope.errors = data;
      });
    }
  })
  .controller('AdminDashboardCtrl', function ($scope, $rootScope, $location, waidService) {
    $rootScope.currentMenu = 'dashboard';

  })
  .controller('AccountOverviewCtrl', function ($scope, $rootScope, $location, waidService) {
    $scope.model = {};
    waidService.adminAccountGet().then(function(data){
      $scope.model = data;
    });
  })
  .controller('AccountMainCtrl', function ($scope, $rootScope, $location, waidService, $window) {
    $scope.model = {};

    waidService.adminAccountGet().then(function(data){
      $scope.model = data;
    });
    
    $scope.save = function(){
      waidService.adminAccountPatch($scope.model).then(function(data){
        $scope.errors = [];
        $scope.model = data;
        $location.path("/account/overview/");
      }, function(data){
        $scope.errors = data;
      });
    }
  });
