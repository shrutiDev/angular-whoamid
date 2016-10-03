'use strict';
angular.module('waid.rating.controllers', [
  'waid.core',
  'waid.core.strategy',
  'waid.core.app.strategy'
]).controller('WAIDRatingCtrl', function ($scope, $rootScope, waidService, waidCoreStrategy, waidCoreAppStrategy) {
  $scope.objectId = angular.isDefined($scope.objectId) ? $scope.objectId : 'currenturl';

  $scope.stars = [
    {'active':false, 'value':1},
    {'active':false, 'value':2},
    {'active':false, 'value':3},
    {'active':false, 'value':4},
    {'active':false, 'value':5}
  ];
  $scope.rate = function (value) {
    for (var i=0; $scope.stars.length > i; i++){
      if (i < value) {
        $scope.stars[i].active = true;
      } else {
        $scope.stars[i].active = false;
      }
    }
    // console.log($scope.objectId);
    // console.log(value);
  };


  $scope.$watch('waid.isInit', function(isInit){
    if (typeof isInit != "undefined" && isInit) {
      // waidService.ratingGet($routeParams.id).then(function(data){
      //   $scope.rating = data;
      // })
      $scope.rating = {
        'average':{
          'value':1
        },
        'detail':[
          {
            'value':1,
            'count':200,
            'percentage':20
          },
          {
            'value':2,
            'count':200,
            'percentage':20
          },
          {
            'value':3,
            'count':200,
            'percentage':20
          },
          {
            'value':4,
            'count':200,
            'percentage':20
          },
          {
            'value':5,
            'count':200,
            'percentage':20
          }
        ]
      }
    }
  });

});