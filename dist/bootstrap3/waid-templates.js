angular.module('waid.templates',[]).run(['$templateCache', function($templateCache) { 
  'use strict';

  $templateCache.put('/templates/comments/comment-item.html?v=0.0.49',
    "\n" +
    "<div class=\"media-left\">\n" +
    "  <img class=\"media-object\" ng-src=\"{{ comment.user.avatar_thumb_50_50 }}\" alt=\"{{ comment.user.default_name }}\">\n" +
    "</div>\n" +
    "<div class=\"media-body\" style=\"overflow: visible;\">\n" +
    "  <h4 class=\"media-heading\">{{ comment.user.default_name }}<br />\n" +
    "    <small>{{ comment.created | date:'medium' }}</small>\n" +
    "    <div class=\"btn-group pull-right\" ng-show=\"waid.user\" ng-hide=\"comment.is_locked\">\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-xs dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "        {{ ::waid.config.getConfig('comments.translations.actionDropdownTitle') }} <span class=\"caret\"></span>\n" +
    "      </button>\n" +
    "      <ul class=\"dropdown-menu\">\n" +
    "        <li><a ng-click=\"editComment(comment)\" ng-show=\"comment.is_owner\">\n" +
    "          <span class=\"glyphicon glyphicon-edit\" aria-hidden=\"true\"></span> {{ ::waid.config.getConfig('comments.translations.editCommentTitle') }}</a>\n" +
    "        </li>\n" +
    "        <li ng-show=\"!comment.marked_as_spam\"><a ng-click=\"markComment(comment, 'SPAM')\">\n" +
    "          <span class=\"glyphicon glyphicon-exclamation-sign aria-hidden=\"true\"></span> {{ ::waid.config.getConfig('comments.translations.markCommentSpamTitle') }}</a>\n" +
    "        </li>\n" +
    "        <li role=\"separator\" class=\"divider\" ng-show=\"comment.is_owner\"></li>\n" +
    "        <li><a ng-click=\"deleteComment(comment)\" ng-show=\"comment.is_owner\" confirm=\"{{ waid.config.getConfig('comments.translations.confirmDeleteContentBody') }}\" confirm-title=\"{{ waid.config.getConfig('comments.translations.confirmDeleteContentTitle') }}\">\n" +
    "          <span class=\"glyphicon glyphicon-remove-sign\" aria-hidden=\"true\"></span> {{ ::waid.config.getConfig('comments.translations.deleteCommentTitle') }}</a>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "    </div>\n" +
    "  </h4>\n" +
    "  <div ng-hide=\"comment.is_edit\">\n" +
    "    <p style=\"white-space: pre-wrap;\">{{ comment.comment_formatted }}</p>\n" +
    "    <div class=\"btn-group\" role=\"group\" aria-label=\"...\">\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-xs\" ng-click=\"voteComment(comment, 'UP')\">\n" +
    "        <span class=\"glyphicon glyphicon-chevron-up\" aria-hidden=\"true\" ></span> {{ comment.vote_up_count }}\n" +
    "      </button>\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-xs\" ng-click=\"voteComment(comment, 'DOWN')\">\n" +
    "        <span class=\"glyphicon glyphicon-chevron-down\" aria-hidden=\"true\"></span> {{ comment.vote_down_count }}\n" +
    "      </button>\n" +
    "    </div>\n" +
    "\n" +
    "    <small class=\"pull-right\" ng-show=\"comment.marked_as_spam\">\n" +
    "      <span class=\"glyphicon glyphicon-exclamation-sign aria-hidden=\"true\"></span> {{ ::waid.config.getConfig('comments.translations.commentMarkedAsSpam') }}\n" +
    "    </small>\n" +
    "  </div>\n" +
    "  <div ng-show=\"comment.is_edit\">\n" +
    "    <textarea class=\"form-control\" rows=\"1\" msd-elastic id=\"edit_comment_{{ comment.id }}\"ng-model=\"comment.comment_formatted\"></textarea>\n" +
    "    <p style=\"margin-top:10px;\">\n" +
    "    <button type=\"button\" class=\"btn btn-default btn-xs pull-right\" ng-click=\"updateComment(comment)\">\n" +
    "      <span class=\"glyphicon glyphicon-check\" aria-hidden=\"true\"></span> {{ ::waid.config.getConfig('comments.translations.updateCommentButton') }}\n" +
    "    </button>\n" +
    "    <button type=\"button\" class=\"btn btn-default btn-xs pull-left\" ng-click=\"addEmoji('edit_comment_' + comment.id, comment)\">\n" +
    "        😄&nbsp;{{ ::waid.config.getConfig('comments.translations.addEmoticonButtonText') }}\n" +
    "    </button>\n" +
    "    </p>\n" +
    "  </div>\n" +
    "  <div class=\"media\" ng-repeat=\"child in comment.children\" style=\"overflow: visible;\" ng-show=\"comment.children\">\n" +
    "    <waid-comments-item comment=\"child\" mark-comment=\"markComment\" edit-comment=\"editComment\" delete-comment=\"deleteComment\" vote-comment=\"voteComment\" update-comment=\"updateComment\" add-emoji=\"addEmoji\" waid=\"waid\"></waid-comments-item>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/templates/comments/comments-home.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    "  <div class=\"comment\"> \n" +
    "    <div class=\"media\">\n" +
    "      <div class=\"media-left\" ng-show=\"waid.user\">\n" +
    "        <img class=\"media-object\" ng-src=\"{{ waid.user.avatar_thumb_50_50 }}\" alt=\"{{ waid.user.default_name }}\">\n" +
    "      </div>\n" +
    "      <div class=\"media-body\">\n" +
    "        <textarea class=\"form-control\" rows=\"3\" ng-model=\"comment.comment\" id=\"add_comment\" msd-elastic></textarea><br />\n" +
    "        <button type=\"button\" class=\"btn btn-default btn-xs pull-right\" ng-click=\"post()\" ng-disabled=\"comment.comment.length == 0\">\n" +
    "            <span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span> {{ ::waid.config.getConfig('comments.translations.postCommentButton') }}\n" +
    "        </button>\n" +
    "        <button type=\"button\" class=\"btn btn-default btn-xs pull-left\" ng-click=\"addEmoji('add_comment', comment)\">\n" +
    "            😄&nbsp;{{ ::waid.config.getConfig('comments.translations.addEmoticonButtonText') }}\n" +
    "        </button> \n" +
    "        {{ currentEmoticonComment }}\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    \n" +
    "    <br />\n" +
    "    <waid-comments-order-button ng-show=\"comments.length > 1\" class=\"pull-right\"></waid-comments-order-button><br />\n" +
    "    \n" +
    "    <ul class=\"media-list\">\n" +
    "      <li class=\"media\" ng-repeat=\"comment in comments\" style=\"overflow: visible;\" ng-show=\"comments\">\n" +
    "        <waid-comments-item comment=\"comment\" mark-comment=\"markComment\" edit-comment=\"editComment\" delete-comment=\"deleteComment\" vote-comment=\"voteComment\" update-comment=\"updateComment\" add-emoji=\"addEmoji\" waid=\"waid\"></waid-comments-item>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "    <div class=\"load-more text-center\">\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-xs\" ng-click=\"loadComments(true)\" ng-show=\"showMore\">\n" +
    "        <i class=\"fa fa-arrow-down\" aria-hidden=\"true\"></i> {{ ::waid.config.getTranslation('comments', 'loadMoreComments') }}\n" +
    "      </button>\n" +
    "    </div>\n" +
    "    \n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('/templates/comments/comments-order-button.html?v=0.0.49',
    "\n" +
    "  <div class=\"btn-group waid\">\n" +
    "    <button type=\"button\" class=\"btn btn-default btn-xs dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "       <span class=\"glyphicon glyphicon-sort\"></span> \n" +
    "       <span ng-show=\"ordering=='-created'\">{{ ::waid.config.getConfig('comments.translations.voteOrderNewestFirst') }}</span>\n" +
    "       <span ng-show=\"ordering=='created'\">{{ ::waid.config.getConfig('comments.translations.voteOrderOldestFirst') }}</span>\n" +
    "       <span ng-show=\"ordering=='-vote_count'\">{{ ::waid.config.getConfig('comments.translations.voteOrderTopFirst') }}</span><span class=\"caret\"></span>\n" +
    "    </button>\n" +
    "    <ul class=\"dropdown-menu\">\n" +
    "      <li><a href=\"#\" ng-click=\"orderCommentList('-created')\"><span class=\"glyphicon glyphicon-sort-by-attributes-alt\"></span> {{ ::waid.config.getConfig('comments.translations.voteOrderNewestFirst') }} </a></li>\n" +
    "      <li><a href=\"#\" ng-click=\"orderCommentList('created')\"><span class=\"glyphicon glyphicon-sort-by-attributes\n" +
    "          \"></span> {{ ::waid.config.getConfig('comments.translations.voteOrderOldestFirst') }}</a></li>\n" +
    "      <li><a href=\"#\" ng-click=\"orderCommentList('-vote_count')\"><span class=\"glyphicon glyphicon-flash\n" +
    "          \"></span> {{ ::waid.config.getConfig('comments.translations.voteOrderTopFirst') }}</a></li>\n" +
    "    </ul>\n" +
    "  </div>\n"
  );


  $templateCache.put('/templates/core/core.html?v=0.0.49',
    "<div class=\"waid\" id=\"waid\"> \n" +
    "  <div growl></div>\n" +
    "\n" +
    "  <div class=\"loading\" ng-show=\"waid.isLoading\">\n" +
    "    <div class=\"loader\">\n" +
    "      <i class=\"fa fa-spinner fa-pulse fa-3x fa-fw\"></i>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('/templates/core/datepicker/datepicker.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    "  <div ng-switch=\"datepickerMode\" class=\"waid\">\n" +
    "    <div uib-daypicker ng-switch-when=\"day\" tabindex=\"0\" class=\"uib-daypicker\"></div>\n" +
    "    <div uib-monthpicker ng-switch-when=\"month\" tabindex=\"0\" class=\"uib-monthpicker\"></div>\n" +
    "    <div uib-yearpicker ng-switch-when=\"year\" tabindex=\"0\" class=\"uib-yearpicker\"></div>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('/templates/core/datepicker/day.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
    "      <th colspan=\"{{::5 + showWeeks}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "      <th ng-if=\"showWeeks\" class=\"text-center\"></th>\n" +
    "      <th ng-repeat=\"label in ::labels track by $index\" class=\"text-center\"><small aria-label=\"{{::label.full}}\">{{::label.abbr}}</small></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr class=\"uib-weeks\" ng-repeat=\"row in rows track by $index\" role=\"row\">\n" +
    "      <td ng-if=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td>\n" +
    "      <td ng-repeat=\"dt in row\" class=\"uib-day text-center\" role=\"gridcell\"\n" +
    "        id=\"{{::dt.uid}}\"\n" +
    "        ng-class=\"::dt.customClass\">\n" +
    "        <button type=\"button\" class=\"btn btn-default btn-sm\"\n" +
    "          uib-is-class=\"\n" +
    "            'btn-info' for selectedDt,\n" +
    "            'active' for activeDt\n" +
    "            on dt\"\n" +
    "          ng-click=\"select(dt.date)\"\n" +
    "          ng-disabled=\"::dt.disabled\"\n" +
    "          tabindex=\"-1\"><span ng-class=\"::{'text-muted': dt.secondary, 'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "</div>"
  );


  $templateCache.put('/templates/core/datepicker/month.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
    "      <th colspan=\"{{::yearHeaderColspan}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr class=\"uib-months\" ng-repeat=\"row in rows track by $index\" role=\"row\">\n" +
    "      <td ng-repeat=\"dt in row\" class=\"uib-month text-center\" role=\"gridcell\"\n" +
    "        id=\"{{::dt.uid}}\"\n" +
    "        ng-class=\"::dt.customClass\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\"\n" +
    "          uib-is-class=\"\n" +
    "            'btn-info' for selectedDt,\n" +
    "            'active' for activeDt\n" +
    "            on dt\"\n" +
    "          ng-click=\"select(dt.date)\"\n" +
    "          ng-disabled=\"::dt.disabled\"\n" +
    "          tabindex=\"-1\"><span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "</div>"
  );


  $templateCache.put('/templates/core/datepicker/year.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
    "      <th colspan=\"{{::columns - 2}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr class=\"uib-years\" ng-repeat=\"row in rows track by $index\" role=\"row\">\n" +
    "      <td ng-repeat=\"dt in row\" class=\"uib-year text-center\" role=\"gridcell\"\n" +
    "        id=\"{{::dt.uid}}\"\n" +
    "        ng-class=\"::dt.customClass\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\"\n" +
    "          uib-is-class=\"\n" +
    "            'btn-info' for selectedDt,\n" +
    "            'active' for activeDt\n" +
    "            on dt\"\n" +
    "          ng-click=\"select(dt.date)\"\n" +
    "          ng-disabled=\"::dt.disabled\"\n" +
    "          tabindex=\"-1\"><span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "</div>\n"
  );


  $templateCache.put('/templates/core/datepickerPopup/popup.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    "  <ul class=\"uib-datepicker-popup dropdown-menu uib-position-measure\" dropdown-nested ng-if=\"isOpen\" ng-keydown=\"keydown($event)\" ng-click=\"$event.stopPropagation()\">\n" +
    "    <li ng-transclude></li>\n" +
    "    <li ng-if=\"showButtonBar\" class=\"uib-button-bar\">\n" +
    "      <span class=\"btn-group pull-left\">\n" +
    "        <button type=\"button\" class=\"btn btn-sm btn-info uib-datepicker-current\" ng-click=\"select('today', $event)\" ng-disabled=\"isDisabled('today')\">Vandaag</button>\n" +
    "        <button type=\"button\" class=\"btn btn-sm btn-danger uib-clear\" ng-click=\"select(null, $event)\">Wissen</button>\n" +
    "      </span>\n" +
    "      <button type=\"button\" class=\"btn btn-sm btn-success pull-right uib-close\" ng-click=\"close($event)\">Sluiten</button>\n" +
    "    </li>\n" +
    "  </ul>\n" +
    "</div>\n"
  );


  $templateCache.put('/templates/core/emoticons-modal.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    "	<div class=\"modal-header\">\n" +
    "	  <h3 class=\"modal-title\">Emoticons<i class=\"glyphicon glyphicon-remove pull-right\" ng-click=\"waid.closeEmoticonsModal()\"></i></h3>\n" +
    "	</div>\n" +
    "	<div class=\"modal-body\">\n" +
    "	<div ng-repeat=\"(key, group) in emoticons\">\n" +
    "		<h4>{{ waid.config.getTranslation('core', 'emoticons_' + key) }}</h4>\n" +
    "		<p>\n" +
    "		<span class=\"emoticon_select\" ng-repeat=\"emoticon in group track by $index\" ng-click=\"addEmoji(emoticon)\">{{ emoticon }}</span>\n" +
    "		</p>\n" +
    "	</div>\n" +
    "	</div>\n" +
    "	<div class=\"modal-footer\">\n" +
    "	    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"waid.closeEmoticonsModal()\">Sluiten</button>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('/templates/core/modal/window.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    "  <div class=\"modal-dialog {{size ? 'modal-' + size : ''}}\"><div class=\"waid modal-content\" uib-modal-transclude></div></div>\n" +
    "</div>"
  );


  $templateCache.put('/templates/idm/associated-social-accounts.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    "  <div class=\"list-group\">\n" +
    "	  <a href=\"\" class=\"list-group-item\" ng-repeat=\"provider in providers\" ng-click=\"associateSocialAction(provider)\"><i class=\"fa fa-{{ provider.icon }}-square\" aria-hidden=\"true\"></i> {{ provider.name }} <span class=\"label label-success pull-right\" ng-show=\"provider.linked\">Gekoppeld</span> <span class=\"label label-warning pull-right\" ng-hide=\"provider.linked\">Nog niet gekoppeld</span></a>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('/templates/idm/complete-profile-modal.html?v=0.0.49',
    "<span class=\"waid\">\n" +
    "	<div class=\"modal-header\">\n" +
    "	  <h3 class=\"modal-title\">{{ ::waid.config.getTranslation('idm', 'complete_profile_modal_title') }}<i class=\"glyphicon glyphicon-remove pull-right\" ng-click=\"waid.doNotCompleteProfile()\"></i></h3>\n" +
    "	</div>\n" +
    "	<div class=\"modal-body\">\n" +
    "	  <waid-register modus=\"complete\"></waid-register>\n" +
    "	</div>\n" +
    "	<div class=\"modal-footer\">\n" +
    "	  <button class=\"btn btn-warning\" type=\"button\" ng-click=\"waid.doNotCompleteProfile()\">{{ ::waid.config.getTranslation('idm', 'complete_profile_modal_close_button') }}</button>\n" +
    "	</div>\n" +
    "</span>"
  );


  $templateCache.put('/templates/idm/home.html?v=0.0.49',
    ""
  );


  $templateCache.put('/templates/idm/link-social-profile-modal.html?v=0.0.49',
    "<span class=\"waid\">\n" +
    "	<div class=\"modal-header\">\n" +
    "	  <h3 class=\"modal-title\">{{ ::waid.config.getTranslation('idm', 'link_social_profile_modal_title') }}<i class=\"glyphicon glyphicon-remove pull-right\" ng-click=\"waid.doNotLinkSocialProfile()\"></i></h3>\n" +
    "	</div>\n" +
    "	<div class=\"modal-body\">\n" +
    "	  <waid-link-social-profile></waid-link-social-profile>\n" +
    "	</div>\n" +
    "	<div class=\"modal-footer\">\n" +
    "	  <button class=\"btn btn-warning\" type=\"button\" ng-click=\"waid.doNotLinkSocialProfile()\">{{ ::waid.config.getTranslation('idm', 'link_social_profile_modal_close_button') }}</button>\n" +
    "	</div>\n" +
    "</span>"
  );


  $templateCache.put('/templates/idm/link-social-profile.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    " <div>\n" +
    "      <div class=\"alert alert-warning\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ ::waid.config.getTranslation('idm', 'link_social_profile_intro') }}</div>\n" +
    "      \n" +
    "    <form role=\"form\" name=\"linkSocialProfileForm\" novalidate>\n" +
    "      <div class=\"form-group has-feedback\" ng-class=\"errors.password ? 'has-error' : ''\">\n" +
    "          <label for=\"id_password\">{{ ::waid.config.getTranslation('idm', 'password') }}</label>\n" +
    "          <input name=\"password\" id=\"id_password\" class=\"form-control\" type=\"password\" ng-model=\"model.password\" placeholder=\"{{ ::waid.config.getTranslation('idm', 'password') }}\" required />\n" +
    "          <span class=\"glyphicon glyphicon-remove form-control-feedback\" aria-hidden=\"true\" ng-show=\"errors.password\"></span>\n" +
    "          <div class=\"alert alert-danger\" ng-repeat=\"error in errors.password\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "      </div>\n" +
    "      <button class=\"btn btn-primary\" ng-click=\"linkSocialProfile()\" ng-disabled=\"waid.isLoading\">{{ ::waid.config.getTranslation('idm', 'link_social_profile_link_button') }}</span></button>\n" +
    "    </form>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('/templates/idm/login-and-register-home.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <h3>{{ ::waid.config.getTranslation('idm', 'login_and_register_home_social_login_title') }}</h3>\n" +
    "      <div ng-bind-html=\"::waid.config.getTranslation('idm', 'login_and_register_home_social_login_intro')\"></div>\n" +
    "      <waid-social-login></waid-social-login>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <h3>{{ ::waid.config.getTranslation('idm', 'login_and_register_home_login_title') }}</h3>\n" +
    "      <waid-login></waid-login>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <h3>{{ ::waid.config.getTranslation('idm', 'login_and_register_home_register_title') }}</h3>\n" +
    "      <waid-register></waid-register>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('/templates/idm/login-and-register-modal.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    "	<div class=\"modal-header\">\n" +
    "	  <h3 class=\"modal-title\">{{ ::waid.config.getTranslation('idm', 'login_and_register_modal_title') }} <i class=\"glyphicon glyphicon-remove pull-right\" ng-click=\"waid.closeLoginAndRegisterModal()\"></i></h3>\n" +
    "	</div>\n" +
    "	<div class=\"modal-body\">\n" +
    "	   <waid-login-and-register-home></waid-login-and-register-home>\n" +
    "	</div>\n" +
    "	<div class=\"modal-footer\">\n" +
    "	    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"waid.closeLoginAndRegisterModal()\">{{ ::waid.config.getTranslation('idm', 'login_and_register_modal_close_button') }}</button>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('/templates/idm/login.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    "  <div id=\"login_view\">\n" +
    "    <form role=\"form\"  name=\"loginForm\" novalidate>\n" +
    "      <div class=\"form-group has-feedback\" ng-class=\"errors.username ? 'has-error' : ''\">\n" +
    "\n" +
    "        <label for=\"id_username\">{{ ::waid.config.getTranslation('idm', 'login_form_username_label') }}</label>\n" +
    "        <input name=\"username\" id=\"id_username\" type=\"text\" ng-model=\"model.username\" placeholder=\"Username\" class=\"form-control\" required />\n" +
    "        <span class=\"glyphicon glyphicon-remove form-control-feedback\" aria-hidden=\"true\" ng-show=\"errors.username\"></span>\n" +
    "        <div class=\"alert alert-danger\" ng-repeat=\"error in errors.username\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ error }}</div>\n" +
    "      </div>\n" +
    "      \n" +
    "      <div class=\"form-group has-feedback\" ng-class=\"errors.password ? 'has-error' : ''\">\n" +
    "        <label for=\"id_password\">{{ ::waid.config.getTranslation('idm', 'login_form_password_label') }}</label>\n" +
    "        <input name=\"password\" id=\"id_password\" type=\"password\" ng-model=\"model.password\" placeholder=\"Password\" class=\"form-control\" required />\n" +
    "        <span class=\"glyphicon glyphicon-remove form-control-feedback\" aria-hidden=\"true\" ng-show=\"errors.password\"></span>\n" +
    "        <div class=\"alert alert-danger\" ng-repeat=\"error in errors.password\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ error }}</div>\n" +
    "      </div>\n" +
    "      \n" +
    "      <div class=\"alert alert-danger\" ng-repeat=\"error in errors.non_field_errors\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ error }}</div>\n" +
    "      <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"login()\" ng-disabled=\"waid.isLoading\">{{ ::waid.config.getTranslation('idm', 'login_submit') }}</button>\n" +
    "    </form>\n" +
    "    <br />\n" +
    "    <a ng-click=\"waid.openLostLoginModal()\">{{ ::waid.config.getTranslation('idm', 'login_lost_login_link') }}</a>\n" +
    "\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('/templates/idm/lost-login-modal.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    "	<div class=\"modal-header\">\n" +
    "	  <h3 class=\"modal-title\">{{ ::waid.config.getTranslation('idm', 'lost_login_modal_title') }}<i class=\"glyphicon glyphicon-remove pull-right\" ng-click=\"waid.closeLostLoginModal()\"></i></h3>\n" +
    "	</div>\n" +
    "	<div class=\"modal-body\">\n" +
    "	  <waid-lost-login></waid-lost-login>\n" +
    "	</div>\n" +
    "	<div class=\"modal-footer\">\n" +
    "	    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"waid.closeLostLoginModal()\">{{ ::waid.config.getTranslation('idm', 'lost_login_modal_close_button') }}</button>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('/templates/idm/lost-login.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    "	<div id=\"lost_login_view\">\n" +
    "	<form role=\"form\" name=\"loginForm\" novalidate>\n" +
    "	  <div class=\"form-group\">\n" +
    "	    <label for=\"id_email\">{{ ::waid.config.getTranslation('idm', 'lost_lostin_form_email') }}</label>\n" +
    "	    <input name=\"username\" id=\"id_email\" type=\"text\" ng-model=\"model.email\" placeholder=\"Email\" class=\"form-control\" required />\n" +
    "	  </div>\n" +
    "	  <div class=\"alert alert-danger\" ng-repeat=\"error in errors.email\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ error }}</div>\n" +
    "	  <div class=\"alert alert-danger\" ng-repeat=\"error in errors.non_field_errors\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ error }}</div>\n" +
    "	  <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"submit()\">{{ ::waid.config.getTranslation('idm', 'lost_login_submit_button') }}</button>\n" +
    "	</form>\n" +
    "	</div>\n" +
    "</div>\n" +
    "  "
  );


  $templateCache.put('/templates/idm/overview.html?v=0.0.49',
    "<div >\n" +
    "<div ng-repeat=\"(groupName, fieldSet) in $parent.fieldSet.groups\">\n" +
    "  <div ng-if=\"!fieldSet.hideFromOverview\">\n" +
    "    <h5>{{ ::waid.config.getTranslation('idm', fieldSet.key ) }}</h5>\n" +
    "      <div ng-repeat=\"(fieldDefinitionName, fieldDefinition) in $parent.groupedFieldDefinitions[groupName]\">\n" +
    "        <ANY ng-switch=\"fieldDefinition.type\" ng-if=\"!fieldDefinition.hideFromOverview\">\n" +
    "          <ANY ng-switch-when=\"input\">\n" +
    "            <dl class=\"dl-horizontal\">\n" +
    "              <dt>{{ ::waid.config.getTranslation('idm',  fieldDefinition.labelKey ) }}</dt>\n" +
    "              <dd>{{ model[fieldDefinition.name] }}</dd>\n" +
    "            </dl>\n" +
    "          </ANY>\n" +
    "\n" +
    "          <ANY ng-switch-when=\"date\">\n" +
    "            <dl class=\"dl-horizontal\">\n" +
    "              <dt>{{ ::waid.config.getTranslation('idm',  fieldDefinition.labelKey ) }}</dt>\n" +
    "              <dd>{{ model[fieldDefinition.name] | date:'longDate' }}</dd>\n" +
    "            </dl>\n" +
    "          </ANY>\n" +
    "\n" +
    "          <ANY ng-switch-when=\"password\">\n" +
    "            <dl class=\"dl-horizontal\">\n" +
    "              <dt>{{ ::waid.config.getTranslation('idm',  fieldDefinition.labelKey ) }}</dt>\n" +
    "              <dd>*******</dd>\n" +
    "            </dl>\n" +
    "          </ANY>\n" +
    "\n" +
    "          <ANY ng-switch-when=\"gender\">\n" +
    "            <dl class=\"dl-horizontal\">\n" +
    "              <dt>{{ ::waid.config.getTranslation('idm',  fieldDefinition.labelKey ) }}</dt>\n" +
    "              <dd><span ng-show=\"model[fieldDefinition.name]=='F'\">{{ waid.config.getConfig('idm.translations.female') }}</span><span ng-show=\"model[fieldDefinition.name]=='M'\">{{ waid.config.getConfig('idm.translations.male') }}</span></dd>\n" +
    "            </dl>\n" +
    "          </ANY>\n" +
    "\n" +
    "          <ANY ng-switch-when=\"avatar\">\n" +
    "            <dl class=\"dl-horizontal\">\n" +
    "              <dt>{{ ::waid.config.getTranslation('idm',  fieldDefinition.labelKey ) }}</dt>\n" +
    "              <dd><img ng-show=\"model.avatar_thumb_50_50\" ng-src=\"{{ model.avatar_thumb_50_50 }}\"></dd>\n" +
    "            </dl>\n" +
    "          </ANY>\n" +
    "\n" +
    "          <ANY ng-switch-when=\"textarea\">\n" +
    "            <dl class=\"dl-horizontal\">\n" +
    "              <dt>{{ ::waid.config.getTranslation('idm',  fieldDefinition.labelKey ) }}</dt>\n" +
    "              <dd>{{ model[fieldDefinition.name] }}</dd>\n" +
    "            </dl>\n" +
    "          </ANY>\n" +
    "\n" +
    "          <ANY ng-switch-when=\"multipleEmail\">\n" +
    "            <div ng-show=\"emails.length > 0\" ng-cloak>\n" +
    "              <dl class=\"dl-horizontal\" ng-repeat=\"email in emails\">\n" +
    "                <dt>\n" +
    "                  {{ email.email }}\n" +
    "                </dt>\n" +
    "                <dd>\n" +
    "                  <span class=\"glyphicon glyphicon-minus text-danger\" ng-show=\"!email.is_verified\"></span>\n" +
    "                  <span class=\"glyphicon glyphicon-ok text-success\" ng-show=\"email.is_verified\"></span>\n" +
    "                </dd>\n" +
    "              </dl>\n" +
    "            </div>\n" +
    "          </ANY>\n" +
    "\n" +
    "          <ANY ng-switch-when=\"associatedSocialAccounts\">\n" +
    "            <div ng-show=\"providers.length > 0\" ng-cloak>\n" +
    "              <dl class=\"dl-horizontal\" ng-repeat=\"provider in providers\">\n" +
    "                <dt>\n" +
    "                  <i class=\"fa fa-{{ provider.icon }}-square\" aria-hidden=\"true\"></i> {{ provider.name }}\n" +
    "                </dt>\n" +
    "                <dd>\n" +
    "                  <span class=\"glyphicon glyphicon-ok text-success\" ng-show=\"provider.linked\"></span>\n" +
    "                  <span class=\"glyphicon glyphicon-minus text-danger\" ng-show=\"!provider.linked\">-</span>\n" +
    "                </dd>\n" +
    "              </dl>\n" +
    "            </div>\n" +
    "          </ANY>\n" +
    "\n" +
    "          <ANY ng-switch-when=\"checkbox\">\n" +
    "            <dl class=\"dl-horizontal\">\n" +
    "              <dt>{{ ::waid.config.getTranslation('idm',  fieldDefinition.labelKey ) }}</dt>\n" +
    "              <dd>\n" +
    "                <span class=\"glyphicon glyphicon-ok text-success\" ng-show=\"model[fieldDefinition.name]\"></span>\n" +
    "                <span class=\"glyphicon glyphicon-minus text-danger\" ng-show=\"!model[fieldDefinition.name]\"></span>\n" +
    "              </dd>\n" +
    "            </dl>\n" +
    "          </ANY>\n" +
    "\n" +
    "          <ANY ng-switch-when=\"multipleCheckbox\">\n" +
    "            <dl class=\"dl-horizontal\">\n" +
    "              <dt>{{ ::waid.config.getTranslation('idm',  fieldDefinition.labelKey ) }}</dt>\n" +
    "              <dd>\n" +
    "                <ul ng-show=\"model[fieldDefinition.name]\">\n" +
    "                  <li ng-repeat=\"(key, value) in model[fieldDefinition.name]\" ng-show=\"value\">{{ getMultipleCheckBoxName(fieldDefinition, key) }}</li>\n" +
    "                </ul>\n" +
    "                <span class=\"glyphicon glyphicon-minus text-danger\" ng-show=\"!model[fieldDefinition.name]\"></span>\n" +
    "              </dd>\n" +
    "            </dl>\n" +
    "          </ANY>\n" +
    "\n" +
    "          <ANY ng-switch-default>Invalid fieldDefinition</ANY>\n" +
    "        </ANY>\n" +
    "      </div>\n" +
    "      <a class=\"btn btn-default btn-block\" ng-click=\"goToFieldSet(fieldSet.key)\"><i class=\"fa fa-pencil-square-o\" aria-hidden=\"true\"></i> {{ ::waid.config.getTranslation('idm', 'edit') }}</a>\n" +
    "    \n" +
    "  </div>\n" +
    "</div>\n" +
    "</div>"
  );


  $templateCache.put('/templates/idm/profile.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-lg-4 col-md-4 col-sm-4 hidden-xs\">\n" +
    "      <div class=\"waid\">\n" +
    "        <ul class=\"nav nav-pills nav-stacked\">\n" +
    "          <li role=\"presentation\" ng-repeat=\"(groupName, menuItem) in fieldSet.groups\" ng-class=\"getActiveFieldSetMenuClass(menuItem.key)\"><a ng-click=\"goToFieldSet(menuItem.key)\">{{ waid.config.getTranslation('idm', menuItem.key) }}</a></li>\n" +
    "          <li role=\"presentation\" ng-click=\"waid.logout()\"><a>Uitloggen</a></li>\n" +
    "        </ul>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"col-lg-8 col-md-8 col-sm-8 col-xs-12\">\n" +
    "      <div ng-repeat=\"(groupName, fieldSetGroup) in fieldSet.groups\" ng-show=\"showFieldSet(fieldSetGroup.key)\" ng-cloak>\n" +
    "        <h4>{{ ::waid.config.getTranslation('idm', fieldSet.key ) }}</h4>\n" +
    "        \n" +
    "        <div ng-if=\"fieldSetGroup.templateKey\">\n" +
    "          <ng-include ng-init=\"fieldSetGroup.length > 0\" src=\"waid.config.getTemplateUrl('idm', fieldSetGroup.templateKey)\"></ng-include>\n" +
    "        </div>\n" +
    "\n" +
    "        <p ng-if=\"fieldSetGroup.introKey\">{{ ::waid.config.getTranslation('idm',   fieldSetGroup.introKey) }}</p>\n" +
    "        <form ng-if=\"fieldSetGroup.fieldDefinitions\">\n" +
    "          <ANY ng-repeat=\"(fieldDefinitionName, fieldDefinition) in groupedFieldDefinitions[groupName]\">\n" +
    "          	<label for=\"{{ fieldDefinition.name }}\" ng-hide=\"fieldDefinition.noLabel\">{{ ::waid.config.getTranslation('idm', 	fieldDefinition.labelKey ) }}</label>\n" +
    "            <ANY ng-switch=\"fieldDefinition.type\">\n" +
    "              \n" +
    "              <ANY ng-switch-when=\"input\">\n" +
    "                <div class=\"form-group has-feedback\" ng-class=\"errors[fieldDefinition.name] ? 'has-error' : ''\">\n" +
    "                  <input type=\"input\" class=\"form-control\" id=\"{{ fieldDefinition.name }}\" placeholder=\"{{ ::waid.config.getTranslation('idm',   fieldDefinition.labelKey ) }}\" ng-model=\"model[fieldDefinition.name]\" ng-change=\"fieldChange(fieldDefinition.name)\" />\n" +
    "                  <span class=\"glyphicon glyphicon-remove form-control-feedback\" aria-hidden=\"true\" ng-show=\"errors[fieldDefinition.name]\"></span>\n" +
    "                  <div class=\"alert alert-danger\" ng-repeat=\"error in errors[fieldDefinition.name]\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "                </div>\n" +
    "              </ANY>\n" +
    "\n" +
    "              <ANY ng-switch-when=\"multipleTelephone\">\n" +
    "                <div class=\"panel panel-default\" ng-repeat=\"(key, telephone) in telephoneNumbers\">\n" +
    "                  <div class=\"panel-heading\">{{ ::waid.config.getTranslation('idm', 'telephone_number') }} {{ key+1 }}\n" +
    "                     <i class=\"glyphicon glyphicon-remove pull-right\" aria-hidden=\"true\" ng-click=\"deleteTelephone(key)\"></i>\n" +
    "                  </div>\n" +
    "                  <div class=\"panel-body\">\n" +
    "                    <div class=\"form-group has-feedback\" ng-class=\"telephone.errors.number ? 'has-error' : ''\">\n" +
    "                      <input type=\"input\" class=\"form-control\" id=\"telephone_{{ fieldDefinition.name }}_{{ key }}\" placeholder=\"{{ ::waid.config.getTranslation('idm',   fieldDefinition.numberKey ) }}\" ng-model=\"telephone.number\" ng-change=\"changeTelephoneValue(fieldDefinition.name, key)\" />\n" +
    "                      <span class=\"glyphicon glyphicon-remove form-control-feedback\" aria-hidden=\"true\" ng-show=\"telephone.errors.number\"></span>\n" +
    "                      <div class=\"alert alert-danger\" ng-repeat=\"error in telephone.errors.number\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "                    </div>\n" +
    "                    \n" +
    "                  </div>\n" +
    "                </div>\n" +
    "              </ANY>\n" +
    "\n" +
    "              <ANY ng-switch-when=\"multipleAddresses\">\n" +
    "                <div class=\"panel panel-default\" ng-repeat=\"(key, address) in addresses\">\n" +
    "                  <div class=\"panel-heading\">Adres {{ key+1 }}\n" +
    "                     <i class=\"glyphicon glyphicon-remove pull-right\" aria-hidden=\"true\" ng-click=\"deleteAddress(key)\"></i>\n" +
    "                  </div>\n" +
    "                  <div class=\"panel-body\">\n" +
    "                    <div class=\"row\">\n" +
    "                      <div class=\"col-md-12\">\n" +
    "                        <div class=\"form-group has-feedback\" ng-class=\"address.errors.address ? 'has-error' : ''\">\n" +
    "                          <label for=\"address_{{ fieldDefinition.name }}_address_{{ key }}\">{{ ::waid.config.getTranslation('idm',  'address' ) }}</label>\n" +
    "                          <input type=\"input\" class=\"form-control\" id=\"address_{{ fieldDefinition.name }}_address_{{ key }}\" placeholder=\"{{ ::waid.config.getTranslation('idm',   fieldDefinition.numberKey ) }}\" ng-model=\"address.address\" ng-change=\"changeAddressValue(fieldDefinition.name, 'address', key)\" />\n" +
    "                          <span class=\"glyphicon glyphicon-remove form-control-feedback\" aria-hidden=\"true\" ng-show=\"address.errors.address\"></span>\n" +
    "                          <div class=\"alert alert-danger\" ng-repeat=\"error in address.errors.address\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ error }}</div>\n" +
    "                        </div>\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"row\">\n" +
    "                      <div class=\"col-md-4\">\n" +
    "                        <div class=\"form-group has-feedback\" ng-class=\"address.errors.zipcode ? 'has-error' : ''\">\n" +
    "                          <label for=\"address_{{ fieldDefinition.name }}_zipcode_{{ key }}\">{{ ::waid.config.getTranslation('idm',  'zipcode' ) }}</label>\n" +
    "                          <input type=\"input\" class=\"form-control\" id=\"address_{{ fieldDefinition.name }}_zipcode_{{ key }}\" placeholder=\"{{ ::waid.config.getTranslation('idm',   fieldDefinition.numberKey ) }}\" ng-model=\"address.zipcode\" ng-change=\"changeAddressValue(fieldDefinition.name, 'zipcode', key)\" />\n" +
    "                          <span class=\"glyphicon glyphicon-remove form-control-feedback\" aria-hidden=\"true\" ng-show=\"address.errors.zipcode\"></span>\n" +
    "                          <div class=\"alert alert-danger\" ng-repeat=\"error in address.errors.zipcode\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ error }}</div>\n" +
    "                        </div>\n" +
    "                      </div>\n" +
    "                      <div class=\"col-md-4\">\n" +
    "                        <div class=\"form-group has-feedback\" ng-class=\"address.errors.city ? 'has-error' : ''\">\n" +
    "                          <label for=\"address_{{ fieldDefinition.name }}_city_{{ key }}\">{{ ::waid.config.getTranslation('idm',  'city' ) }}</label>\n" +
    "                          <input type=\"input\" class=\"form-control\" id=\"address_{{ fieldDefinition.name }}_city_{{ key }}\" placeholder=\"{{ ::waid.config.getTranslation('idm',   fieldDefinition.numberKey ) }}\" ng-model=\"address.city\" ng-change=\"changeAddressValue(fieldDefinition.name, 'city', key)\" />\n" +
    "                          <span class=\"glyphicon glyphicon-remove form-control-feedback\" aria-hidden=\"true\" ng-show=\"address.errors.city\"></span>\n" +
    "                          <div class=\"alert alert-danger\" ng-repeat=\"error in address.errors.city\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ error }}</div>\n" +
    "                        </div>\n" +
    "                      </div>\n" +
    "                      <div class=\"col-md-4\">\n" +
    "                        <div class=\"form-group has-feedback\" ng-class=\"address.errors.country ? 'has-error' : ''\">\n" +
    "                          <label for=\"address_{{ fieldDefinition.name }}_country_{{ key }}\">{{ ::waid.config.getTranslation('idm',  'country' ) }}</label>\n" +
    "                          <input type=\"input\" class=\"form-control\" id=\"address_{{ fieldDefinition.name }}_country_{{ key }}\" placeholder=\"{{ ::waid.config.getTranslation('idm',   fieldDefinition.numberKey ) }}\" ng-model=\"address.country\" ng-change=\"changeAddressValue(fieldDefinition.name, 'country', key)\" />\n" +
    "                          <span class=\"glyphicon glyphicon-remove form-control-feedback\" aria-hidden=\"true\" ng-show=\"address.errors.country\"></span>\n" +
    "                          <div class=\"alert alert-danger\" ng-repeat=\"error in address.errors.country\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ error }}</div>\n" +
    "                        </div>\n" +
    "                      </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "              </ANY>\n" +
    "\n" +
    "              <ANY ng-switch-when=\"date\">\n" +
    "                <div class=\"form-group has-feedback\" ng-class=\"errors[fieldDefinition.name] ? 'has-error' : ''\">\n" +
    "                  <div class=\"input-group\">\n" +
    "                    <input type=\"text\" class=\"form-control\" id=\"{{ fieldDefinition.name }}\" uib-datepicker-popup ng-model=\"model[fieldDefinition.name]\" is-open=\"popup.opened\" alt-input-formats=\"['dd-MM-yyyy', 'dd MM yyyy', 'dd-MMMM-yyyy', 'dd MMMM yyyy']\" datepicker-options=\"dateOptions\" close-text=\"Close\" ng-change=\"fieldChange(fieldDefinition.name)\"/>\n" +
    "                    <span class=\"input-group-btn\">\n" +
    "                      <button type=\"button\" class=\"btn btn-default\" ng-click=\"open()\"><i class=\"glyphicon glyphicon-calendar\"></i></button>\n" +
    "                    </span>\n" +
    "                  </div>\n" +
    "                  <div class=\"alert alert-danger\" ng-repeat=\"error in errors[fieldDefinition.name]\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "                </div>\n" +
    "              </ANY>\n" +
    "\n" +
    "              <ANY ng-switch-when=\"gender\">\n" +
    "                <div class=\"form-group has-feedback\" ng-class=\"errors[fieldDefinition.name] ? 'has-error' : ''\">\n" +
    "                  <label class=\"radio-inline\">\n" +
    "                    <input type=\"radio\" ng-model=\"model[fieldDefinition.name]\" value=\"M\" ng-change=\"fieldChange(fieldDefinition.name)\"> {{ ::waid.config.getTranslation('idm', 'male') }}\n" +
    "                  </label>\n" +
    "                  <label class=\"radio-inline\">\n" +
    "                    <input type=\"radio\" ng-model=\"model[fieldDefinition.name]\" value=\"F\" ng-change=\"fieldChange(fieldDefinition.name)\"> {{ ::waid.config.getTranslation('idm', 'female') }}\n" +
    "                  </label>\n" +
    "                  <div class=\"alert alert-danger\" ng-repeat=\"error in errors[fieldDefinition.name]\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "                </div>\n" +
    "              </ANY>\n" +
    "\n" +
    "              <ANY ng-switch-when=\"checkbox\">\n" +
    "                <div class=\"form-group has-feedback\" ng-class=\"errors[fieldDefinition.name] ? 'has-error' : ''\">\n" +
    "                  <div class=\"checkbox\">\n" +
    "                    <label>\n" +
    "                      <input type=\"checkbox\" ng-model=\"model[fieldDefinition.name]\" ng-change=\"fieldChange(fieldDefinition.name)\"> {{ ::waid.config.getTranslation('idm', fieldDefinition.labelKey ) }}\n" +
    "                    </label>\n" +
    "                  </div>\n" +
    "                  <div class=\"alert alert-danger\" ng-repeat=\"error in errors[fieldDefinition.name]\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "                </div>\n" +
    "              </ANY>\n" +
    "\n" +
    "              <ANY ng-switch-when=\"multipleCheckbox\">\n" +
    "                <div class=\"form-group has-feedback\" ng-class=\"errors[fieldDefinition.name] ? 'has-error' : ''\">\n" +
    "                  <div class=\"checkbox\" ng-repeat=\"row in fieldDefinition.data\">\n" +
    "                    <label>\n" +
    "                      <input type=\"checkbox\" ng-model=\"model[fieldDefinition.name][row.id]\" value=\"row\" ng-change=\"fieldChange(fieldDefinition.name)\"> {{ row.name }}\n" +
    "                    </label>\n" +
    "                  </div>\n" +
    "                  <div class=\"alert alert-danger\" ng-repeat=\"error in errors[fieldDefinition.name]\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "                </div>\n" +
    "              </ANY>\n" +
    "\n" +
    "              <ANY ng-switch-when=\"avatar\">\n" +
    "                <div class=\"media\">\n" +
    "                  <div class=\"media-left\">\n" +
    "                    <a href=\"#\">\n" +
    "                      <img class=\"media-object\" ng-show=\"model.avatar_thumb_50_50\" ng-src=\"{{ model.avatar_thumb_50_50 }}\" >\n" +
    "                    </a>\n" +
    "                  </div>\n" +
    "                  <div class=\"media-body\">\n" +
    "                    <div ng-show=\"isUploading\" class=\"alert alert-info\" role=\"alert\">Bezig met uploaden van foto.</div>\n" +
    "                    <div class=\"form-group has-feedback\" ng-class=\"errors[fieldDefinition.name] ? 'has-error' : ''\">\n" +
    "                      <input type=\"file\" class=\"form-control\" id=\"avatar\" placeholder=\"Profielfoto\" onchange=\"angular.element(this).scope().uploadFile(this.files)\">\n" +
    "                      <div class=\"alert alert-danger\" ng-repeat=\"error in errors[fieldDefinition.name]\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "                    </div>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "              </ANY>\n" +
    "\n" +
    "              <ANY ng-switch-when=\"textarea\">\n" +
    "                <div class=\"form-group has-feedback\" ng-class=\"errors[fieldDefinition.name] ? 'has-error' : ''\">\n" +
    "                  <textarea class=\"form-control\" rows=\"3\" id=\"{{ fieldDefinition.name }}\" ng-model=\"model[fieldDefinition.name]\" ng-change=\"fieldChange(fieldDefinition.name)\" msd-elastic></textarea>\n" +
    "                  <div class=\"alert alert-danger\" ng-repeat=\"error in errors[fieldDefinition.name]\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "                </div>\n" +
    "              </ANY>\n" +
    "\n" +
    "              <ANY ng-switch-when=\"password\">\n" +
    "                <div class=\"form-group has-feedback\" ng-class=\"errors[fieldDefinition.name] ? 'has-error' : ''\">\n" +
    "                  <input type=\"password\" class=\"form-control\" id=\"{{ fieldDefinition.name }}\" placeholder=\"{{ ::waid.config.getTranslation('idm',   fieldDefinition.labelKey ) }}\" ng-model=\"model[fieldDefinition.name]\" ng-change=\"fieldChange(fieldDefinition.name)\" />\n" +
    "                  <span class=\"glyphicon glyphicon-remove form-control-feedback\" aria-hidden=\"true\" ng-show=\"errors[fieldDefinition.name]\"></span>\n" +
    "                  <div class=\"alert alert-danger\" ng-repeat=\"error in errors[fieldDefinition.name]\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "                </div>\n" +
    "              </ANY>\n" +
    "                  \n" +
    "              <ANY ng-switch-when=\"multipleEmail\">\n" +
    "                <div class=\"input-group input-group-sm\">\n" +
    "                  <input type=\"add_email\" class=\"form-control\" id=\"add_email\" placeholder=\"Email\" ng-model=\"email.add\" ng-keypress=\"addEmailEnter($event)\" />\n" +
    "                  <span class=\"input-group-btn\">\n" +
    "                    <button class=\"btn btn-default\" type=\"button\" ng-click=\"addEmail()\">Toevoegen</button>\n" +
    "                  </span>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"alert alert-danger\" ng-repeat=\"error in errors.email\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "           \n" +
    "                <div ng-show=\"inactiveEmails.length > 0\">\n" +
    "                  <h4><span class=\"glyphicon glyphicon-eye-close text-danger\"></span> Nog te valideren e-mail adressen</h4>\n" +
    "                  <p>Onderstaande e-mail adressen dienen nog te worden gecontroleerd. Er is een mail gestuurd naar het adres met een activatie link. Als je deze niet hebt ontvangen kan je het email adres verwijderen en een nieuwe toevoegen</p> \n" +
    "                  <ul class=\"list-group\">\n" +
    "                    <li class=\"list-group-item\" ng-repeat=\"row in inactiveEmails track by row.id\">\n" +
    "                      <span class=\"glyphicon glyphicon-chevron-right\"></span>\n" +
    "                      {{ row.email }}\n" +
    "                       <button class=\"btn btn-default btn-xs pull-right\" type=\"button\" ng-click=\"deleteEmail(row.id)\" confirm=\"{{ row.email }} verwijderen ?\"><span class=\"glyphicon glyphicon-remove text-danger\"></span> Verwijderen</button>\n" +
    "                    </li>\n" +
    "                  </ul>\n" +
    "                </div>\n" +
    "\n" +
    "                <div ng-show=\"activeEmails.length > 0\">\n" +
    "                  <h4><span class=\"glyphicon glyphicon-ok text-success\"></span> Gevalideerde e-mail adressen</h4>\n" +
    "                  <p>De e-mail adressen hieronder zijn geactiveerd. Deze e-mail adressen worden gebruikt om systeemberichten zoals activatie en notificatie e-mails naar je toe te sturen.</p>\n" +
    "                  <ul class=\"list-group\">\n" +
    "                    <li class=\"list-group-item\" ng-repeat=\"row in activeEmails track by row.id\">\n" +
    "                      <span class=\"glyphicon glyphicon-chevron-right\"></span>\n" +
    "                      {{ row.email }}\n" +
    "                       <button class=\"btn btn-default btn-xs pull-right\" type=\"button\" ng-click=\"deleteEmail(row.id)\" confirm=\"{{ row.email }} verwijderen ?\"><span class=\"glyphicon glyphicon-remove text-danger\"></span> Verwijderen</button>\n" +
    "                    </li>\n" +
    "                  </ul>\n" +
    "                </div>\n" +
    "\n" +
    "                <div ng-show=\"emails.length == 0\">\n" +
    "                  <h4><span class=\"glyphicon glyphicon-zoom-in\"></span> Geen e-mail adressen bekend</h4>\n" +
    "                  <p>Er zijn nog geen e-mail adressen bekend. Voeg hierboven een e-mail adres toe. Je ontvangt een bevestigings e-mail ter verificatie.</p>\n" +
    "                  </div>\n" +
    "                  <div class=\"alert alert-danger\" ng-if=\"errors.detail\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{errors.detail}}\n" +
    "                </div>\n" +
    "              </ANY>\n" +
    "\n" +
    "              <ANY ng-switch-when=\"associatedSocialAccounts\">\n" +
    "                <waid-associated-social-accounts></waid-associated-social-accounts>\n" +
    "              </ANY>\n" +
    "\n" +
    "\n" +
    "              <p class=\"help-block\" ng-if=\"fieldDefinition.helpKey\">{{ ::waid.config.getTranslation('idm', fieldDefinition.helpKey) }}</p>\n" +
    "              \n" +
    "              <ANY ng-switch-default>Invalid fieldDefinition</ANY>\n" +
    "\n" +
    "              \n" +
    "        	  </ANY>\n" +
    "            \n" +
    "          </ANY>\n" +
    "          <div class=\"alert alert-danger\" ng-repeat=\"error in errors.non_field_errors\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "          <button type=\"submit\" ng-disabled=\"waid.isLoading\" class=\"btn btn-default btn-block\" ng-click=\"save(true)\" ng-hide=\"fieldSetGroup.noSaveButton\" ng-cloak><i class=\"fa fa-floppy-o\" aria-hidden=\"true\"></i> Opslaan</button>\n" +
    "        </form>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('/templates/idm/register.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    " <div>\n" +
    "      <div ng-show=\"modus=='complete'\" class=\"alert alert-warning\" ng-show=\"missingProfileData\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ ::waid.config.getTranslation('idm', 'missing_profile_data') }}</div>\n" +
    "      <div class=\"alert alert-warning\" ng-show=\"emailIsNotVerified\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ ::waid.config.getTranslation('idm', 'email_is_not_verified') }}</div>\n" +
    "      <div class=\"alert alert-warning\" ng-show=\"invalidProfileData\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ ::waid.config.getTranslation('idm', 'invalid_profile_data') }}</div>\n" +
    "\n" +
    "\n" +
    "    <form role=\"form\" name=\"registerForm\" novalidate>\n" +
    "      <div class=\"form-group has-feedback\" ng-class=\"errors.username ? 'has-error' : ''\" ng-show=\"show.username\">\n" +
    "          <label for=\"id_username\">{{ ::waid.config.getTranslation('idm', 'register_form_username') }}</label>\n" +
    "          <input name=\"username\" id=\"id_username\" class=\"form-control\" type=\"text\" ng-model=\"model.username\" placeholder=\"{{ ::waid.config.getTranslation('idm', 'register_form_username') }}\" required />\n" +
    "          <span class=\"glyphicon glyphicon-remove form-control-feedback\" aria-hidden=\"true\" ng-show=\"errors.username\"></span>\n" +
    "          <div class=\"alert alert-danger\" ng-repeat=\"error in errors.username\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "      </div>\n" +
    "      \n" +
    "      <div class=\"form-group has-feedback\" ng-class=\"errors.password ? 'has-error' : ''\" ng-show=\"show.password\">\n" +
    "          <label for=\"id_password\">{{ ::waid.config.getTranslation('idm', 'register_form_password') }}</label>\n" +
    "          <input name=\"password1\" id=\"id_password\" class=\"form-control\" type=\"password\" ng-model=\"model.password\" placeholder=\"{{ ::waid.config.getTranslation('idm', 'register_form_password') }}\" required />\n" +
    "          <span class=\"glyphicon glyphicon-remove form-control-feedback\" aria-hidden=\"true\" ng-show=\"errors.password\"></span>\n" +
    "          <div class=\"alert alert-danger\" ng-repeat=\"error in errors.password\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "      </div>\n" +
    "      \n" +
    "      <div class=\"form-group has-feedback\" ng-class=\"errors.email ? 'has-error' : ''\" ng-show=\"show.email\">\n" +
    "          <label for=\"id_email\">{{ ::waid.config.getTranslation('idm', 'register_form_email') }}</label>\n" +
    "          <input name=\"email\" id=\"id_email\" class=\"form-control\" type=\"email\" ng-model=\"model.email\" placeholder=\"{{ ::waid.config.getTranslation('idm', 'register_form_email') }}\" required />\n" +
    "          <span class=\"glyphicon glyphicon-remove form-control-feedback\" aria-hidden=\"true\" ng-show=\"errors.email\"></span>\n" +
    "          <div class=\"alert alert-danger\" ng-repeat=\"error in errors.email\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "      </div>\n" +
    "\n" +
    "      <div class=\"checkbox\" ng-show=\"show.terms_and_conditions_check\">\n" +
    "        <label>\n" +
    "          <input type=\"checkbox\" ng-model=\"model.terms_and_conditions_check\" /> <waid-translation module=\"idm\" key=\"terms_and_conditions_check\"></waid-translation>\n" +
    "        </label>\n" +
    "      </div>\n" +
    "      <div class=\"alert alert-danger\" ng-repeat=\"error in errors.terms_and_conditions_check\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "      <div class=\"alert alert-danger\" ng-repeat=\"error in errors.non_field_errors\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "      <button ng-disabled=\"!model.terms_and_conditions_check || waid.isLoading\" type=\"submit\" class=\"btn btn-primary\" ng-click=\"register()\"><span ng-show=\"modus!='complete'\">{{ ::waid.config.getTranslation('idm', 'register_submit_register') }}</span><span ng-show=\"modus=='complete'\">{{ ::waid.config.getTranslation('idm', 'register_submit_register_complete') }}</span></button>\n" +
    "    </form>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('/templates/idm/social-login.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    "  <div id=\"login_view\">\n" +
    "    <a class=\"btn btn-default btn-block\" role=\"button\" ng-repeat=\"provider in providers\" ng-click=\"goToSocialLogin(provider)\">\n" +
    "   		<i class=\"fa fa-{{ provider.icon }}-square\" aria-hidden=\"true\"></i> {{ provider.name }}\n" +
    "    </a>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('/templates/idm/terms-and-conditions-modal.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    "	<div class=\"modal-header\">\n" +
    "	    <h3 class=\"modal-title\">{{ ::waid.config.getTranslation('idm', 'terms_and_condition_modal_title') }} <i class=\"glyphicon glyphicon-remove pull-right\" ng-click=\"waid.closeTermsAndConditionsModal()\"></i></h3>\n" +
    "	</div>\n" +
    "	<div class=\"modal-body\">\n" +
    "		<div ng-bind-html=\"document\"></div>\n" +
    "	</div>\n" +
    "	<div class=\"modal-footer\">\n" +
    "	    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"waid.closeTermsAndConditionsModal()\">{{ ::waid.config.getTranslation('idm', 'terms_and_condition_modal_close') }}</button>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('/templates/idm/user-profile-modal.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    "  <div class=\"modal-header\">\n" +
    "    <h3 class=\"modal-title\">Mijn Profiel<i class=\"glyphicon glyphicon-remove pull-right\" ng-click=\"waid.closeUserProfileModal()\"></i></h3>\n" +
    "  </div>\n" +
    "  <nav class=\"navbar navbar-default hidden-lg hidden-md hidden-sm\" ng-controller=\"WAIDIDMProfileNavbarCtrl\">\n" +
    "    <div class=\"container-fluid\">\n" +
    "      <!-- Brand and toggle get grouped for better mobile display -->\n" +
    "      <div class=\"navbar-header\" data-toggle=\"collapse\" data-target=\"#waid-profile-navbar\">\n" +
    "        <a class=\"navbar-brand\" href=\"#\" class=\"hidden-md\">Menu</a>\n" +
    "        <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#waid-profile-navbar\" aria-expanded=\"false\">\n" +
    "          <span class=\"sr-only\">Toggle navigation</span>\n" +
    "          <span class=\"icon-bar\"></span>\n" +
    "          <span class=\"icon-bar\"></span>\n" +
    "          <span class=\"icon-bar\"></span>\n" +
    "        </button>\n" +
    "      </div>\n" +
    "      <!-- Collect the nav links, forms, and other content for toggling -->\n" +
    "      <div class=\"collapse navbar-collapse\" id=\"waid-profile-navbar\">\n" +
    "        <ul class=\"nav navbar-nav\">\n" +
    "          <li ng-repeat=\"(groupName, menuItem) in fieldSet.groups\"><a ng-class=\"getActiveFieldSetMenuClass(menuItem.key)\" ng-click=\"goToFieldSet(menuItem.key)\" data-toggle=\"collapse\" data-target=\"#waid-profile-navbar\">{{ waid.config.getTranslation('idm', menuItem.key) }}</a></li>\n" +
    "          <li role=\"separator\" class=\"divider\"></li>\n" +
    "          <li><a href=\"#\" ng-click=\"waid.logout()\" class=\"visible-xs\" data-toggle=\"collapse\" data-target=\"#waid-profile-navbar\">Uitloggen</a>\n" +
    "        </ul>\n" +
    "      </div><!-- /.navbar-collapse -->\n" +
    "    </div><!-- /.container-fluid -->\n" +
    "  </nav>\n" +
    "  <div class=\"modal-body\">\n" +
    "     <waid-profile current-field-set=\"{{ currentFieldSet }}\"></waid-profile>\n" +
    "  </div>\n" +
    "  <div class=\"modal-footer\">\n" +
    "      <button class=\"btn btn-warning\" type=\"button\" ng-click=\"waid.closeUserProfileModal()\">Sluiten</button>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('/templates/idm/user-profile-navbar.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    "  <ul class=\"nav navbar-nav navbar-right\">\n" +
    "    <li class=\"dropdown\" ng-show=\"waid.user\">\n" +
    "      <a class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"true\" ng-cloak><span class=\"glyphicon glyphicon-user\"></span> Ingelogd als {{ waid.user.default_name }} <span class=\"caret\"></span></a>\n" +
    "      <ul class=\"dropdown-menu\">\n" +
    "        <li><a ng-click=\"waid.openUserProfileHome()\"><span class=\"glyphicon glyphicon-cog\"></span> Mijn Profiel</a></li>\n" +
    "        <li role=\"separator\" class=\"divider\"></li>\n" +
    "        <li><a href=\"#\" ng-click=\"waid.logout()\"><span class=\"glyphicon glyphicon-log-out\"></span> Uitloggen</a></li>\n" +
    "        <li><a href=\"#\" ng-click=\"waid.logoutAll()\"><span class=\"glyphicon glyphicon-new-window\"></span> Op alle systemen uitloggen</a></li>\n" +
    "      </ul>\n" +
    "    </li>\n" +
    "    <li ng-hide=\"waid.user\"><a ng-click=\"waid.openLoginAndRegisterHome()\"><span class=\"glyphicon glyphicon-log-in\"></span> Login of Registreer</a></li>\n" +
    "  </ul>\n" +
    "</div>"
  );


  $templateCache.put('/templates/idm/user-profile-status-button.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    "	<div class=\"btn-group\">\n" +
    "	  <button type=\"button\" class=\"btn btn-default btn-xs dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" ng-show=\"waid.user\">\n" +
    "	    <span class=\"glyphicon glyphicon-user\"></span> Ingelogd als {{ waid.user.default_name }}  <span class=\"caret\"></span>\n" +
    "	  </button>\n" +
    "	  <ul class=\"dropdown-menu\" ng-show=\"waid.user\">\n" +
    "	    <li><a ng-click=\"waid.openUserProfileHome()\"><span class=\"glyphicon glyphicon-cog\"></span> Mijn Profiel</a></li>\n" +
    "	    <li role=\"separator\" class=\"divider\"></li>\n" +
    "	    <li><a href=\"#\" ng-click=\"waid.logout()\"><span class=\"glyphicon glyphicon-log-out\"></span> Uitloggen</a></li>\n" +
    "	    <li><a href=\"#\" ng-click=\"waid.logoutAll()\"><span class=\"glyphicon glyphicon-new-window\"></span> Op alle systemen uitloggen</a></li>\n" +
    "	  </ul>\n" +
    "	</div>\n" +
    "	<button ng-hide=\"waid.user\" ng-click=\"waid.openLoginAndRegisterHome()\" class=\"btn btn-default btn-xs\">Login of Registreer</button>\n" +
    "	</div>\n" +
    "</div>"
  );


  $templateCache.put('/templates/rating/widget.html?v=0.0.49',
    "<div class=\"waid\">\n" +
    "  <span>Rate</span>\n" +
    "  <a href=\"#\" ng-repeat=\"star in stars\" ng-click=\"rate(star.value)\" ng-mouseover=\"rateOver(star.value)\" ng-mouseout=\"rateOut()\"><i class=\"glyphicon\" ng-class=\"star.active ? 'glyphicon-star' : 'glyphicon-star-empty'\"></i></a>\n" +
    "  <span ng-show=\"rating.total_votes > 1\">({{ rating.total_votes }} votes)</span>\n" +
    "</div>\n"
  );
}]);