'use strict';

angular.module('waid.demo.controllers', ['waid.core.services',])
  .controller('WAIDDemoCtrl', function ($scope, waidService) {


    $scope.$watch('waid', function(waid){
      if (typeof waid != "undefined" && waid.account && waid.application) {
      	waidService.articlesListGet().then(function(data){
      		$scope.articles = data;
      	})
      }
    });
  })
  .controller('WAIDArticleCtrl', function ($scope, waidService, $location, $routeParams) {
    $scope.$watch('waid', function(waid){
      if (typeof waid != "undefined" && waid.account && waid.application) {
      	waidService.articlesGet($routeParams.id).then(function(data){
      		$scope.article = data;
      	})
      }
    });
  });
