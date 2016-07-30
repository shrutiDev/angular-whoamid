'use strict';

angular.module('waid.admin.controllers', ['waid.core.services',])
  .controller('WAIDAdminCtrl', function ($scope, waidService, growl, $location, $uibModal) {
    $scope.account = '';
    $scope.goToAccount = function(){
      if($scope.account.length > 0) {
        waidService.publicAccountGet($scope.account).then(function(data){
          //$window.location.href = '/admin/' + data.slug + '/';
          $scope.waid.accountId = data.id;
          $scope.waid.applicationId = data.main_application_id;

          waidService.accountId = $scope.waid.accountId;
          waidService.applicationId = $scope.waid.applicationId 
        }, function(data){
          growl.addErrorMessage("Geen geldige account.");
        });
      }
    }

    $scope.createAccount = function () {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'waid/public/account/create.html',
        controller: 'WAIDCreateAccountCtrl',
        size: 'lg',
        resolve: {
          account: function () {
            return $scope.account;
          }
        }
      });
    };


    $scope.$on('waid.services.admin.application.patch.ok', function(event, data) {
      growl.addSuccessMessage("Applicatie gegevens zijn opgeslagen.");
    });

    $scope.$on('waid.services.admin.account.patch.ok', function(event, data) {
      growl.addSuccessMessage("Account gegevens zijn opgeslagen.");
    });

    $scope.$watch('waid', function(waid){
      if (waid.user){
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
