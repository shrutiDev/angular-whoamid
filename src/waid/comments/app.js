angular.module('waid.comments', [
  'waid.core',
  'waid.idm',
  'waid.comments.controllers',
  'waid.comments.directives'
]).run(function (waidCore, waidCoreStrategy, waidCoreAppStrategy, waidService) {
  waidCore.config.setConfig('comments', {
    'templates': {
      'commentsHome': '/templates/comments/comments-home.html',
      'commentsOrderButton': '/templates/comments/comments-order-button.html'
    },
    'translations': {
      'title': 'Comments',
      'notLoggedInText': 'Om comments te plaatsen dien je een account te hebben, login of registreer je snel!',
      'postCommentButton': 'Plaats comment',
      'actionDropdownTitle': 'Opties',
      'editCommentTitle': 'Aanpassen',
      'markCommentSpamTitle': 'Markeer als spam',
      'commentMarkedAsSpam': 'Gemarkeerd als spam!',
      'deleteCommentTitle': 'Verwijderen',
      'confirmDeleteContentBody': 'Weet u zeker dat je de comment wilt verwijderen?',
      'confirmDeleteContentTitle': 'Comment verwijderen?',
      'updateCommentButton': 'Aanpassen',
      'voteOrderNewestFirst': 'Nieuwste eerst',
      'voteOrderOldestFirst': 'Oudste eerst',
      'voteOrderTopFirst': 'Top comments',
      'addEmoticonButtonText': 'Emoji toevoegen',
      'isLockedTitle': 'Comment is gelocked'
    }
  });
});