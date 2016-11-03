'use strict';
angular.module('waid', [
  'ngCookies',
  'waid.core',
  'waid.core.strategy',
  'waid.core.services',
  'waid.core.controllers',
  'waid.core.directives',
  'waid.idm',
  'waid.comments',
  'waid.rating',
  'monospaced.elastic',
]).run(function (waidCore, waidCoreStrategy, waidCoreAppStrategy, waidService) {
  waidCore.config.baseTemplatePath = '';
  waidCore.config.version = '0.0.12';
  waidCore.config.setConfig('api', {
    'environment': {
      'development': { 'url': 'dev.whoamid.com:8000/nl/api' },
      'test': { 'url': 'test.whoamid.com:8001/nl/api' },
      'staging': { 'url': 'test.whoamid.com:8002/nl/api' },
      'production': { 'url': 'eu.whoamid.com/nl/api' }
    }  // 'accountId' : 'efa26bbd-33dc-4148-b135-a1e9234e0fef',
       // 'applicationId' : 'c7d23002-da7d-4ad3-a665-9ae9de276c9e',
  });
  waidCore.config.setConfig('core', {
    'templates': {
      'core': '/templates/core/core.html',
      'emoticonsModal': '/templates/core/emoticons-modal.html',
      'modalWindow': '/templates/core/modal/window.html'
    },
    'errorCodes': {
      'auth-cancelled': 'Authentication was canceled by the user.',
      'auth-failed': 'Authentication failed for some reason.',
      'auth-unknown-error': 'An unknown error stoped the authentication process.',
      'auth-missing-parameter': 'A needed parameter to continue the process was missing, usually raised by the services that need some POST data like myOpenID.',
      'auth-state-missing': 'The state parameter is missing from the server response.',
      'auth-state-forbidden': 'The state parameter returned by the server is not the one sent.',
      'auth-token-error': 'Unauthorized or access token error, it was invalid, impossible to authenticate or user removed permissions to it.',
      'auth-already-associated': 'A different user has already associated the social account that the current user is trying to associate.',
      'system-error': 'System error, failed for some reason.'
    },
    'translations': {
      'emoticons_people': 'Mensen',
      'emoticons_nature': 'Natuur',
      'emoticons_objects': 'Objecten',
      'emoticons_places': 'Plaatsen',
      'terms_and_conditions': '<p><b>{{ waid.application.name }}</b> besteedt continue zorg en aandacht aan de samenstelling van de inhoud op onze sites. Op onze sites worden diverse interactiemogelijkheden aangeboden. De redactie bekijkt de berichten en reacties, die naar onze fora worden gestuurd niet vooraf - tenzij uitdrukkelijk anders aangegeven. Berichten die evident onrechtmatig zijn, worden zo spoedig mogelijk verwijderd. Het kan evenwel voorkomen dat u dergelijke berichten korte tijd aantreft. Wij distantiÃ\xABren ons nadrukkelijk van deze berichten en verontschuldigen ons er bij voorbaat voor. Het is mogelijk dat de informatie die op de sites wordt gepubliceerd onvolledig is of onjuistheden bevat. Het is niet altijd mogelijk fouten te voorkomen. {{ waid.application.name }} is niet verantwoordelijk voor meningen en boodschappen van gebruikers van (forum)pagina\'s. De meningen en boodschappen op de forumpagina\'s geven niet de mening of het beleid van {{ waid.application.name }} weer. Ditzelfde geldt voor informatie van derden waarvan u via links op onze websites kennisneemt. Wij sluiten alle aansprakelijkheid uit voor enigerlei directe of indirecte schade, van welke aard dan ook, die voortvloeit uit het gebruik van informatie die op of via onze websites is verkregen. {{ waid.application.name }} behoudt zich het recht voor - tenzij schriftelijk anders overeengekomen met de auteur - ingezonden materiaal te verwijderen in te korten en/of aan te passen. Dit geldt zowel voor tekst als muziek- en beeldmateriaal. Deze website is alleen bedoeld voor eigen raadpleging via normaal browser-bezoek. Het is derhalve niet toegestaan om de website op geautomatiseerde wijze te (laten) raadplegen, bijvoorbeeld via scripts, spiders en/of bots. Eventuele hyperlinks dienen bezoekers rechtstreeks te leiden naar de context, waarbinnen de publieke omroep content aanbiedt. Video- en audiostreams mogen bijvoorbeeld alleen worden vertoond via een link naar een omroeppagina of embedded omroepplayer. Overneming, inframing, herpublicatie, bewerking of toevoeging zijn niet toegestaan. Eveneens is het niet toegestaan technische beveiligingen te omzeilen of te verwijderen, of dit voor anderen mogelijk te maken. {{ waid.application.name }} kan besluiten (delen van ) bijdragen van gebruikers op internetsites te publiceren c.q. over te nemen in andere media, bijvoorbeeld maar niet beperkt tot televisie, radio, internetsites, mobiele informatiedragers en printmedia. Door bijdragen te leveren op fora en andere {{ waid.application.name }} vergelijkbare internetsites stemmen bezoekers op voorhand onvoorwaardelijk en eeuwigdurend in met bovengenoemd gebruik van (delen van) hun bijdragen. Wanneer rechtens komt vast te staan dat {{ waid.application.name }} daartoe gehouden is, zal {{ waid.application.name }} mogen overgaan tot het aan derde(n) verstrekken van naam, adres, woonplaats of ip-nummer van een bezoeker/gebruiker.</p>'
    }
  });

  if (window.location.port == '8080' || window.location.port == '8000') {
    var url = waidCore.config.getConfig('api.environment.development.url');
  } else if (window.location.port == '8001') {
    var url = waidCore.config.getConfig('api.environment.test.url');
  } else if (window.location.port == '8002') {
    var url = waidCore.config.getConfig('api.environment.staging.url');
  } else {
    var url = waidCore.config.getConfig('api.environment.production.url');
  }

  waidService.initialize(url);
});