angular.module('waid.templates',[]).run(['$templateCache', function($templateCache) { 
  'use strict';

  $templateCache.put('/comments/templates/comments-home.html',
    "<span class=\"waid\">\n" +
    "  <h3>{{ ::waid.config.getConfig('comments.translations.title') }}</h3>\n" +
    "  <blockquote ng-hide=\"waid.user\">\n" +
    "    <p>{{ ::waid.config.getConfig('comments.translations.notLoggedInText') }}</p>\n" +
    "  </blockquote>\n" +
    "\n" +
    "  <waid-comments-order-button ng-show=\"comments.length > 0\"></waid-comments-order-button>\n" +
    "  <waid-user-profile-status-button class=\"pull-right\"></waid-user-profile-status-button>\n" +
    "\n" +
    "  <div class=\"media\" ng-show=\"waid.user\">\n" +
    "    <div class=\"media-left\">\n" +
    "      \n" +
    "      <img class=\"media-object\" ng-src=\"{{ waid.user.avatar_thumb_50_50 }}\" alt=\"{{ waid.user.default_name }}\">\n" +
    "      \n" +
    "    </div>\n" +
    "    <div class=\"media-body\">\n" +
    "      <textarea class=\"form-control\" rows=\"3\" ng-model=\"comment.comment\" id=\"add_comment\" msd-elastic></textarea><br />\n" +
    "      <button type=\"button\" class=\"btn btn-default btn-xs pull-right\" ng-click=\"post()\">\n" +
    "          <span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span> {{ ::waid.config.getConfig('comments.translations.postCommentButton') }}\n" +
    "      </button> \n" +
    "      <button type=\"button\" class=\"btn btn-default btn-xs pull-left\" ng-click=\"waid.openEmoticonsModal('add_comment')\">\n" +
    "          😄&nbsp;Emoticon toevoegen\n" +
    "      </button> \n" +
    "      {{ currentEmoticonComment }}\n" +
    "    </div>\n" +
    "  </div>\n" +
    "    \n" +
    "    \n" +
    "    \n" +
    "  <div class=\"media\" ng-repeat=\"comment in comments\" style=\"overflow: visible;\" ng-show=\"comments\">\n" +
    "    <div class=\"media-left\">\n" +
    "      <img class=\"media-object\" ng-src=\"{{ comment.user.avatar_thumb_50_50 }}\" alt=\"{{ comment.user.default_name }}\">\n" +
    "    </div>\n" +
    "    <div class=\"media-body\" style=\"overflow: visible;\">\n" +
    "      <h4 class=\"media-heading\">{{ comment.user.default_name }}<br />\n" +
    "        <small>{{ comment.created | date:'medium' }}</small>\n" +
    "        <div class=\"btn-group pull-right\" ng-show=\"waid.user\">\n" +
    "          <button type=\"button\" class=\"btn btn-default btn-xs dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "            {{ ::waid.config.getConfig('comments.translations.actionDropdownTitle') }} <span class=\"caret\"></span>\n" +
    "          </button>\n" +
    "          <ul class=\"dropdown-menu\">\n" +
    "            <li><a ng-click=\"editComment(comment)\" ng-show=\"comment.is_owner\">\n" +
    "              <span class=\"glyphicon glyphicon-edit\" aria-hidden=\"true\"></span> {{ ::waid.config.getConfig('comments.translations.editCommentTitle') }}</a>\n" +
    "            </li>\n" +
    "            <li ng-show=\"!comment.marked_as_spam\"><a ng-click=\"markComment(comment, 'SPAM')\">\n" +
    "              <span class=\"glyphicon glyphicon-exclamation-sign aria-hidden=\"true\"></span> {{ ::waid.config.getConfig('comments.translations.markCommentSpamTitle') }}</a>\n" +
    "            </li>\n" +
    "            <li role=\"separator\" class=\"divider\" ng-show=\"comment.is_owner\"></li>\n" +
    "            <li><a ng-click=\"deleteComment(comment)\" ng-show=\"comment.is_owner\" confirm=\"{{ waid.config.getConfig('comments.translations.confirmDeleteContentBody') }}\" confirm-title=\"{{ waid.config.getConfig('comments.translations.confirmDeleteContentTitle') }}\">\n" +
    "              <span class=\"glyphicon glyphicon-remove-sign\" aria-hidden=\"true\"></span> {{ ::waid.config.getConfig('comments.translations.deleteCommentTitle') }}</a>\n" +
    "            </li>\n" +
    "          </ul>\n" +
    "        </div>\n" +
    "      </h4>\n" +
    "      <div ng-hide=\"comment.is_edit\">\n" +
    "        <p style=\"white-space: pre-wrap;\">{{ comment.comment_formatted }}</p>\n" +
    "        <div class=\"btn-group\" role=\"group\" aria-label=\"...\">\n" +
    "          <button type=\"button\" class=\"btn btn-default btn-xs\" ng-click=\"voteComment(comment, 'UP')\">\n" +
    "            <span class=\"glyphicon glyphicon-chevron-up\" aria-hidden=\"true\" ></span> {{ comment.vote_up_count }}\n" +
    "          </button>\n" +
    "          <button type=\"button\" class=\"btn btn-default btn-xs\" ng-click=\"voteComment(comment, 'DOWN')\">\n" +
    "            <span class=\"glyphicon glyphicon-chevron-down\" aria-hidden=\"true\"></span> {{ comment.vote_down_count }}\n" +
    "          </button>\n" +
    "        </div>\n" +
    "\n" +
    "        <small class=\"pull-right\" ng-show=\"comment.marked_as_spam\">\n" +
    "          <span class=\"glyphicon glyphicon-exclamation-sign aria-hidden=\"true\"></span> {{ ::waid.config.getConfig('comments.translations.commentMarkedAsSpam') }}\n" +
    "        </small>\n" +
    "      </div>\n" +
    "      <div ng-show=\"comment.is_edit\">\n" +
    "        <textarea class=\"form-control\" rows=\"1\" msd-elastic id=\"edit_comment_{{ comment.id }}\"ng-model=\"comment.comment_formatted\"></textarea>\n" +
    "        <p style=\"margin-top:10px;\">\n" +
    "        <button type=\"button\" class=\"btn btn-default btn-xs pull-right\" ng-click=\"updateComment(comment)\">\n" +
    "          <span class=\"glyphicon glyphicon-check\" aria-hidden=\"true\"></span> {{ ::waid.config.getConfig('comments.translations.updateCommentButton') }}\n" +
    "        </button>\n" +
    "        <button type=\"button\" class=\"btn btn-default btn-xs pull-left\"\" ng-click=\"waid.openEmoticonsModal('edit_comment_' + comment.id)\">\n" +
    "            😄 {{ ::waid.config.getConfig('comments.translations.addEmoticonButtonText') }}\n" +
    "        </button>\n" +
    "        </p>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "</span>"
  );


  $templateCache.put('/comments/templates/comments-order-button.html',
    "<span class=\"waid\">\n" +
    "  <div class=\"btn-group\">\n" +
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
    "  </div>\n" +
    "</span>"
  );


  $templateCache.put('/core/templates/core.html',
    "<span class=\"waid\" id=\"waid\"> \n" +
    "  <div growl></div>\n" +
    "\n" +
    "  <div class=\"loading\" ng-show=\"waid.checkLoading()\">\n" +
    "    <div class=\"loader\">\n" +
    "      <i class=\"fa fa-spinner fa-pulse fa-3x fa-fw\"></i>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</span>"
  );


  $templateCache.put('/core/templates/datepicker/datepicker.html',
    "<span class=\"waid\">\n" +
    "<div ng-switch=\"datepickerMode\" class=\"waid\">\n" +
    "  <div uib-daypicker ng-switch-when=\"day\" tabindex=\"0\" class=\"uib-daypicker\"></div>\n" +
    "  <div uib-monthpicker ng-switch-when=\"month\" tabindex=\"0\" class=\"uib-monthpicker\"></div>\n" +
    "  <div uib-yearpicker ng-switch-when=\"year\" tabindex=\"0\" class=\"uib-yearpicker\"></div>\n" +
    "</div>\n" +
    "</span>"
  );


  $templateCache.put('/core/templates/datepicker/day.html',
    "<span class=\"waid\">\n" +
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
    "</span>"
  );


  $templateCache.put('/core/templates/datepicker/month.html',
    "<span class=\"waid\">\n" +
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
    "</span>"
  );


  $templateCache.put('/core/templates/datepicker/year.html',
    "<span class=\"waid\">\n" +
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
    "</span>\n"
  );


  $templateCache.put('/core/templates/datepickerPopup/popup.html',
    "<span class=\"waid\">\n" +
    "<ul class=\"uib-datepicker-popup dropdown-menu uib-position-measure\" dropdown-nested ng-if=\"isOpen\" ng-keydown=\"keydown($event)\" ng-click=\"$event.stopPropagation()\">\n" +
    "  <li ng-transclude></li>\n" +
    "  <li ng-if=\"showButtonBar\" class=\"uib-button-bar\">\n" +
    "    <span class=\"btn-group pull-left\">\n" +
    "      <button type=\"button\" class=\"btn btn-sm btn-info uib-datepicker-current\" ng-click=\"select('today', $event)\" ng-disabled=\"isDisabled('today')\">{{ getText('current') }}</button>\n" +
    "      <button type=\"button\" class=\"btn btn-sm btn-danger uib-clear\" ng-click=\"select(null, $event)\">{{ getText('clear') }}</button>\n" +
    "    </span>\n" +
    "    <button type=\"button\" class=\"btn btn-sm btn-success pull-right uib-close\" ng-click=\"close($event)\">{{ getText('close') }}</button>\n" +
    "  </li>\n" +
    "</ul>\n" +
    "</span>\n"
  );


  $templateCache.put('/core/templates/emoticons-modal.html',
    "<span class=\"waid\">\n" +
    "	<div class=\"modal-header\">\n" +
    "	  <h3 class=\"modal-title\">Emoticons</h3>\n" +
    "	</div>\n" +
    "	<div class=\"modal-body\">\n" +
    "	<div ng-repeat=\"(key, group) in emoticons\">\n" +
    "		<h4>{{ waid.config.getConfig('core.translations.emoticons.' + key) }}</h4>\n" +
    "		<p>\n" +
    "		<span class=\"emoticon_select\" ng-repeat=\"emoticon in group track by $index\" ng-click=\"waid.addEmoticon(emoticon)\">{{ emoticon }}</span>\n" +
    "		</p>\n" +
    "	</div>\n" +
    "	</div>\n" +
    "	<div class=\"modal-footer\">\n" +
    "	    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"waid.closeEmoticonsModal()\">Sluiten</button>\n" +
    "	</div>\n" +
    "</span>"
  );


  $templateCache.put('/core/templates/modal/window.html',
    "<div class=\"waid modal-dialog {{size ? 'modal-' + size : ''}}\"><div class=\"modal-content\" uib-modal-transclude></div></div>\n"
  );


  $templateCache.put('/idm/templates/complete-profile.html',
    "<span class=\"waid\">\n" +
    "	<div class=\"modal-header\">\n" +
    "	  <h3 class=\"modal-title\">Bevestig uw gegevens</h3>\n" +
    "	</div>\n" +
    "	<div class=\"modal-body\">\n" +
    "	  <ng-include src=\"'/idm/templates/register.html'\" ng-init=\"modus = 'complete'\"></ng-include>\n" +
    "	</div>\n" +
    "	<div class=\"modal-footer\">\n" +
    "	  <button class=\"btn btn-warning\" type=\"button\" ng-click=\"waid.logout()\">Niet verdergaan en uitloggen</button>\n" +
    "	</div>\n" +
    "</span>"
  );


  $templateCache.put('/idm/templates/home.html',
    ""
  );


  $templateCache.put('/idm/templates/login-and-register-home.html',
    "<span class=\"waid\">\n" +
    "    <div class=\"row\">\n" +
    "      <div class=\"col-md-4\">\n" +
    "        <h3>Social login/registratie</h3>\n" +
    "        <p>Social login zorgt ervoor dat je snel kan aanmelden met jouw social media account.</p>\n" +
    "        <p>Je word doorverwezen naar de social account met verdere informatie en instructies.</p>\n" +
    "        <p>Zodra je daar akkoord geeft word je weer doorverwezen naar deze site en is jouw account aangemaakt!</p>\n" +
    "        <ng-include src=\"'/idm/templates/social-login.html'\"></ng-include>\n" +
    "      </div>\n" +
    "      <div class=\"col-md-4\">\n" +
    "        <h3>Login</h3>\n" +
    "        <ng-include src=\"'/idm/templates/login.html'\"></ng-include>\n" +
    "      </div>\n" +
    "      \n" +
    "      <div class=\"col-md-4\">\n" +
    "        <h3>Registreren</h3>\n" +
    "        <ng-include src=\"'/idm/templates/register.html'\"></ng-include>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "</span>"
  );


  $templateCache.put('/idm/templates/login-and-register-modal.html',
    "<span class=\"waid\">\n" +
    "	<div class=\"modal-header\">\n" +
    "	  <h3 class=\"modal-title\">Inloggen of registreren <i class=\"glyphicon glyphicon-remove pull-right\" ng-click=\"waid.closeLoginAndRegisterModal()\"></i></h3>\n" +
    "	</div>\n" +
    "	<div class=\"modal-body\">\n" +
    "	   <ng-include src=\"'/idm/templates/login-and-register-home.html'\"></ng-include>\n" +
    "	</div>\n" +
    "	<div class=\"modal-footer\">\n" +
    "	    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"waid.closeLoginAndRegisterModal()\">Sluiten</button>\n" +
    "	</div>\n" +
    "</span>"
  );


  $templateCache.put('/idm/templates/login.html',
    "<span class=\"waid\">\n" +
    "  <div id=\"login_view\" ng-controller=\"WAIDIDMLoginCtrl\">\n" +
    "    <form role=\"form\"  name=\"loginForm\" novalidate>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"id_username\">Gebruikersnaam</label>\n" +
    "        <input name=\"username\" id=\"id_username\" type=\"text\" ng-model=\"model.username\" placeholder=\"Username\" class=\"form-control\" required />\n" +
    "      </div>\n" +
    "      <div class=\"alert alert-danger\" ng-repeat=\"error in errors.username\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ error }}</div>\n" +
    "      <div class=\"form-group\">\n" +
    "        <label for=\"id_password\">Password</label>\n" +
    "        <input name=\"password\" id=\"id_password\" type=\"password\" ng-model=\"model.password\" placeholder=\"Password\" class=\"form-control\" required />\n" +
    "      </div>\n" +
    "      <div class=\"alert alert-danger\" ng-repeat=\"error in errors.password\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ error }}</div>\n" +
    "      <div class=\"alert alert-danger\" ng-repeat=\"error in errors.non_field_errors\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ error }}</div>\n" +
    "      <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"login()\">Inloggen</button>\n" +
    "    </form>\n" +
    "    <br />\n" +
    "    <a ng-click=\"waid.openLostLoginModal()\">Login gegevens kwijt?</a>\n" +
    "\n" +
    "  </div>\n" +
    "</span>"
  );


  $templateCache.put('/idm/templates/lost-login-modal.html',
    "<span class=\"waid\">\n" +
    "	<div class=\"modal-header\">\n" +
    "	  <h3 class=\"modal-title\">Login gegevens kwijt?<i class=\"glyphicon glyphicon-remove pull-right\" ng-click=\"waid.closeLostLoginModal()\"></i></h3>\n" +
    "	</div>\n" +
    "	<div class=\"modal-body\">\n" +
    "	  <ng-include src=\"'/idm/templates/lost-login.html'\"></ng-include>\n" +
    "	</div>\n" +
    "	<div class=\"modal-footer\">\n" +
    "	    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"waid.closeLostLoginModal()\">Sluiten</button>\n" +
    "	</div>\n" +
    "</span>"
  );


  $templateCache.put('/idm/templates/lost-login.html',
    "<span class=\"waid\">\n" +
    "	<div id=\"lost_login_view\" ng-controller=\"WAIDIDMLostLoginCtrl\">\n" +
    "	<form role=\"form\" name=\"loginForm\" novalidate>\n" +
    "	  <div class=\"form-group\">\n" +
    "	    <label for=\"id_email\">E-mail</label>\n" +
    "	    <input name=\"username\" id=\"id_email\" type=\"text\" ng-model=\"model.email\" placeholder=\"Email\" class=\"form-control\" required />\n" +
    "	  </div>\n" +
    "	  <div class=\"alert alert-danger\" ng-repeat=\"error in errors.email\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ error }}</div>\n" +
    "\n" +
    "	  <div class=\"alert alert-danger\" ng-repeat=\"error in errors.non_field_errors\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ error }}</div>\n" +
    "	  <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"submit()\">Inlog gegevens ophalen</button>\n" +
    "	</form>\n" +
    "	</div>\n" +
    "</span>\n" +
    "  "
  );


  $templateCache.put('/idm/templates/register.html',
    "<span class=\"waid\">\n" +
    " <div ng-controller=\"WAIDIDMRegisterCtrl\">\n" +
    "      <div ng-show=\"modus=='complete'\" class=\"alert alert-warning\" ng-show=\"missingEmailVerification\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ waid.config.getConfig('idm.translations.complete_profile_intro') }}</div>\n" +
    "\n" +
    "      <div class=\"alert alert-warning\" ng-show=\"missingEmailVerification\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> Er was al een bevestigings e-mail naar je toe gestuurd. Heb je deze niet ontvangen? voer opnieuw een geldig e-mail adres in en dan word er een nieuwe activatie link toegestuurd.</div>\n" +
    "    <form role=\"form\" name=\"registerForm\" novalidate>\n" +
    "      <div class=\"form-group\" ng-show=\"show.username\">\n" +
    "          <label for=\"id_username\">Username</label>\n" +
    "          <input name=\"username\" id=\"id_username\" class=\"form-control\" type=\"text\" ng-model=\"model.username\" placeholder=\"Username\" required />\n" +
    "      </div>\n" +
    "      <div class=\"alert alert-danger\" ng-repeat=\"error in errors.username\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "      <div class=\"form-group\" ng-show=\"show.password\">\n" +
    "          <label for=\"id_password\">Password</label>\n" +
    "          <input name=\"password1\" id=\"id_password\" class=\"form-control\" type=\"password\" ng-model=\"model.password\" placeholder=\"Password\" required />\n" +
    "      </div>\n" +
    "      <div class=\"alert alert-danger\" ng-repeat=\"error in errors.password\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "      <div class=\"form-group\" ng-show=\"show.email\">\n" +
    "          <label for=\"id_email\">Email</label>\n" +
    "          <input name=\"email\" id=\"id_email\" class=\"form-control\" type=\"email\" ng-model=\"model.email\" placeholder=\"Email\" required />\n" +
    "      </div>\n" +
    "      <div class=\"alert alert-danger\" ng-repeat=\"error in errors.email\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "      <div class=\"checkbox\" ng-show=\"show.terms_and_conditions_check\">\n" +
    "        <label>\n" +
    "          <input type=\"checkbox\" ng-model=\"model.terms_and_conditions_check\"> Ik ga akkoord met de <a ng-click=\"waid.openTermsAndConditionsModal()\">algemene voorwaarden</a>.\n" +
    "        </label>\n" +
    "      </div>\n" +
    "      <div class=\"alert alert-danger\" ng-repeat=\"error in errors.terms_and_conditions_check\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "      <div class=\"alert alert-danger\" ng-repeat=\"error in errors.non_field_errors\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "\n" +
    "      <button ng-disabled=\"!model.terms_and_conditions_check\" type=\"submit\" class=\"btn btn-primary\" ng-click=\"register()\"><span ng-show=\"modus!='complete'\">Registreren</span><span ng-show=\"modus=='complete'\">Registratie afronden</span></button>\n" +
    "\n" +
    "    </form>\n" +
    "  </div>\n" +
    "</span>"
  );


  $templateCache.put('/idm/templates/social-login.html',
    "<span class=\"waid\">\n" +
    "  <div id=\"login_view\" ng-controller=\"WAIDIDMSocialCtrl\">\n" +
    "    <a class=\"btn btn-default\" role=\"button\" ng-repeat=\"provider in providers\" ng-click=\"goToSocialLogin(provider)\">{{ provider.backend }}</a>\n" +
    "  </div>\n" +
    "</span>"
  );


  $templateCache.put('/idm/templates/terms-and-conditions-modal.html',
    "<span class=\"waid\">\n" +
    "	<div class=\"modal-header\">\n" +
    "	    <h3 class=\"modal-title\">Algemene voorwaarden<i class=\"glyphicon glyphicon-remove pull-right\" ng-click=\"waid.closeTermsAndConditionsModal()\"></i></h3>\n" +
    "	</div>\n" +
    "	<div class=\"modal-body\">\n" +
    "	  	<p ng-show=\"waid.application.terms_and_conditions.length > 0\" ng-bind-html=\"waid.application.terms_and_conditions\"></p>\n" +
    "	    <p ng-hide=\"waid.application.terms_and_conditions.length > 0\"><b>WhoAmID</b> besteedt continue zorg en aandacht aan de samenstelling van de inhoud op onze sites. Op onze sites worden diverse interactiemogelijkheden aangeboden. De redactie bekijkt de berichten en reacties, die naar onze fora worden gestuurd niet vooraf - tenzij uitdrukkelijk anders aangegeven. Berichten die evident onrechtmatig zijn, worden zo spoedig mogelijk verwijderd. Het kan evenwel voorkomen dat u dergelijke berichten korte tijd aantreft. Wij distantiÃ«ren ons nadrukkelijk van deze berichten en verontschuldigen ons er bij voorbaat voor. Het is mogelijk dat de informatie die op de sites wordt gepubliceerd onvolledig is of onjuistheden bevat. Het is niet altijd mogelijk fouten te voorkomen. WhoAmID is niet verantwoordelijk voor meningen en boodschappen van gebruikers van (forum)pagina's. De meningen en boodschappen op de forumpagina's geven niet de mening of het beleid van WhoAmID weer. Ditzelfde geldt voor informatie van derden waarvan u via links op onze websites kennisneemt. Wij sluiten alle aansprakelijkheid uit voor enigerlei directe of indirecte schade, van welke aard dan ook, die voortvloeit uit het gebruik van informatie die op of via onze websites is verkregen. WhoAmID behoudt zich het recht voor - tenzij schriftelijk anders overeengekomen met de auteur - ingezonden materiaal te verwijderen in te korten en/of aan te passen. Dit geldt zowel voor tekst als muziek- en beeldmateriaal. Deze website is alleen bedoeld voor eigen raadpleging via normaal browser-bezoek. Het is derhalve niet toegestaan om de website op geautomatiseerde wijze te (laten) raadplegen, bijvoorbeeld via scripts, spiders en/of bots. Eventuele hyperlinks dienen bezoekers rechtstreeks te leiden naar de context, waarbinnen de publieke omroep content aanbiedt. Video- en audiostreams mogen bijvoorbeeld alleen worden vertoond via een link naar een omroeppagina of embedded omroepplayer. Overneming, inframing, herpublicatie, bewerking of toevoeging zijn niet toegestaan. Eveneens is het niet toegestaan technische beveiligingen te omzeilen of te verwijderen, of dit voor anderen mogelijk te maken. WhoAmID kan besluiten (delen van ) bijdragen van gebruikers op internetsites te publiceren c.q. over te nemen in andere media, bijvoorbeeld maar niet beperkt tot televisie, radio, internetsites, mobiele informatiedragers en printmedia. Door bijdragen te leveren op fora en andere WhoAmID vergelijkbare internetsites stemmen bezoekers op voorhand onvoorwaardelijk en eeuwigdurend in met bovengenoemd gebruik van (delen van) hun bijdragen. Wanneer rechtens komt vast te staan dat WhoAmID daartoe gehouden is, zal WhoAmID mogen overgaan tot het aan derde(n) verstrekken van naam, adres, woonplaats of ip-nummer van een bezoeker/gebruiker.</p>\n" +
    "	  \n" +
    "	</div>\n" +
    "	<div class=\"modal-footer\">\n" +
    "	    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"waid.closeTermsAndConditionsModal()\">Sluiten</button>\n" +
    "	</div>\n" +
    "</span>"
  );


  $templateCache.put('/idm/templates/user-profile-home.html',
    "<span class=\"waid\">\n" +
    "\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "  <div class=\"col-lg-4 col-md-4 col-sm-4 hidden-sm hidden-xs\">\n" +
    "    <ng-include src=\"'/idm/templates/user-profile-menu.html'\"></ng-include>\n" +
    "  </div>\n" +
    "  <div class=\"col-lg-8 col-md-8 col-sm-12 col-xs-12\">\n" +
    "\n" +
    "    <div ng-show=\"showProfilePage('overview')\" ng-controller=\"WAIDIDMUserProfileOverviewCtrl\">\n" +
    "      <div>\n" +
    "        \n" +
    "        <h3>Overzicht</h3>\n" +
    "        <dl class=\"dl-horizontal\">\n" +
    "          <dt>Avatar</dt>\n" +
    "          <dd><img ng-show=\"model.avatar_thumb_50_50\" ng-src=\"{{ model.avatar_thumb_50_50 }}\"></dd>\n" +
    "        </dl>\n" +
    "        <dl class=\"dl-horizontal\">\n" +
    "          <dt>Nickname</dt>\n" +
    "          <dd>{{ model.display_name }}</dd>\n" +
    "        </dl>\n" +
    "        <dl class=\"dl-horizontal\">\n" +
    "          <dt>Geboortedatum</dt>\n" +
    "          <dd>{{ model.date_of_birth | date:'longDate' }}</dd>\n" +
    "        </dl>\n" +
    "        <dl class=\"dl-horizontal\">\n" +
    "          <dt>Geslacht</dt>\n" +
    "          <dd><span ng-show=\"model.gender=='F'\">{{ waid.config.getConfig('idm.translations.female') }}</span><span ng-show=\"model.gender=='M'\">{{ waid.config.getConfig('idm.translations.male') }}</span></dd>\n" +
    "        </dl>\n" +
    "        <a class=\"btn btn-default btn-block\" ng-click=\"goToProfilePage('main')\"><i class=\"fa fa-pencil-square-o\" aria-hidden=\"true\"></i> Algemene gegevens aanpassen</a>\n" +
    "      </div>\n" +
    "      \n" +
    "\n" +
    "      <div>\n" +
    "        <h3>Interesses</h3>\n" +
    "        <dl class=\"dl-horizontal\">\n" +
    "          <dt>Leuk</dt>\n" +
    "          <dd>{{ model.like_tags }}</dd>\n" +
    "        </dl>\n" +
    "        <dl class=\"dl-horizontal\">\n" +
    "          <dt>Niet leuk</dt>\n" +
    "          <dd>{{ model.dislike_tags }}</dd>\n" +
    "        </dl>\n" +
    "        <a class=\"btn btn-default btn-block\" ng-click=\"goToProfilePage('interests')\"><i class=\"fa fa-pencil-square-o\" aria-hidden=\"true\"></i> Interesses aanpassen</a>\n" +
    "      </div>\n" +
    "\n" +
    "      <div>\n" +
    "        <h3>E-mail adressen</h3>\n" +
    "        <dl class=\"dl-horizontal\" ng-repeat=\"email in emails\">\n" +
    "          <dt>\n" +
    "            <span class=\"glyphicon glyphicon-eye-close text-danger\" ng-show=\"!email.is_verified\"></span>\n" +
    "            <span class=\"glyphicon glyphicon-ok text-success\" ng-show=\"email.is_verified\"></span>\n" +
    "          </dt>\n" +
    "          <dd>{{ email.email }}</dd>\n" +
    "        </dl>\n" +
    "        <a class=\"btn btn-default btn-block\" ng-click=\"goToProfilePage('emails')\"><i class=\"fa fa-pencil-square-o\" aria-hidden=\"true\"></i> E-mail adressen aanpassen</a>\n" +
    "      </div>\n" +
    "\n" +
    "      <div>\n" +
    "        <h3>Gebruikersnaam</h3>\n" +
    "        <dl class=\"dl-horizontal\">\n" +
    "          <dt>Gebruikersnaam</dt>\n" +
    "          <dd>{{ model.username }}</dd>\n" +
    "        </dl>\n" +
    "        <a class=\"btn btn-default btn-block\" ng-click=\"goToProfilePage('username')\"><i class=\"fa fa-pencil-square-o\" aria-hidden=\"true\"></i> Login aanpassen</a>\n" +
    "      </div>\n" +
    "\n" +
    "      <div>\n" +
    "        <h3>Wachtwoord</h3>\n" +
    "        <dl class=\"dl-horizontal\">\n" +
    "          <dt>Wachtwoord</dt>\n" +
    "          <dd>******</dd>\n" +
    "        </dl>\n" +
    "        <a class=\"btn btn-default btn-block\" ng-click=\"goToProfilePage('password')\"> <i class=\"fa fa-pencil-square-o\" aria-hidden=\"true\"></i> Wachtwoord aanpassen</a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div ng-show=\"showProfilePage('emails')\" ng-controller=\"WAIDIDMUserProfileEmailCtrl\">\n" +
    "      <div>\n" +
    "        <h3>E-Mail adresses</h3>\n" +
    "          <div class=\"input-group input-group-sm\">\n" +
    "            <input type=\"add_email\" class=\"form-control\" id=\"add_email\" placeholder=\"Email\" ng-model=\"emailAdd\">\n" +
    "            <span class=\"input-group-btn\">\n" +
    "              <button class=\"btn btn-default\" type=\"button\" ng-click=\"addEmail()\">Toevoegen</button>\n" +
    "            </span>\n" +
    "          </div>\n" +
    "            \n" +
    "            \n" +
    "          <div class=\"alert alert-danger\" ng-repeat=\"error in errors.email\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "     \n" +
    "          <div ng-show=\"inactiveEmails.length > 0\">\n" +
    "            <h4><span class=\"glyphicon glyphicon-eye-close text-danger\"></span> Nog te valideren e-mail adressen</h4>\n" +
    "            <p>Onderstaande e-mail adressen dienen nog te worden gecontroleerd. Er is een mail gestuurd naar het adres met een activatie link. Als je deze niet hebt ontvangen kan je het email adres verwijderen en een nieuwe toevoegen</p> \n" +
    "            <ul class=\"list-group\">\n" +
    "              <li class=\"list-group-item\" ng-repeat=\"row in inactiveEmails track by row.id\">\n" +
    "                <span class=\"glyphicon glyphicon-chevron-right\"></span>\n" +
    "                {{ row.email }}\n" +
    "                 <button class=\"btn btn-default btn-xs pull-right\" type=\"button\" ng-click=\"deleteEmail(row.id)\" confirm=\"{{ row.email }} verwijderen ?\"><span class=\"glyphicon glyphicon-remove text-danger\"></span> Verwijderen</button>\n" +
    "              </li>\n" +
    "            </ul>\n" +
    "          </div>\n" +
    "\n" +
    "          <div ng-show=\"activeEmails.length > 0\">\n" +
    "            <h4><span class=\"glyphicon glyphicon-ok text-success\"></span> Gevalideerde e-mail adressen</h4>\n" +
    "            <p>De e-mail adressen hieronder zijn geactiveerd. Deze e-mail adressen worden gebruikt om systeemberichten zoals activatie en notificatie mails naar u toe te sturen.</p>\n" +
    "            <ul class=\"list-group\">\n" +
    "              <li class=\"list-group-item\" ng-repeat=\"row in activeEmails track by row.id\">\n" +
    "                <span class=\"glyphicon glyphicon-chevron-right\"></span>\n" +
    "                {{ row.email }}\n" +
    "                 <button class=\"btn btn-default btn-xs pull-right\" type=\"button\" ng-click=\"deleteEmail(row.id)\" confirm=\"{{ row.email }} verwijderen ?\"><span class=\"glyphicon glyphicon-remove text-danger\"></span> Verwijderen</button>\n" +
    "              </li>\n" +
    "            </ul>\n" +
    "          </div>\n" +
    "\n" +
    "          <div ng-show=\"activeEmails.length == 0 && inactiveEmails.length == 0 \">\n" +
    "          <h4><span class=\"glyphicon glyphicon-zoom-in\"></span> Geen e-mail adressen bekend</h4>\n" +
    "          <p>Er zijn nog geen e-mail adressen bekend. Voeg hierboven een e-mail adres toe. Je ontvangt een bevestigings e-mail ter verificatie.</p>\n" +
    "          </div>\n" +
    "          <div class=\"alert alert-danger\" ng-if=\"errors.detail\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{errors.detail}}</div> <br />  \n" +
    "          <a class=\"btn btn-default btn-block\" ng-click=\"goToProfilePage('overview')\">\n" +
    "          <i class=\"glyphicon glyphicon-chevron-left\" aria-hidden=\"true\"></i> Naar overzicht</a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div ng-show=\"showProfilePage('main')\" ng-controller=\"WAIDIDMUserProfileMainCtrl\">\n" +
    "      <div>\n" +
    "        <h3>Algemene gegevens</h3>\n" +
    "        <form>\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"username\">Weergave naam</label>\n" +
    "            <input type=\"input\" class=\"form-control\" id=\"display_name\" placeholder=\"Weergave naam\" ng-model=\"model.display_name\">\n" +
    "          </div>\n" +
    "          <div class=\"alert alert-danger\" ng-repeat=\"error in errors.display_name\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"date_of_birth\">Geboortedatum</label>\n" +
    "\n" +
    "            <div class=\"input-group\">\n" +
    "              <input type=\"text\" class=\"form-control\" id=\"date_of_birth\" uib-datepicker-popup ng-model=\"profileDate\" is-open=\"popup.opened\" datepicker-options=\"dateOptions\" close-text=\"Close\" />\n" +
    "              <span class=\"input-group-btn\">\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-click=\"open()\"><i class=\"glyphicon glyphicon-calendar\"></i></button>\n" +
    "              </span>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"alert alert-danger\" ng-repeat=\"error in errors.date_of_birth\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "          \n" +
    "          <div class=\"form-group\">\n" +
    "            <label>Geslacht</label><br />\n" +
    "            <label class=\"radio-inline\">\n" +
    "              <input type=\"radio\" ng-model=\"model.gender\" value=\"M\"> {{ waid.config.getConfig('idm.translations.male') }}\n" +
    "            </label>\n" +
    "            <label class=\"radio-inline\">\n" +
    "              <input type=\"radio\" ng-model=\"model.gender\" value=\"F\"> {{ waid.config.getConfig('idm.translations.female') }}\n" +
    "            </label>\n" +
    "          </div>\n" +
    "          <div class=\"alert alert-danger\" ng-repeat=\"error in errors.gender\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "\n" +
    "\n" +
    "          <div class=\"form-group\">\n" +
    "            <label>Avatar</label><br />\n" +
    "            <img ng-show=\"model.avatar_thumb_50_50\" ng-src=\"{{ model.avatar_thumb_50_50 }}\" />\n" +
    "            <div ng-show=\"isUploading\" class=\"alert alert-info\" role=\"alert\">Bezig met uploaden van foto.</div>\n" +
    "            <input type=\"file\" class=\"form-control\" id=\"avatar\" placeholder=\"Avatar\" onchange=\"angular.element(this).scope().uploadFile(this.files)\">\n" +
    "            \n" +
    "           \n" +
    "          </div>\n" +
    "          <div class=\"alert alert-danger\" ng-repeat=\"error in errors.avatar\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "\n" +
    "\n" +
    "          <button type=\"submit\" class=\"btn btn-default btn-block\" ng-click=\"save()\"><i class=\"fa fa-floppy-o\" aria-hidden=\"true\"></i> Opslaan</button>\n" +
    "        </form>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"showProfilePage('interests')\" ng-controller=\"WAIDIDMUserProfileInterestsCtrl\">\n" +
    "      <div>\n" +
    "        <h3>Interesses</h3>\n" +
    "        <p>Om de kwaliteit en gebruiksvriendelijkheid te verbeteren willen we graag weten waar jouw interesses liggen.\n" +
    "        Uiteraart is dit niet verplicht maar we stellen het wel op prijs!</p>\n" +
    "        <form>\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"like_taks\">Wat vind je leuk?</label>\n" +
    "            <textarea class=\"form-control\" rows=\"3\" id=\"like_tags\" ng-model=\"model.like_tags\" msd-elastic></textarea>\n" +
    "            <p class=\"help-block\">Probeer in kernwoorden te antwoorden, dus : vakantie,bali,fietsen,muziek,autos,audi etc... We proberen interessante content met deze woorden voor u te selecteren.</p>\n" +
    "          </div>\n" +
    "          <div class=\"alert alert-danger\" ng-repeat=\"error in errors.like_tags\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"dislike_tags\">Wat vind je echt niet leuk?</label>\n" +
    "            <textarea class=\"form-control\" rows=\"3\" id=\"dislike_tags\" ng-model=\"model.dislike_tags\" msd-elastic></textarea>\n" +
    "            <p class=\"help-block\">Probeer in kernwoorden te antwoorden, dus : drank, drugs etc.. We proberen content met deze woorden voor jou te filteren.</p>\n" +
    "          </div>\n" +
    "          <div class=\"alert alert-danger\" ng-repeat=\"error in errors.dislike_tags\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "          <button type=\"submit\" class=\"btn btn-default btn-block\" ng-click=\"save()\"><i class=\"fa fa-floppy-o\" aria-hidden=\"true\"></i> Opslaan</button>\n" +
    "        </form>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div ng-show=\"showProfilePage('username')\" ng-controller=\"WAIDIDMUserProfileUsernameCtrl\">\n" +
    "      <div>\n" +
    "        <h3>Gebruikersnaam</h3>\n" +
    "        <form>\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"username\">Gebruikersnaam</label>\n" +
    "            <input type=\"input\" class=\"form-control\" id=\"username\" placeholder=\"Gebruikersnaam\" ng-model=\"model.username\">\n" +
    "          </div>\n" +
    "          <div class=\"alert alert-danger\" ng-repeat=\"error in errors.username\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "          <button type=\"submit\" class=\"btn btn-default btn-block\" ng-click=\"save()\"><i class=\"fa fa-floppy-o\" aria-hidden=\"true\"></i> Opslaan</button>\n" +
    "        </form>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div ng-show=\"showProfilePage('password')\" ng-controller=\"WAIDIDMUserProfilePasswordCtrl\">\n" +
    "      <div>\n" +
    "        <h3>wachtwoord wijzigen</h3>\n" +
    "        <form>\n" +
    "            <div class=\"form-group\">\n" +
    "              <label for=\"password\">Wachtwoord</label>\n" +
    "              <input type=\"password\" class=\"form-control\" id=\"password\" placeholder=\"Password\" ng-model=\"model.password\">\n" +
    "            </div>\n" +
    "            <div class=\"alert alert-danger\" ng-repeat=\"error in errors.password\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "              <label for=\"password_confirm\">Wachtwoord bevestiging</label>\n" +
    "              <input type=\"password\" class=\"form-control\" id=\"password_confirm\" placeholder=\"Password confirm\" ng-model=\"model.password_confirm\">\n" +
    "            </div>\n" +
    "            <div class=\"alert alert-danger\" ng-repeat=\"error in errors.password_confirm\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "\n" +
    "            <div class=\"alert alert-danger\" ng-repeat=\"error in errors.non_field_errors\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "            <button type=\"submit\" class=\"btn btn-default btn-block\" ng-click=\"save()\"><i class=\"fa fa-floppy-o\" aria-hidden=\"true\"></i> Opslaan</button>\n" +
    "          </form>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "</span>"
  );


  $templateCache.put('/idm/templates/user-profile-menu.html',
    "<span class=\"waid\">\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "<ul class=\"nav nav-pills nav-stacked\">\n" +
    "  <li role=\"presentation\" ng-class=\"getActiveProfilePageMenuClass('overview')\"><a ng-click=\"goToProfilePage('overview')\">Overzicht</a></li>\n" +
    "  <li role=\"presentation\" ng-class=\"getActiveProfilePageMenuClass('main')\"><a ng-click=\"goToProfilePage('main')\">Algemeen</a></li>\n" +
    "  <li role=\"presentation\" ng-class=\"getActiveProfilePageMenuClass('interests')\"><a ng-click=\"goToProfilePage('interests')\">Interesses</a></li>\n" +
    "  <li role=\"presentation\" ng-class=\"getActiveProfilePageMenuClass('emails')\"><a ng-click=\"goToProfilePage('emails')\">E-Mail adressen</a></li>\n" +
    "  <li role=\"presentation\" ng-class=\"getActiveProfilePageMenuClass('username')\"><a ng-click=\"goToProfilePage('username')\">Gebruikersnaam</a></li>\n" +
    "  <li role=\"presentation\" ng-class=\"getActiveProfilePageMenuClass('password')\"><a ng-click=\"goToProfilePage('password')\">Wachtwoord</a></li>\n" +
    "  <li role=\"presentation\" ng-click=\"waid.logout()\"><a>Uitloggen</a></li>\n" +
    "</ul>\n" +
    "\n" +
    "</span>"
  );


  $templateCache.put('/idm/templates/user-profile-modal.html',
    "<span class=\"waid\" ng-controller=\"WAIDIDMUserProfileHomeCtrl\">\n" +
    "<div class=\"modal-header\">\n" +
    "  <h3 class=\"modal-title\">Profiel<i class=\"glyphicon glyphicon-remove pull-right\" ng-click=\"waid.closeUserProfileModal()\"></i></h3>\n" +
    "</div>\n" +
    "<nav class=\"navbar navbar-default hidden-lg hidden-md\">\n" +
    "  <div class=\"container-fluid\">\n" +
    "    <!-- Brand and toggle get grouped for better mobile display -->\n" +
    "    <div class=\"navbar-header\" data-toggle=\"collapse\" data-target=\"#waid-profile-navbar\">\n" +
    "      <a class=\"navbar-brand\" href=\"#\" class=\"hidden-md\">Menu</a>\n" +
    "      <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#waid-profile-navbar\" aria-expanded=\"false\">\n" +
    "        <span class=\"sr-only\">Toggle navigation</span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "        <span class=\"icon-bar\"></span>\n" +
    "      </button>\n" +
    "    </div>\n" +
    "    <!-- Collect the nav links, forms, and other content for toggling -->\n" +
    "    <div class=\"collapse navbar-collapse\" id=\"waid-profile-navbar\">\n" +
    "      <ul class=\"nav navbar-nav\">\n" +
    "	    <li><a ng-class=\"getActiveProfilePageMenuClass('overview')\" ng-click=\"goToProfilePage('overview')\" data-toggle=\"collapse\" data-target=\"#waid-profile-navbar\">Overzicht</a></li>\n" +
    "	    <li><a ng-class=\"getActiveProfilePageMenuClass('main')\" ng-click=\"goToProfilePage('main')\" data-toggle=\"collapse\" data-target=\"#waid-profile-navbar\">Algemeen</a></li>\n" +
    "	    <li><a ng-class=\"getActiveProfilePageMenuClass('interests')\" ng-click=\"goToProfilePage('interests')\" data-toggle=\"collapse\" data-target=\"#waid-profile-navbar\">Interesses</a></li>\n" +
    "	    <li><a ng-class=\"getActiveProfilePageMenuClass('emails')\" ng-click=\"goToProfilePage('emails')\" data-toggle=\"collapse\" data-target=\"#waid-profile-navbar\">E-Mail adressen</a></li>\n" +
    "\n" +
    "        <li><a ng-class=\"getActiveProfilePageMenuClass('username')\" ng-click=\"goToProfilePage('username')\"\" data-toggle=\"collapse\" data-target=\"#waid-profile-navbar\">Gebruikersnaam</a></li>\n" +
    "        <li><a ng-class=\"getActiveProfilePageMenuClass('password')\" ng-click=\"goToProfilePage('password')\" data-toggle=\"collapse\" data-target=\"#waid-profile-navbar\" >Wachtwoord</a></li>\n" +
    "        <li role=\"separator\" class=\"divider\"></li>\n" +
    "        <li><a href=\"#\" ng-click=\"waid.logout()\" class=\"visible-xs\" data-toggle=\"collapse\" data-target=\"#waid-profile-navbar\">Uitloggen</a>\n" +
    "      </ul>\n" +
    "    </div><!-- /.navbar-collapse -->\n" +
    "  </div><!-- /.container-fluid -->\n" +
    "</nav>\n" +
    "<div class=\"modal-body\">\n" +
    "   <ng-include src=\"'/idm/templates/user-profile-home.html'\"></ng-include>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"waid.closeUserProfileModal()\">Sluiten</button>\n" +
    "</div>\n" +
    "</span>"
  );


  $templateCache.put('/idm/templates/user-profile-navbar.html',
    "<span class=\"waid\">\n" +
    "  <ul class=\"nav navbar-nav navbar-right\">\n" +
    "    <li class=\"dropdown\" ng-show=\"waid.user\">\n" +
    "      <a class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"true\" ng-cloak><span class=\"glyphicon glyphicon-user\"></span> Ingelogd als {{ waid.user.default_name }} <span class=\"caret\"></span></a>\n" +
    "      <ul class=\"dropdown-menu\">\n" +
    "        <li><a ng-click=\"waid.openUserProfileHomeModal()\"><span class=\"glyphicon glyphicon-cog\"></span> Profiel</a></li>\n" +
    "        <li role=\"separator\" class=\"divider\"></li>\n" +
    "        <li><a href=\"#\" ng-click=\"waid.logout()\"><span class=\"glyphicon glyphicon-log-out\"></span> Uitloggen</a></li>\n" +
    "        <li><a href=\"#\" ng-click=\"waid.logoutAll()\"><span class=\"glyphicon glyphicon-new-window\"></span> Op alle systemen uitloggen</a></li>\n" +
    "      </ul>\n" +
    "    </li>\n" +
    "    <li ng-hide=\"waid.user\"><a ng-click=\"waid.openLoginAndRegisterHomeModal()\"><span class=\"glyphicon glyphicon-log-in\"></span> Login of Registreer</a></li>\n" +
    "  </ul>\n" +
    "</span>"
  );


  $templateCache.put('/idm/templates/user-profile-status-button.html',
    "<span class=\"waid\">\n" +
    "<div class=\"btn-group\">\n" +
    "  <button type=\"button\" class=\"btn btn-default btn-xs dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" ng-show=\"waid.user\">\n" +
    "    <span class=\"glyphicon glyphicon-user\"></span> Ingelogd als {{ waid.user.default_name }}  <span class=\"caret\"></span>\n" +
    "  </button>\n" +
    "  <ul class=\"dropdown-menu\" ng-show=\"waid.user\">\n" +
    "    <li><a ng-click=\"waid.openUserProfileHomeModal()\"><span class=\"glyphicon glyphicon-cog\"></span> Profiel</a></li>\n" +
    "    <li role=\"separator\" class=\"divider\"></li>\n" +
    "    <li><a href=\"#\" ng-click=\"waid.logout()\"><span class=\"glyphicon glyphicon-log-out\"></span> Uitloggen</a></li>\n" +
    "    <li><a href=\"#\" ng-click=\"waid.logoutAll()\"><span class=\"glyphicon glyphicon-new-window\"></span> Op alle systemen uitloggen</a></li>\n" +
    "  </ul>\n" +
    "</div>\n" +
    "<button ng-hide=\"waid.user\" ng-click=\"waid.openLoginAndRegisterHomeModal()\" class=\"btn btn-default btn-xs\">Login of Registreer</button>\n" +
    "</div>"
  );
}]);