'use strict';

angular.module('waid.demo.controllers', ['waid.core.services',])
  .controller('WAIDDemoCtrl', function ($scope, waidService) {
    $scope.switchTheme = function(theme) {
      $('link').prop('disabled', true);
      $('#theme-' + theme).prop('disabled', false);
    };

    $scope.$watch('waid.isInit', function(isInit){
      if (typeof isInit != "undefined" && isInit) {
        console.log('WAIDDemoCtrl isInit');
      	waidService.articlesListGet().then(function(data){
      		$scope.articles = data;
      	})
      }
    }, true);
  })
  .controller('WAIDArticleCtrl', function ($scope, waidService, $location, $routeParams) {
    $scope.$watch('waid.isInit', function(isInit){
      if (typeof isInit != "undefined" && isInit) {
      	waidService.articlesGet($routeParams.id).then(function(data){
      		$scope.article = data;
      	})
      }
    });
  });
