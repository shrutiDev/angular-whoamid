'use strict';

angular.module('waid.demo.controllers', ['waid.core.services',])
  .controller('WAIDDemoCtrl', function ($scope, waidService) {

  	waidService.articlesListGet().then(function(data){
  		$scope.articles = data;
  	})
  })
  .controller('WAIDArticleCtrl', function ($scope, waidService, $location, $routeParams) {
  	waidService.articlesGet($routeParams.id).then(function(data){
  		$scope.article = data;
  	})
  });
