'use strict';
angular.module('waid.comments.controllers', [
  'waid.core',
  'waid.core.strategy',
  'waid.core.app.strategy'
]).controller('WAIDCommentsCtrl', function ($scope, $rootScope, waidService, $q, waidCoreStrategy, waidCoreAppStrategy) {
  $scope.ordering = angular.isDefined($scope.ordering) ? $scope.ordering : '-created';
  $scope.orderingEnabled = angular.isDefined($scope.orderingEnabled) && $scope.orderingEnabled == 'false' ? false : true;
  $scope.objectId = angular.isDefined($scope.objectId) ? $scope.objectId : 'currenturl';
  $scope.waid = $rootScope.waid;
  $scope.comment = { 'comment': '' };
  $scope.orderCommentList = function (ordering) {
    $scope.ordering = ordering;
    $scope.loadComments();
  };
  $scope.voteComment = function (comment, vote) {
    if (!$rootScope.waid.user) {
      $rootScope.waid.openLoginAndRegisterHomeModal();
    } else {
      waidService.commentsVotePost(comment.id, vote).then(function (data) {
        comment.vote_up_count = data.vote_up_count;
        comment.vote_down_count = data.vote_down_count;
        comment.vote_count = data.vote_count;
      });
    }
  };
  $scope.markComment = function (comment, mark) {
    waidService.commentsMarkPost(comment.id, mark).then(function (data) {
      comment.marked_as_spam = data.marked_as_spam;
    });
  };
  $scope.editComment = function (comment) {
    if (comment.is_locked) {
      return false;
    }
    comment.is_edit = true;
  };
  $scope.updateComment = function (comment) {
    var patch_comment = { 'comment': comment.comment_formatted };
    waidService.userCommentsPatch(comment.id, patch_comment).then(function (data) {
      comment.is_edit = false;
      comment.comment_formatted = data.comment_formatted;
      comment.comment = data.comment;
    });
  };
  $scope.deleteComment = function (comment) {
    waidService.userCommentsDelete(comment.id).then(function (data) {
      var index = $scope.comments.indexOf(comment);
      $scope.comments.splice(index, 1);
    });
  };
  $scope.loadComments = function () {
    waidService.commentsListGet({
      'object_id': $scope.objectId,
      'ordering': $scope.ordering
    }).then(function (data) {
      for (var i = 0; i < data.length; i++) {
        data[i].is_edit = false;
        if (data[i].user.id == $rootScope.waid.user.id) {
          data[i].is_owner = true;
        }
      }
      $scope.comments = data;
    });
  };
  $scope.post = function () {
    $scope.comment.object_id = $scope.objectId;
    waidService.userCommentsPost($scope.comment).then(function (data) {
      $scope.comment.comment = '';
      $scope.loadComments();
    });
  };
  $scope.$watch('objectId', function (objectId) {
    if (objectId != '') {
      $scope.loadComments();
    }
  });
});