angular.module('waid.rating', [
  'waid.core',
  'waid.idm',
  'waid.rating.controllers',
  'waid.rating.directives'
]).run(function (waidCore, waidCoreStrategy, waidCoreAppStrategy, waidService) {
  waidCore.config.setConfig('rating', {
    'templates': { 'ratingWidget': '/templates/rating/widget.html' },
    'translations': {}
  });
});