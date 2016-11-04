'use strict';
angular.module('waid.rating.controllers', [
  'waid.core',
  'waid.core.strategy',
  'waid.core.app.strategy'
]).controller('WAIDRatingCtrl', function ($scope, $rootScope, waidCore, waidService, waidCoreStrategy, waidCoreAppStrategy) {
  $scope.objectId = angular.isDefined($scope.objectId) ? $scope.objectId : 'currenturl';
  // Fixed for now..
  $scope.stars = [
    {
      'active': false,
      'value': 1
    },
    {
      'active': false,
      'value': 2
    },
    {
      'active': false,
      'value': 3
    },
    {
      'active': false,
      'value': 4
    },
    {
      'active': false,
      'value': 5
    }
  ];
  $scope.rating = {
    'average': 0,
    'total_votes': 0,
    'rating': []
  };
  $scope.rate = function (value) {
    var data = {
      'object_id': $scope.objectId,
      'value': value
    };
    if (!$rootScope.waid.user) {
      waidCore.setLastAction('rating_post', data);
      $rootScope.waid.openLoginAndRegisterHomeModal();
    } else {
      waidService.ratingPost(data).then(function (data) {
        $scope.rating = data;
        $scope.rateOut();
      });
    }
  };
  $scope.rateOver = function (value) {
    for (var i = 0; $scope.stars.length > i; i++) {
      if (i < value) {
        $scope.stars[i].active = true;
      } else {
        $scope.stars[i].active = false;
      }
    }
  };
  // Rateout initialises the rating based on the current rating object
  $scope.rateOut = function () {
    var average_rounded = Math.round($scope.rating.average);
    for (var i = 0; $scope.stars.length > i; i++) {
      if (i < average_rounded) {
        $scope.stars[i].active = true;
      } else {
        $scope.stars[i].active = false;
      }
    }
  };
  
  $scope.loadRating = function() {
    waidService.ratingGet($scope.objectId).then(function (data) {
      $scope.rating = data;
      // Init rating on view
      $scope.rateOut();
    });
  };
  
  $scope.$on('waid.core.lastAction.ratingPost', function(data) {
    $scope.loadRating();
  });

  $scope.$watch('objectId', function (objectId) {
    if (objectId != '') {
      $scope.loadRating();
    }
  });
});