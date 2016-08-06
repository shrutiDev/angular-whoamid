'use strict';

angular.module('waid.admin.controllers', ['waid'])
  .controller('WAIDAdminCtrl', function ($scope, $rootScope, waidService, growl, $location, $uibModal, $cookies, $location, $window) {
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
      // TODO : Fix this buggy refresh
      $window.location.href = '/'
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

    $scope.$on('waid.services.application.userAutoLogin.get.ok', function(event, data) {
      // Validate access to account
      waidService.adminAccountGet();
    });
    $rootScope.$on('waid.services.application.userLogin.post.ok', function(event, data) {
      // Validate access to account
      waidService.adminAccountGet();
    });

    $scope.$watch('waid', function(waid){
      if (typeof waid != "undefined" && $scope.account == '' && $scope.waid.account) {
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
  .controller('AdminAgeGraphCtrl', function ($scope, $rootScope, $location, waidService) {
    $scope.labels = ["0-10", "11-20", "21-30", "30-40", "50-60", "60-70", "70-80"];
    $scope.data = [10, 500, 600, 50 ,20, 15, 10];
  })
  .controller('AdminRegistrationGraphCtrl', function ($scope, $rootScope, $location, waidService) {
    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['2014', '2015', '2016'];
    $scope.data = [
      [10, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90],
      [90, 80, 20, 34, 30, 44, 99]
    ];
  })
  .controller('AdminLoginGraphCtrl', function ($scope, $rootScope, $location, waidService) {
    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['2014', '2015', '2016'];
    $scope.data = [
      [200, 80, 600, 500, 144, 210, 99],
      [102, 20, 300, 400, 133, 220, 90],
      [300, 200, 200, 150, 180, 230, 40]
    ];
  })
  .controller('AdminGenderGraphCtrl', function ($scope, $rootScope, $location, waidService) {
    $scope.labels = ["Man", "Vrouw", "Onbekend"];
    $scope.data = [300, 500, 100];
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
