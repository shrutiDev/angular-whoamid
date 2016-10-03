'use strict';

angular.module('app', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'waid',
  'waid.rating',
  'waid.comments',
  'waid.demo.controllers',
  'monospaced.elastic',
  'iso.directives',
  'angular-confirm'
])
.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider, waidService) {
  $routeProvider
    .when('/article/:id/', {
      templateUrl: '/demo/templates/article-view.html',
      controller: 'WAIDArticleCtrl'
    })
    .when('/', {
      templateUrl: '/demo/templates/home.html'
    })
    .otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
}]).run(function (waidCore) {
  waidCore.config.setConfig('app', {
    'templates': {
      'core': '/core/bootstrap3/templates/core.html',
      'emoticonsModal': '/core/bootstrap3/templates/emoticons-modal.html',
      'modalWindow' : '/core/bootstrap3/templates/modal/window.html'
    },
    'translations': {
      'emoticons_people': 'Mensen',
      'emoticons_nature': 'Natuur',
      'emoticons_objects': 'Objecten',
      'emoticons_places': 'Plaatsen'
    }
  });
});
