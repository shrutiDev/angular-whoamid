'use strict';
angular.module('waid.comments.controllers', [
  'waid.core',
  'waid.core.strategy',
  'waid.core.app.strategy'
]).controller('WAIDCommentsCtrl', function ($scope, $rootScope, waidService, $q, waidCore, waidCoreStrategy, waidCoreAppStrategy) {
  $scope.ordering = angular.isDefined($scope.ordering) ? $scope.ordering : '-created';
  $scope.orderingEnabled = angular.isDefined($scope.orderingEnabled) && $scope.orderingEnabled == 'false' ? false : true;
  $scope.objectId = angular.isDefined($scope.objectId) ? $scope.objectId : 'currenturl';
  $scope.waid = $rootScope.waid;
  $scope.comment = { 'comment': '' };
  $scope.limit = 10;
  $scope.offset = 0;
  $scope.showMore = false;

  $scope.orderCommentList = function (ordering) {
    $scope.ordering = ordering;
    $scope.loadComments();
  };
  $scope.voteComment = function (comment, vote) {
    if (!$rootScope.waid.user) {
      $rootScope.waid.openLoginAndRegisterHomeModal();
    } else {
      waidService.commentVotePost(comment.id, vote).then(function (data) {
        comment.vote_up_count = data.vote_up_count;
        comment.vote_down_count = data.vote_down_count;
        comment.vote_count = data.vote_count;
      });
    }
  };
  $scope.markComment = function (comment, mark) {
    waidService.commentMarkPost(comment.id, mark).then(function (data) {
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
    waidService.userCommentPatch(comment.id, patch_comment).then(function (data) {
      comment.is_edit = false;
      comment.comment_formatted = data.comment_formatted;
      comment.comment = data.comment;
    });
  };
  $scope.deleteComment = function (comment) {
    waidService.userCommentDelete(comment.id).then(function (data) {
      var index = $scope.comments.indexOf(comment);
      $scope.comments.splice(index, 1);
    });
  };
  $scope.loadComments = function (append) {
    var params = {
      'object_id': $scope.objectId,
      'ordering': $scope.ordering
    }
    if (typeof append == 'undefined') {
      var append = false;
      $scope.offset = 0;
    } else {
      var append = true;
    }
    params['limit'] = $scope.limit;

    if (append) {
      $scope.offset = $scope.offset + $scope.limit;
      params['offset'] = $scope.offset;
    }

    waidService.commentListGet(params).then(function (data) {
      if (data.results.length == 0 || data.results.length < $scope.limit) {
        $scope.showMore = false;
      } else {
        $scope.showMore = true;
      }

      if (data.results.length > 0) {
        // Format comment data
        for (var i = 0; i < data.results.length; i++) {
          data.results[i].is_edit = false;
          if (data.results[i].user.id == $rootScope.waid.user.id) {
            data.results[i].is_owner = true;
          }
        }

        // Check if we need to append comments
        if (append) {
          for (var i = 0; data.results.length > i; i++) {
            $scope.comments.push(data.results[i]);
          }
        } else {
          $scope.comments = data.results;
        }
      }
    });
  };
  $scope.post = function () {
    $scope.comment.object_id = $scope.objectId;
    if (!$rootScope.waid.user) {
      waidCore.setLastAction('comment_post', $scope.comment);
      $rootScope.waid.openLoginAndRegisterHomeModal();
      $scope.comment.comment = '';
    } else {
      waidService.userCommentPost($scope.comment).then(function (data) {
        $scope.comment.comment = '';
        $scope.loadComments();
      });
    }
  };
  $scope.addEmoji = function (targetId, comment) {
    if (comment.id) {
      var commentText = comment.comment_formatted;
    } else {
      var commentText = comment.comment;
    }
    waidCore.openEmoticonsModal(targetId, commentText).then(function (data) {
      if (comment.id) {
        for (var i = 0; i < $scope.comments.length; i++) {
          if ($scope.comments[i].id = comment.id) {
            $scope.comments[i].comment = data;
            $scope.comments[i].comment_formatted = data;
          }
        }
      } else {
        $scope.comment.comment = data;
      }
    });
  };

  $scope.$on('waid.core.lastAction.commentPost', function(data) {
    $scope.loadComments();
  });
});