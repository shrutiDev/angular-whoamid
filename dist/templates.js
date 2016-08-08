angular.module('waid.templates',[]).run(['$templateCache', function($templateCache) { 
  'use strict';

  $templateCache.put('/comments/templates/comments-home.html',
    "  <div>\n" +
    "  <h3>{{ waid.getTranslation('comments', 'title') }}</h3>\n" +
    "  <blockquote ng-hide=\"waid.user\">\n" +
    "    <p>{{ waid.getTranslation('comments', 'notLoggedInText') }}</p>\n" +
    "  </blockquote>\n" +
    "\n" +
    "    <waid-comments-order-button></waid-comments-order-button>\n" +
    "    <waid-user-profile-status-button></waid-user-profile-status-button>\n" +
    "\n" +
    "      <div class=\"media\" ng-show=\"waid.user\">\n" +
    "        <div class=\"media-left\">\n" +
    "          \n" +
    "          <img class=\"media-object\" ng-src=\"{{ waid.user.avatar_thumb_50_50 }}\" alt=\"{{ waid.user.default_name }}\">\n" +
    "          \n" +
    "        </div>\n" +
    "        <div class=\"media-body\">\n" +
    "          <textarea class=\"form-control\" rows=\"3\" ng-model=\"comment.comment\" msd-elastic></textarea><br />\n" +
    "          <button type=\"button\" class=\"btn btn-default btn-xs pull-right\" ng-click=\"post()\">\n" +
    "              <span class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\"></span> {{ waid.getTranslation('comments', 'postCommentButton') }}\n" +
    "          </button> \n" +
    "          <button type=\"button\" class=\"btn btn-default btn-xs pull-left\" ng-click=\"waid.openEmoticonsModal(comment.comment)\">\n" +
    "              😄 Emoticon toevoegen\n" +
    "          </button> \n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    \n" +
    "    \n" +
    "    \n" +
    "    <div class=\"media\" ng-repeat=\"comment in comments\" style=\"overflow: visible;\" ng-show=\"comments\">\n" +
    "      <div class=\"media-left\">\n" +
    "        <img class=\"media-object\" ng-src=\"{{ comment.user.avatar_thumb_50_50 }}\" alt=\"{{ comment.user.default_name }}\">\n" +
    "      </div>\n" +
    "      <div class=\"media-body\" style=\"overflow: visible;\">\n" +
    "        <h4 class=\"media-heading\">{{ comment.user.default_name }}<br />\n" +
    "          <small>{{ comment.created | date:'medium' }}</small>\n" +
    "          <div class=\"btn-group pull-right\" ng-show=\"waid.user\">\n" +
    "            <button type=\"button\" class=\"btn btn-default btn-xs dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "              {{ waid.getTranslation('comments', 'actionDropdownTitle') }} <span class=\"caret\"></span>\n" +
    "            </button>\n" +
    "            <ul class=\"dropdown-menu\">\n" +
    "              <li><a ng-click=\"editComment(comment)\" ng-show=\"comment.is_owner\">\n" +
    "                <span class=\"glyphicon glyphicon-edit\" aria-hidden=\"true\"></span> {{ waid.getTranslation('comments', 'editCommentTitle') }}</a>\n" +
    "              </li>\n" +
    "              <li ng-show=\"!comment.marked_as_spam\"><a ng-click=\"markComment(comment, 'SPAM')\">\n" +
    "                <span class=\"glyphicon glyphicon-exclamation-sign aria-hidden=\"true\"></span> {{ waid.getTranslation('comments', 'markCommentSpamTitle') }}</a>\n" +
    "              </li>\n" +
    "              <li role=\"separator\" class=\"divider\" ng-show=\"comment.is_owner\"></li>\n" +
    "              <li><a ng-click=\"deleteComment(comment)\" ng-show=\"comment.is_owner\" confirm=\"{{ waid.getTranslation('comments', 'confirmDeleteContentBody') }}\" confirm-title=\"{{ waid.getTranslation('comments', 'confirmDeleteContentTitle') }}\">\n" +
    "                <span class=\"glyphicon glyphicon-remove-sign\" aria-hidden=\"true\"></span> {{ waid.getTranslation('comments', 'deleteCommentTitle') }}</a>\n" +
    "              </li>\n" +
    "            </ul>\n" +
    "          </div>\n" +
    "        </h4>\n" +
    "        <div ng-hide=\"comment.is_edit\">\n" +
    "          <p style=\"white-space: pre-wrap;\">{{ comment.comment_formatted }}</p>\n" +
    "          <div class=\"btn-group\" role=\"group\" aria-label=\"...\">\n" +
    "            <button type=\"button\" class=\"btn btn-default btn-xs\" ng-click=\"voteComment(comment, 'UP')\">\n" +
    "              <span class=\"glyphicon glyphicon-chevron-up\" aria-hidden=\"true\" ></span> {{ comment.vote_up_count }}\n" +
    "            </button>\n" +
    "            <button type=\"button\" class=\"btn btn-default btn-xs\" ng-click=\"voteComment(comment, 'DOWN')\">\n" +
    "              <span class=\"glyphicon glyphicon-chevron-down\" aria-hidden=\"true\"></span> {{ comment.vote_down_count }}\n" +
    "            </button>\n" +
    "          </div>\n" +
    "\n" +
    "          <small class=\"pull-right\" ng-show=\"comment.marked_as_spam\">\n" +
    "            <span class=\"glyphicon glyphicon-exclamation-sign aria-hidden=\"true\"></span> {{ waid.getTranslation('comments', 'commentMarkedAsSpam') }}\n" +
    "          </small>\n" +
    "        </div>\n" +
    "        <div ng-show=\"comment.is_edit\">\n" +
    "          <textarea class=\"form-control\" rows=\"1\" msd-elastic ng-model=\"comment.comment_formatted\"></textarea>\n" +
    "          <p style=\"margin-top:10px;\">\n" +
    "          <button type=\"button\" class=\"btn btn-default btn-xs pull-right\" ng-click=\"updateComment(comment)\">\n" +
    "            <span class=\"glyphicon glyphicon-check\" aria-hidden=\"true\"></span> {{ waid.getTranslation('comments', 'updateCommentButton') }}\n" +
    "          </button>\n" +
    "          <button type=\"button\" class=\"btn btn-default btn-xs pull-left\" ng-click=\"waid.openEmoticonsModal(comment.comment_formatted)\">\n" +
    "              😄 Emoticon toevoegen\n" +
    "          </button>\n" +
    "          </p>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    \n" +
    "\n" +
    "  </div>"
  );


  $templateCache.put('/comments/templates/comments-order-button.html',
    "<div class=\"btn-group\">\n" +
    "  <button type=\"button\" class=\"btn btn-default btn-xs dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n" +
    "     <span class=\"glyphicon glyphicon-sort\"></span> \n" +
    "     <span ng-show=\"ordering=='-created'\">{{ waid.getTranslation('comments', 'voteOrderNewestFirst') }}</span>\n" +
    "     <span ng-show=\"ordering=='created'\">{{ waid.getTranslation('comments', 'voteOrderOldestFirst') }}</span>\n" +
    "     <span ng-show=\"ordering=='-vote_count'\">{{ waid.getTranslation('comments', 'voteOrderTopFirst') }}</span><span class=\"caret\"></span>\n" +
    "  </button>\n" +
    "  <ul class=\"dropdown-menu\">\n" +
    "    <li><a href=\"#\" ng-click=\"orderCommentList('-created')\"><span class=\"glyphicon glyphicon-sort-by-attributes-alt\"></span> {{ waid.getTranslation('comments', 'voteOrderNewestFirst') }} </a></li>\n" +
    "    <li><a href=\"#\" ng-click=\"orderCommentList('created')\"><span class=\"glyphicon glyphicon-sort-by-attributes\n" +
    "        \"></span> {{ waid.getTranslation('comments', 'voteOrderOldestFirst') }}</a></li>\n" +
    "    <li><a href=\"#\" ng-click=\"orderCommentList('-vote_count')\"><span class=\"glyphicon glyphicon-flash\n" +
    "        \"></span> {{ waid.getTranslation('comments', 'voteOrderTopFirst') }}</a></li>\n" +
    "  </ul>\n" +
    "</div>"
  );


  $templateCache.put('/core/templates/core.html',
    " \n" +
    "<div style=\"background-color:black:width:200px;height:200px;\">ba</div>\n" +
    " <div growl></div>\n" +
    "\n" +
    " <div class=\"loading\" ng-show=\"checkLoading()\">\n" +
    " 	<div class=\"loader\">\n" +
    " 		<i class=\"fa fa-spinner fa-pulse fa-3x fa-fw\"></i>\n" +
    " 	</div>\n" +
    " </div>\n"
  );


  $templateCache.put('/core/templates/emoticons-modal.html',
    "<div class=\"modal-header\">\n" +
    "  <h3 class=\"modal-title\">Emoticons</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "<h4>People</h4>\n" +
    "😄\n" +
    "😆\n" +
    "😊\n" +
    "😃\n" +
    "😏\n" +
    "😍\n" +
    "😘\n" +
    "😚\n" +
    "😳\n" +
    "😌\n" +
    "😆\n" +
    "😁\n" +
    "😉\n" +
    "😜\n" +
    "😝\n" +
    "😀\n" +
    "😗\n" +
    "😙\n" +
    "😛\n" +
    "😴\n" +
    "😟\n" +
    "😦\n" +
    "😧\n" +
    "😮\n" +
    "😬\n" +
    "😕\n" +
    "😯\n" +
    "😑\n" +
    "😒\n" +
    "😅\n" +
    "😓\n" +
    "😥\n" +
    "😩\n" +
    "😔\n" +
    "😞\n" +
    "😖\n" +
    "😨\n" +
    "😰\n" +
    "😣\n" +
    "😢\n" +
    "😭\n" +
    "😂\n" +
    "😲\n" +
    "😱\n" +
    "😫\n" +
    "😠\n" +
    "😡\n" +
    "😤\n" +
    "😪\n" +
    "😋\n" +
    "😷\n" +
    "😎\n" +
    "😵\n" +
    "👿\n" +
    "😈\n" +
    "😐\n" +
    "😶\n" +
    "😇\n" +
    "👽\n" +
    "💛\n" +
    "💙\n" +
    "💜\n" +
    "❤\n" +
    "💚\n" +
    "💔\n" +
    "💓\n" +
    "💗\n" +
    "💕\n" +
    "💞\n" +
    "💘\n" +
    "💖\n" +
    "✨\n" +
    "⭐\n" +
    "🌟\n" +
    "💫\n" +
    "💥\n" +
    "💥\n" +
    "💢\n" +
    "❗\n" +
    "❓\n" +
    "❕\n" +
    "❔\n" +
    "💤\n" +
    "💨\n" +
    "💦\n" +
    "🎶\n" +
    "🎵\n" +
    "🔥\n" +
    "💩\n" +
    "💩\n" +
    "💩\n" +
    "👍\n" +
    "👍\n" +
    "👎\n" +
    "👎\n" +
    "👌\n" +
    "👊\n" +
    "👊\n" +
    "✊\n" +
    "✌\n" +
    "👋\n" +
    "✋\n" +
    "✋\n" +
    "👐\n" +
    "☝\n" +
    "👇\n" +
    "👈\n" +
    "👉\n" +
    "🙌\n" +
    "🙏\n" +
    "👆\n" +
    "👏\n" +
    "💪\n" +
    "🏃\n" +
    "🏃\n" +
    "👫\n" +
    "👪\n" +
    "👬\n" +
    "👭\n" +
    "💃\n" +
    "👯\n" +
    "🙆\n" +
    "🙅\n" +
    "💁\n" +
    "🙋\n" +
    "👰\n" +
    "🙎\n" +
    "🙍\n" +
    "🙇\n" +
    "💏\n" +
    "💑\n" +
    "💆\n" +
    "💇\n" +
    "💅\n" +
    "👦\n" +
    "👧\n" +
    "👩\n" +
    "👨\n" +
    "👶\n" +
    "👵\n" +
    "👴\n" +
    "👱\n" +
    "👲\n" +
    "👳\n" +
    "👷\n" +
    "👮\n" +
    "👼\n" +
    "👸\n" +
    "😺\n" +
    "😸\n" +
    "😻\n" +
    "😽\n" +
    "😼\n" +
    "🙀\n" +
    "😿\n" +
    "😹\n" +
    "😾\n" +
    "👹\n" +
    "👺\n" +
    "🙈\n" +
    "🙉\n" +
    "🙊\n" +
    "💂\n" +
    "💀\n" +
    "🐾\n" +
    "👄\n" +
    "💋\n" +
    "💧\n" +
    "👂\n" +
    "👀\n" +
    "👃\n" +
    "👅\n" +
    "💌\n" +
    "👤\n" +
    "👥\n" +
    "💬\n" +
    "💭\n" +
    "<h4>Nature</h4>\n" +
    "☀\n" +
    "☂\n" +
    "☁\n" +
    "❄\n" +
    "☃\n" +
    "⚡\n" +
    "🌀\n" +
    "🌁\n" +
    "🌊\n" +
    "🐱\n" +
    "🐶\n" +
    "🐭\n" +
    "🐹\n" +
    "🐰\n" +
    "🐺\n" +
    "🐸\n" +
    "🐯\n" +
    "🐨\n" +
    "🐻\n" +
    "🐷\n" +
    "🐽\n" +
    "🐮\n" +
    "🐗\n" +
    "🐵\n" +
    "🐒\n" +
    "🐴\n" +
    "🐎\n" +
    "🐫\n" +
    "🐑\n" +
    "🐘\n" +
    "🐼\n" +
    "🐍\n" +
    "🐦\n" +
    "🐤\n" +
    "🐥\n" +
    "🐣\n" +
    "🐔\n" +
    "🐧\n" +
    "🐢\n" +
    "🐛\n" +
    "🐝\n" +
    "🐜\n" +
    "🐞\n" +
    "🐌\n" +
    "🐙\n" +
    "🐠\n" +
    "🐟\n" +
    "🐳\n" +
    "🐋\n" +
    "🐬\n" +
    "🐄\n" +
    "🐏\n" +
    "🐀\n" +
    "🐃\n" +
    "🐅\n" +
    "🐇\n" +
    "🐉\n" +
    "🐐\n" +
    "🐓\n" +
    "🐕\n" +
    "🐖\n" +
    "🐁\n" +
    "🐂\n" +
    "🐲\n" +
    "🐡\n" +
    "🐊\n" +
    "🐪\n" +
    "🐆\n" +
    "🐈\n" +
    "🐩\n" +
    "🐾\n" +
    "💐\n" +
    "🌸\n" +
    "🌷\n" +
    "🍀\n" +
    "🌹\n" +
    "🌻\n" +
    "🌺\n" +
    "🍁\n" +
    "🍃\n" +
    "🍂\n" +
    "🌿\n" +
    "🍄\n" +
    "🌵\n" +
    "🌴\n" +
    "🌲\n" +
    "🌳\n" +
    "🌰\n" +
    "🌱\n" +
    "🌼\n" +
    "🌾\n" +
    "🐚\n" +
    "🌐\n" +
    "🌞\n" +
    "🌝\n" +
    "🌚\n" +
    "🌑\n" +
    "🌒\n" +
    "🌓\n" +
    "🌔\n" +
    "🌕\n" +
    "🌖\n" +
    "🌗\n" +
    "🌘\n" +
    "🌜\n" +
    "🌛\n" +
    "🌙\n" +
    "🌍\n" +
    "🌎\n" +
    "🌏\n" +
    "🌋\n" +
    "🌌\n" +
    "⛅\n" +
    "<h4>Objects</h4>\n" +
    "🎍\n" +
    "💝\n" +
    "🎎\n" +
    "🎒\n" +
    "🎓\n" +
    "🎏\n" +
    "🎆\n" +
    "🎇\n" +
    "🎐\n" +
    "🎑\n" +
    "🎃\n" +
    "👻\n" +
    "🎅\n" +
    "🎄\n" +
    "🎁\n" +
    "🔔\n" +
    "🔕\n" +
    "🎋\n" +
    "🎉\n" +
    "🎊\n" +
    "🎈\n" +
    "🔮\n" +
    "💿\n" +
    "📀\n" +
    "💾\n" +
    "📷\n" +
    "📹\n" +
    "🎥\n" +
    "💻\n" +
    "📺\n" +
    "📱\n" +
    "☎\n" +
    "☎\n" +
    "📞\n" +
    "📟\n" +
    "📠\n" +
    "💽\n" +
    "📼\n" +
    "🔉\n" +
    "🔈\n" +
    "🔇\n" +
    "📢\n" +
    "📣\n" +
    "⌛\n" +
    "⏳\n" +
    "⏰\n" +
    "⌚\n" +
    "📻\n" +
    "📡\n" +
    "➿\n" +
    "🔍\n" +
    "🔎\n" +
    "🔓\n" +
    "🔒\n" +
    "🔏\n" +
    "🔐\n" +
    "🔑\n" +
    "💡\n" +
    "🔦\n" +
    "🔆\n" +
    "🔅\n" +
    "🔌\n" +
    "🔋\n" +
    "📲\n" +
    "✉\n" +
    "📫\n" +
    "📮\n" +
    "🛀\n" +
    "🛁\n" +
    "🚿\n" +
    "🚽\n" +
    "🔧\n" +
    "🔩\n" +
    "🔨\n" +
    "💺\n" +
    "💰\n" +
    "💴\n" +
    "💵\n" +
    "💷\n" +
    "💶\n" +
    "💳\n" +
    "💸\n" +
    "📧\n" +
    "📥\n" +
    "📤\n" +
    "✉\n" +
    "📨\n" +
    "📯\n" +
    "📪\n" +
    "📬\n" +
    "📭\n" +
    "📦\n" +
    "🚪\n" +
    "🚬\n" +
    "💣\n" +
    "🔫\n" +
    "🔪\n" +
    "💊\n" +
    "💉\n" +
    "📄\n" +
    "📃\n" +
    "📑\n" +
    "📊\n" +
    "📈\n" +
    "📉\n" +
    "📜\n" +
    "📋\n" +
    "📆\n" +
    "📅\n" +
    "📇\n" +
    "📁\n" +
    "📂\n" +
    "✂\n" +
    "📌\n" +
    "📎\n" +
    "✒\n" +
    "✏\n" +
    "📏\n" +
    "📐\n" +
    "📕\n" +
    "📗\n" +
    "📘\n" +
    "📙\n" +
    "📓\n" +
    "📔\n" +
    "📒\n" +
    "📚\n" +
    "🔖\n" +
    "📛\n" +
    "🔬\n" +
    "🔭\n" +
    "📰\n" +
    "🏈\n" +
    "🏀\n" +
    "⚽\n" +
    "⚾\n" +
    "🎾\n" +
    "🎱\n" +
    "🏉\n" +
    "🎳\n" +
    "⛳\n" +
    "🚵\n" +
    "🚴\n" +
    "🏇\n" +
    "🏂\n" +
    "🏊\n" +
    "🏄\n" +
    "🎿\n" +
    "♠\n" +
    "♥\n" +
    "♣\n" +
    "♦\n" +
    "💎\n" +
    "💍\n" +
    "🏆\n" +
    "🎼\n" +
    "🎹\n" +
    "🎻\n" +
    "👾\n" +
    "🎮\n" +
    "🃏\n" +
    "🎴\n" +
    "🎲\n" +
    "🎯\n" +
    "🀄\n" +
    "🎬\n" +
    "📝\n" +
    "📝\n" +
    "📖\n" +
    "🎨\n" +
    "🎤\n" +
    "🎧\n" +
    "🎺\n" +
    "🎷\n" +
    "🎸\n" +
    "👞\n" +
    "👡\n" +
    "👠\n" +
    "💄\n" +
    "👢\n" +
    "👕\n" +
    "👕\n" +
    "👔\n" +
    "👚\n" +
    "👗\n" +
    "🎽\n" +
    "👖\n" +
    "👘\n" +
    "👙\n" +
    "🎀\n" +
    "🎩\n" +
    "👑\n" +
    "👒\n" +
    "👞\n" +
    "🌂\n" +
    "💼\n" +
    "👜\n" +
    "👝\n" +
    "👛\n" +
    "👓\n" +
    "🎣\n" +
    "☕\n" +
    "🍵\n" +
    "🍶\n" +
    "🍼\n" +
    "🍺\n" +
    "🍻\n" +
    "🍸\n" +
    "🍹\n" +
    "🍷\n" +
    "🍴\n" +
    "🍕\n" +
    "🍔\n" +
    "🍟\n" +
    "🍗\n" +
    "🍖\n" +
    "🍝\n" +
    "🍛\n" +
    "🍤\n" +
    "🍱\n" +
    "🍣\n" +
    "🍥\n" +
    "🍙\n" +
    "🍘\n" +
    "🍚\n" +
    "🍜\n" +
    "🍲\n" +
    "🍢\n" +
    "🍡\n" +
    "🍳\n" +
    "🍞\n" +
    "🍩\n" +
    "🍮\n" +
    "🍦\n" +
    "🍨\n" +
    "🍧\n" +
    "🎂\n" +
    "🍰\n" +
    "🍪\n" +
    "🍫\n" +
    "🍬\n" +
    "🍭\n" +
    "🍯\n" +
    "🍎\n" +
    "🍏\n" +
    "🍊\n" +
    "🍋\n" +
    "🍒\n" +
    "🍇\n" +
    "🍉\n" +
    "🍓\n" +
    "🍑\n" +
    "🍈\n" +
    "🍌\n" +
    "🍐\n" +
    "🍍\n" +
    "🍠\n" +
    "🍆\n" +
    "🍅\n" +
    "🌽\n" +
    "<h4>Places</h4>\n" +
    "🏠\n" +
    "🏡\n" +
    "🏫\n" +
    "🏢\n" +
    "🏣\n" +
    "🏥\n" +
    "🏦\n" +
    "🏪\n" +
    "🏩\n" +
    "🏨\n" +
    "💒\n" +
    "⛪\n" +
    "🏬\n" +
    "🏤\n" +
    "🌇\n" +
    "🌆\n" +
    "🏯\n" +
    "🏰\n" +
    "⛺\n" +
    "🏭\n" +
    "🗼\n" +
    "🗾\n" +
    "🗻\n" +
    "🌄\n" +
    "🌅\n" +
    "🌠\n" +
    "🗽\n" +
    "🌉\n" +
    "🎠\n" +
    "🌈\n" +
    "🎡\n" +
    "⛲\n" +
    "🎢\n" +
    "🚢\n" +
    "🚤\n" +
    "⛵\n" +
    "⛵\n" +
    "🚣\n" +
    "⚓\n" +
    "🚀\n" +
    "✈\n" +
    "🚁\n" +
    "🚂\n" +
    "🚊\n" +
    "🚞\n" +
    "🚲\n" +
    "🚡\n" +
    "🚟\n" +
    "🚠\n" +
    "🚜\n" +
    "🚙\n" +
    "🚘\n" +
    "🚗\n" +
    "🚗\n" +
    "🚕\n" +
    "🚖\n" +
    "🚛\n" +
    "🚌\n" +
    "🚍\n" +
    "🚨\n" +
    "🚓\n" +
    "🚔\n" +
    "🚒\n" +
    "🚑\n" +
    "🚐\n" +
    "🚚\n" +
    "🚋\n" +
    "🚉\n" +
    "🚆\n" +
    "🚅\n" +
    "🚄\n" +
    "🚈\n" +
    "🚝\n" +
    "🚃\n" +
    "🚎\n" +
    "🎫\n" +
    "⛽\n" +
    "🚦\n" +
    "🚥\n" +
    "⚠\n" +
    "🚧\n" +
    "🔰\n" +
    "🏧\n" +
    "🎰\n" +
    "🚏\n" +
    "💈\n" +
    "♨\n" +
    "🏁\n" +
    "🎌\n" +
    "🏮\n" +
    "🗿\n" +
    "🎪\n" +
    "🎭\n" +
    "📍\n" +
    "🚩\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"close()\">Sluiten</button>\n" +
    "</div>\n"
  );


  $templateCache.put('/idm/templates/_page.html',
    "<div class=\"container\" style=\"margin-top:20px;\">\n" +
    "  <div class=\"row\">\n" +
    "    <div class=\"col-md-4\">\n" +
    "      <div class=\"panel panel-default\">\n" +
    "        <div class=\"panel-heading\">\n" +
    "          <h3 class=\"panel-title\">Demo page</h3>\n" +
    "        </div>\n" +
    "        <div class=\"panel-body\">\n" +
    "          Here you'll find all your comments.\n" +
    "        </div>\n" +
    "        \n" +
    "      </div>\n" +
    "\n" +
    "    </div>      \n" +
    "    <div class=\"col-md-8\">\n" +
    "\n" +
    "\n" +
    "      <waid-comments waid=\"waid\" />\n" +
    "\n" +
    "     \n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/idm/templates/complete-profile.html',
    "<div class=\"modal-header\">\n" +
    "  <h3 class=\"modal-title\">Bevestig uw gegevens</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <ng-include src=\"'/idm/templates/register.html'\" ng-init=\"modus = 'complete'\"></ng-include>\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"close()\">Sluiten</button>\n" +
    "</div>"
  );


  $templateCache.put('/idm/templates/home.html',
    ""
  );


  $templateCache.put('/idm/templates/login-and-register-home.html',
    "\n" +
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
    "    </div>\n"
  );


  $templateCache.put('/idm/templates/login-and-register-modal.html',
    "\n" +
    "<div class=\"modal-header\">\n" +
    "  <h3 class=\"modal-title\">Inloggen of registreren</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "   <ng-include src=\"'/idm/templates/login-and-register-home.html'\"></ng-include>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"close()\">Sluiten</button>\n" +
    "</div>"
  );


  $templateCache.put('/idm/templates/login.html',
    "<div id=\"login_view\" ng-controller=\"WAIDLoginCtrl\">\n" +
    "  <form role=\"form\"  name=\"loginForm\" novalidate>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"id_username\">Gebruikersnaam</label>\n" +
    "      <input name=\"username\" id=\"id_username\" type=\"text\" ng-model=\"model.username\" placeholder=\"Username\" class=\"form-control\" required />\n" +
    "    </div>\n" +
    "    <div class=\"alert alert-danger\" ng-repeat=\"error in errors.username\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ error }}</div>\n" +
    "    <div class=\"form-group\">\n" +
    "      <label for=\"id_password\">Password</label>\n" +
    "      <input name=\"password\" id=\"id_password\" type=\"password\" ng-model=\"model.password\" placeholder=\"Password\" class=\"form-control\" required />\n" +
    "    </div>\n" +
    "    <div class=\"alert alert-danger\" ng-repeat=\"error in errors.password\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ error }}</div>\n" +
    "    <div class=\"alert alert-danger\" ng-repeat=\"error in errors.non_field_errors\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ error }}</div>\n" +
    "    <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"login()\">Inloggen</button>\n" +
    "  </form>\n" +
    "  <br />\n" +
    "  <a ng-click=\"waid.openLostLoginModal()\">Login gegevens kwijt?</a>\n" +
    "\n" +
    "</div>"
  );


  $templateCache.put('/idm/templates/lost-login-modal.html',
    "<div class=\"modal-header\">\n" +
    "  <h3 class=\"modal-title\">Login gegevens kwijt?</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  <ng-include src=\"'/idm/templates/lost-login.html'\"></ng-include>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"close()\">Sluiten</button>\n" +
    "</div>"
  );


  $templateCache.put('/idm/templates/lost-login.html',
    "<div id=\"lost_login_view\" ng-controller=\"WAIDLostLoginCtrl\">\n" +
    "<form role=\"form\" name=\"loginForm\" novalidate>\n" +
    "  <div class=\"form-group\">\n" +
    "    <label for=\"id_email\">E-mail</label>\n" +
    "    <input name=\"username\" id=\"id_email\" type=\"text\" ng-model=\"model.email\" placeholder=\"Email\" class=\"form-control\" required />\n" +
    "  </div>\n" +
    "  <div class=\"alert alert-danger\" ng-repeat=\"error in errors.email\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ error }}</div>\n" +
    "\n" +
    "  <div class=\"alert alert-danger\" ng-repeat=\"error in errors.non_field_errors\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{ error }}</div>\n" +
    "  <button type=\"submit\" class=\"btn btn-primary\" ng-click=\"submit()\">Inlog gegevens ophalen</button>\n" +
    "</form>\n" +
    "</div>\n" +
    "  "
  );


  $templateCache.put('/idm/templates/register.html',
    " <div ng-controller=\"WAIDRegisterCtrl\">\n" +
    "      <div ng-show=\"modus=='complete'\" class=\"alert alert-warning\" ng-show=\"missingEmailVerification\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> Om verder te gaan met jouw account hebben we wat extra gegevens nodig...</div>\n" +
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
    "      <button ng-disabled=\"!model.terms_and_conditions_check\" type=\"submit\" class=\"btn btn-primary\" ng-click=\"register()\">Registreren</button>\n" +
    "    </form>\n" +
    "  </div>"
  );


  $templateCache.put('/idm/templates/social-login.html',
    "  <div id=\"login_view\" ng-controller=\"WAIDSocialCtrl\">\n" +
    "    <a class=\"btn btn-default\" role=\"button\" ng-repeat=\"provider in providers\" ng-click=\"goToSocialLogin(provider)\">{{ provider.backend }}</a>\n" +
    "  </div>"
  );


  $templateCache.put('/idm/templates/terms-and-conditions-modal.html',
    "<div class=\"modal-header\">\n" +
    "    <h3 class=\"modal-title\">Algemene voorwaarden</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "  \n" +
    "    <p><b>WhoAmID</b> besteedt continue zorg en aandacht aan de samenstelling van de inhoud op onze sites. Op onze sites worden diverse interactiemogelijkheden aangeboden. De redactie bekijkt de berichten en reacties, die naar onze fora worden gestuurd niet vooraf - tenzij uitdrukkelijk anders aangegeven. Berichten die evident onrechtmatig zijn, worden zo spoedig mogelijk verwijderd. Het kan evenwel voorkomen dat u dergelijke berichten korte tijd aantreft. Wij distantiÃ«ren ons nadrukkelijk van deze berichten en verontschuldigen ons er bij voorbaat voor. Het is mogelijk dat de informatie die op de sites wordt gepubliceerd onvolledig is of onjuistheden bevat. Het is niet altijd mogelijk fouten te voorkomen. WhoAmID is niet verantwoordelijk voor meningen en boodschappen van gebruikers van (forum)pagina's. De meningen en boodschappen op de forumpagina's geven niet de mening of het beleid van WhoAmID weer. Ditzelfde geldt voor informatie van derden waarvan u via links op onze websites kennisneemt. Wij sluiten alle aansprakelijkheid uit voor enigerlei directe of indirecte schade, van welke aard dan ook, die voortvloeit uit het gebruik van informatie die op of via onze websites is verkregen. WhoAmID behoudt zich het recht voor - tenzij schriftelijk anders overeengekomen met de auteur - ingezonden materiaal te verwijderen in te korten en/of aan te passen. Dit geldt zowel voor tekst als muziek- en beeldmateriaal. Deze website is alleen bedoeld voor eigen raadpleging via normaal browser-bezoek. Het is derhalve niet toegestaan om de website op geautomatiseerde wijze te (laten) raadplegen, bijvoorbeeld via scripts, spiders en/of bots. Eventuele hyperlinks dienen bezoekers rechtstreeks te leiden naar de context, waarbinnen de publieke omroep content aanbiedt. Video- en audiostreams mogen bijvoorbeeld alleen worden vertoond via een link naar een omroeppagina of embedded omroepplayer. Overneming, inframing, herpublicatie, bewerking of toevoeging zijn niet toegestaan. Eveneens is het niet toegestaan technische beveiligingen te omzeilen of te verwijderen, of dit voor anderen mogelijk te maken. WhoAmID kan besluiten (delen van ) bijdragen van gebruikers op internetsites te publiceren c.q. over te nemen in andere media, bijvoorbeeld maar niet beperkt tot televisie, radio, internetsites, mobiele informatiedragers en printmedia. Door bijdragen te leveren op fora en andere WhoAmID vergelijkbare internetsites stemmen bezoekers op voorhand onvoorwaardelijk en eeuwigdurend in met bovengenoemd gebruik van (delen van) hun bijdragen. Wanneer rechtens komt vast te staan dat WhoAmID daartoe gehouden is, zal WhoAmID mogen overgaan tot het aan derde(n) verstrekken van naam, adres, woonplaats of ip-nummer van een bezoeker/gebruiker.</p>\n" +
    "  \n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"close()\">Sluiten</button>\n" +
    "</div>"
  );


  $templateCache.put('/idm/templates/user-profile-home.html',
    "\n" +
    "<div class=\"row\" ng-controller=\"WAIDIdmUserProfileHomeCtrl\">\n" +
    "  <div class=\"col-md-4\">\n" +
    "    <ng-include src=\"'/idm/templates/user-profile-menu.html'\"></ng-include>\n" +
    "  </div>      \n" +
    "  <div class=\"col-md-8\">\n" +
    "\n" +
    "    <div ng-show=\"showProfilePage('overview')\" ng-controller=\"WAIDUserProfileOverviewCtrl\">\n" +
    "      <div>\n" +
    "        <a class=\"btn btn-default btn-xs pull-right\" ng-click=\"goToProfilePage('main')\">Algemene gegevens aanpassen</a>\n" +
    "        <h3>Overzicht</h3>\n" +
    "        <dl class=\"dl-horizontal\">\n" +
    "          <dt>Geboortedatum</dt>\n" +
    "          <dd>{{ model.date_of_birth }}</dd>\n" +
    "        </dl>\n" +
    "        <dl class=\"dl-horizontal\">\n" +
    "          <dt>Geslacht</dt>\n" +
    "          <dd><span ng-show=\"model.gender=='F'\">Vrouw</span><span ng-show=\"model.gender=='M'\">Male</span></dd>\n" +
    "        </dl>\n" +
    "      </div>\n" +
    "      \n" +
    "      <div>\n" +
    "        <a class=\"btn btn-default btn-xs pull-right\" ng-click=\"goToProfilePage('interests')\">Interesses aanpassen</a>\n" +
    "        <h3>Interesses</h3>\n" +
    "        <dl class=\"dl-horizontal\">\n" +
    "          <dt>Leuk</dt>\n" +
    "          <dd>{{ model.like_tags }}</dd>\n" +
    "        </dl>\n" +
    "        <dl class=\"dl-horizontal\">\n" +
    "          <dt>Niet leuk</dt>\n" +
    "          <dd>{{ model.dislike_tags }}</dd>\n" +
    "        </dl>\n" +
    "      \n" +
    "      </div>\n" +
    "\n" +
    "      <div>\n" +
    "        <a class=\"btn btn-default btn-xs pull-right\" ng-click=\"goToProfilePage('emails')\">E-mail adressen aanpassen</a>\n" +
    "        <h3>E-mail adressen</h3>\n" +
    "        <dl class=\"dl-horizontal\" ng-repeat=\"email in emails\">\n" +
    "          <dt>\n" +
    "            <span class=\"glyphicon glyphicon-eye-close text-danger\" ng-show=\"!email.is_verified\"></span>\n" +
    "            <span class=\"glyphicon glyphicon-ok text-success\" ng-show=\"email.is_verified\"></span>\n" +
    "          </dt>\n" +
    "          <dd>{{ email.email }}</dd>\n" +
    "        </dl>\n" +
    "        \n" +
    "      </div>\n" +
    "\n" +
    "      <div>\n" +
    "        <h3>Login</h3>\n" +
    "        <a class=\"btn btn-default btn-xs pull-right\" ng-click=\"goToProfilePage('username')\">Login aanpassen</a>\n" +
    "        <dl class=\"dl-horizontal\">\n" +
    "          <dt>Gebruikersnaam</dt>\n" +
    "          <dd>{{ model.username }}</dd>\n" +
    "        </dl>\n" +
    "        \n" +
    "        <a class=\"btn btn-default btn-xs pull-right\" ng-click=\"goToProfilePage('password')\">Wachtwoord aanpassen</a>\n" +
    "        <dl class=\"dl-horizontal\">\n" +
    "          <dt>Wachtwoord</dt>\n" +
    "          <dd>******</dd>\n" +
    "        </dl>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div ng-show=\"showProfilePage('emails')\" ng-controller=\"WAIDUserProfileEmailCtrl\">\n" +
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
    "          <a class=\"btn btn-default btn-sm pull-right\" ng-click=\"goToProfilePage('overview')\">Naar overzicht</a>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div ng-show=\"showProfilePage('main')\" ng-controller=\"WAIDUserProfileMainCtrl\">\n" +
    "      <div>\n" +
    "        <h3>Algemene gegevens</h3>\n" +
    "        <form>\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"date_of_birth\">Geboortedatum</label>\n" +
    "\n" +
    "            <div class=\"input-group\">\n" +
    "              <input type=\"text\" class=\"form-control\" id=\"date_of_birth\" uib-datepicker-popup ng-model=\"model.date_of_birth\" is-open=\"popup.opened\" datepicker-options=\"dateOptions\" ng-required=\"true\" close-text=\"Close\" />\n" +
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
    "              <input type=\"radio\" ng-model=\"model.gender\" value=\"M\"> Male\n" +
    "            </label>\n" +
    "            <label class=\"radio-inline\">\n" +
    "              <input type=\"radio\" ng-model=\"model.gender\" value=\"F\"> Vrouw\n" +
    "            </label>\n" +
    "          </div>\n" +
    "          <div class=\"alert alert-danger\" ng-repeat=\"error in errors.gender\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "\n" +
    "\n" +
    "          <div class=\"form-group\">\n" +
    "            <label>Avatar</label><br />\n" +
    "            <img style=\"width:200px;\" ng-show=\"model.avatar_thumb_50_50\" src=\"{{ model.avatar_thumb_50_50 }}\" />\n" +
    "            <div ng-show=\"isUploading\" class=\"alert alert-info\" role=\"alert\">Bezig met uploaden van foto.</div>\n" +
    "            <input type=\"file\" class=\"form-control\" id=\"avatar\" placeholder=\"Avatar\" onchange=\"angular.element(this).scope().uploadFile(this.files)\">\n" +
    "            \n" +
    "           \n" +
    "          </div>\n" +
    "          <div class=\"alert alert-danger\" ng-repeat=\"error in errors.avatar\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "\n" +
    "\n" +
    "          <button type=\"submit\" class=\"btn btn-default\" ng-click=\"save()\">Opslaan</button>\n" +
    "        </form>\n" +
    "      </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-show=\"showProfilePage('interests')\" ng-controller=\"WAIDUserProfileInterestsCtrl\">\n" +
    "      <div>\n" +
    "        <h3>Interesses</h3>\n" +
    "        <p>Om de kwaliteit en gebruiksvriendelijkheid te verbeteren willen we graag weten waar jouw interesses liggen.\n" +
    "        Uiteraart is dit niet verplicht maar we stellen het wel op prijs!<p>\n" +
    "        <form>\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"like_taks\">Wat vind je leuk?</label>\n" +
    "            <textarea class=\"form-control\" rows=\"3\" id=\"like_tags\" ng-model=\"model.like_tags\"></textarea>\n" +
    "            <p class=\"help-block\">Probeer in kernwoorden te antwoorden, dus : vakantie,bali,fietsen,muziek,autos,audi etc... We proberen interessante content met deze woorden voor u te selecteren.</p>\n" +
    "          </div>\n" +
    "          <div class=\"alert alert-danger\" ng-repeat=\"error in errors.like_tags\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"dislike_tags\">Wat vind je echt niet leuk?</label>\n" +
    "            <textarea class=\"form-control\" rows=\"3\" id=\"dislike_tags\" ng-model=\"model.dislike_tags\"></textarea>\n" +
    "            <p class=\"help-block\">Probeer in kernwoorden te antwoorden, dus : drank, drugs etc.. We proberen content met deze woorden voor jou te filteren.</p>\n" +
    "          </div>\n" +
    "          <div class=\"alert alert-danger\" ng-repeat=\"error in errors.dislike_tags\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "          <button type=\"submit\" class=\"btn btn-default\" ng-click=\"save()\">Opslaan</button>\n" +
    "        </form>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div ng-show=\"showProfilePage('username')\" ng-controller=\"WAIDUserProfileUsernameCtrl\">\n" +
    "      <div>\n" +
    "        <h3>Gebruikersnaam</h3>\n" +
    "        <form>\n" +
    "          <div class=\"form-group\">\n" +
    "            <label for=\"username\">Gebruikersnaam</label>\n" +
    "            <input type=\"input\" class=\"form-control\" id=\"username\" placeholder=\"Gebruikersnaam\" ng-model=\"model.username\">\n" +
    "          </div>\n" +
    "          <div class=\"alert alert-danger\" ng-repeat=\"error in errors.username\"><span class=\"glyphicon glyphicon-alert\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "          <button type=\"submit\" class=\"btn btn-default\" ng-click=\"save()\">Opslaan</button>\n" +
    "        </form>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div ng-show=\"showProfilePage('password')\" ng-controller=\"WAIDUserProfilePasswordCtrl\">\n" +
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
    "            <button type=\"submit\" class=\"btn btn-default\" ng-click=\"save()\">Opslaan</button>\n" +
    "          </form>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n"
  );


  $templateCache.put('/idm/templates/user-profile-menu.html',
    "<div class=\"list-group\">\n" +
    "  <div class=\"list-group\">\n" +
    "    <a class=\"list-group-item\" ng-class=\"getActiveProfilePageMenuClass('overview')\" ng-click=\"goToProfilePage('overview')\">Overzicht</a>\n" +
    "    <a class=\"list-group-item\" ng-class=\"getActiveProfilePageMenuClass('main')\" ng-click=\"goToProfilePage('main')\">Algemeen</a>\n" +
    "    <a class=\"list-group-item\" ng-class=\"getActiveProfilePageMenuClass('interests')\" ng-click=\"goToProfilePage('interests')\">Interesses</a>\n" +
    "    <a class=\"list-group-item\" ng-class=\"getActiveProfilePageMenuClass('emails')\" ng-click=\"goToProfilePage('emails')\">E-Mail adresses</a>\n" +
    "    <a class=\"list-group-item\" ng-class=\"getActiveProfilePageMenuClass('username')\" ng-click=\"goToProfilePage('username')\">Gebruikersnaam</a>\n" +
    "    <a class=\"list-group-item\" ng-class=\"getActiveProfilePageMenuClass('password')\" ng-click=\"goToProfilePage('password')\">Wachtwoord</a>\n" +
    "    <a class=\"list-group-item\" href=\"#\" ng-click=\"waid.logout()\">Uitloggen</a>\n" +
    "  </div>\n" +
    "</div>"
  );


  $templateCache.put('/idm/templates/user-profile-modal.html',
    "<div class=\"modal-header\">\n" +
    "  <h3 class=\"modal-title\">Profiel</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "   <ng-include src=\"'/idm/templates/user-profile-home.html'\"></ng-include>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" type=\"button\" ng-click=\"close()\">Sluiten</button>\n" +
    "</div>"
  );


  $templateCache.put('/idm/templates/user-profile-navbar.html',
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
    "  </ul>\n"
  );


  $templateCache.put('/idm/templates/user-profile-status-button.html',
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
    "  <button ng-hide=\"waid.user\" ng-click=\"waid.openLoginAndRegisterHomeModal()\" class=\"btn btn-default btn-xs\">Login of Registreer</button>\n" +
    "</div>"
  );
}]);