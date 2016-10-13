angular.module('waid.admin.templates',[]).run(['$templateCache', function($templateCache) { 
  'use strict';

  $templateCache.put('/app/templates/application-email-action.html',
    "\n" +
    "		<uib-accordion-group is-open=\"accordion[fieldName + '_open']\">\n" +
    "            <uib-accordion-heading>\n" +
    "              {{ ::waid.config.getConfig('admin.translations.mailSettings.type.' + fieldName + '.title') }} <i class=\"pull-right glyphicon\" ng-class=\"{'glyphicon-chevron-down': accordion[fieldName + '_open'], 'glyphicon-chevron-right': !accordion[fieldName + '_open']}\"></i>\n" +
    "            </uib-accordion-heading>\n" +
    "            <form>\n" +
    "              <div class=\"checkbox\">\n" +
    "                <label>\n" +
    "                  <input type=\"checkbox\" ng-model=\"application['mail_' + fieldName + '_use_template']\"  ng-true-value=\"true\" ng-false-value=\"false\" > Gebruik aangepaste template\n" +
    "                </label>\n" +
    "              </div>\n" +
    "              <div ng-show=\"application['mail_' + fieldName + '_use_template'] == true\">\n" +
    "                <button class=\"btn btn-primary\" type=\"button\" ng-click=\"accordion[fieldName + '_open_params']=!accordion[fieldName + '_open_params']\" aria-expanded=\"false\" aria-controls=\"{{ accordion[fieldName + '_open_params'] }}\">\n" +
    "                  Variabelen\n" +
    "                </button>\n" +
    "                <button class=\"btn btn-primary\" type=\"button\" ng-click=\"accordion[fieldName + '_open_example']=!accordion[fieldName + '_open_example']\" aria-expanded=\"false\" aria-controls=\"{{ accordion[fieldName + '_open_example'] }}\">\n" +
    "                  Standaard e-mail voorbeeld\n" +
    "                </button>\n" +
    "\n" +
    "                <div class=\"collapse\" uib-collapse=\"!accordion[fieldName + '_open_params']\">\n" +
    "                  <div class=\"well\">\n" +
    "                    <ul>\n" +
    "                      <li ng-repeat=\"(key, param) in defaultTemplateData.templates[fieldName].params\">\n" +
    "                        <b>{{ key }}</b>\n" +
    "                        <any ng-if=\"param.type == 'object'\">\n" +
    "                          <ul>\n" +
    "                            <li ng-repeat=\"(var, properties) in getObjectInfo(key)\">{{ var }} : {{ properties.description }}</li>\n" +
    "                          </ul>\n" +
    "                        </any>\n" +
    "                      </li>\n" +
    "                    </ul>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"collapse\" uib-collapse=\"!accordion[fieldName + '_open_example']\">\n" +
    "                  <div class=\"well\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                      <label>Onderwerp</label>\n" +
    "                      <input class=\"form-control\" ng-model=\"defaultTemplateData.templates[fieldName].mail.subject\" disabled></input>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                      <label for=\"mail_register_message_text\">Inhoud (tekst)</label>\n" +
    "                      <textarea class=\"form-control\" ng-model=\"defaultTemplateData.templates[fieldName].mail.body_txt\" msd-elastic disabled></textarea>\n" +
    "                    </div>\n" +
    "                  </div>\n" +
    "                </div>\n" +
    "\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                  <label for=\"mail_{{ fieldName }}_subject\">Onderwerp</label>\n" +
    "                  <input type=\"input\" class=\"form-control\" id=\"mail_{{ fieldName }}_subject\" ng-model=\"application['mail_' + fieldName + '_subject']\">\n" +
    "                </div>\n" +
    "                <div class=\"alert alert-danger\" ng-repeat=\"error in errors.mail_register_subject\"><span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "                <div class=\"form-group\">\n" +
    "                  <label for=\"mail_register_message_html\">Inhoud (html)</label>\n" +
    "                  <text-angular id=\"mail_register_message_html\" ng-model=\"application.mail_register_message_html\" rows=\"15\"></text-angular>\n" +
    "                </div>\n" +
    "                <div class=\"alert alert-danger\" ng-repeat=\"error in errors.mail_register_subject\"><span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "                <div class=\"form-group\">\n" +
    "                  <label for=\"mail_register_message_text\">Inhoud (tekst)</label>\n" +
    "                  <textarea rows=\"15\" class=\"form-control\" id=\"mail_register_message_text\" ng-model=\"application.mail_register_message_text\" msd-elastic></textarea>\n" +
    "                </div>\n" +
    "                <div class=\"alert alert-danger\" ng-repeat=\"error in errors.mail_register_message_text\"><span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span> {{error}}</div>\n" +
    "              </div>\n" +
    "              <button type=\"submit\" class=\"btn btn-default\" ng-click=\"save()\">Opslaan</button>\n" +
    "\n" +
    "            </form>\n" +
    "          </uib-accordion-group>"
  );


  $templateCache.put('/app/templates/cookie-policy.html',
    "<div class=\"container\">\n" +
    "<h3>Cookieverklaring voor whoamid.com</h3>\n" +
    "<p>Op whoamid.com, een site van WhoAmID B.V. , maken wij gebruik van cookies. Een cookie is een eenvoudig klein bestandje dat met pagina’s van deze website wordt meegestuurd en door uw browser op uw harde schrijf van uw computer wordt opgeslagen. De daarin opgeslagen informatie kan bij een volgend bezoek weer naar onze servers teruggestuurd worden.\n" +
    "In deze cookieverklaring lichten wij toe welke cookies er worden geplaatst en met welke doelen.</p>\n" +
    "\n" +
    "<h4>Instellingen onthouden</h4>\n" +
    "<p>Wij gebruiken cookies om uw instellingen en voorkeuren vast te leggen, zodat wij hier niet steeds naar hoeven te vragen. </p>\n" +
    "<p>Het gaat om de volgende instellingen en voorkeuren:\n" +
    "<ul>\n" +
    "	<li>een mogelijkheid tot ingelogd blijven</li>\n" +
    "	<li>de realisatie van een winkelwagentje (shopping cart) voor onze webwinkel</li>\n" +
    "	<li>het vertonen van Google Maps om onze locatie weer te geven en om u de mogelijkheid te bieden uw eigen routebeschrijving te maken</li>\n" +
    "	<li>load balancing om bij drukte de site sneller te laten zijn</li>\n" +
    "	<li>onthouden voor welke cookies u toestemming heeft gegeven</li>\n" +
    "	<li>te voorkomen dat u een advertentie al te vaak te zien krijgt</li>\n" +
    "	<li>U kunt deze cookies blokkeren via uw browser, maar dan moet u deze voorkeuren steeds opnieuw ingeven.</li>\n" +
    "</ul>\n" +
    "</p>\n" +
    "\n" +
    "<h4>Functioneren van de site</h4>\n" +
    "<p>Wij gebruiken cookies om onze site goed te laten werken. Deze functionele cookies worden alleen voor dit doel gebruikt. Hiermee doen wij het volgende:\n" +
    "visuele instellingen (tekstgrootte, kleuren en dergelijke)\n" +
    "uw naam, e-mailadres en dergelijke zodat u die niet steeds hoeft in te vullen\n" +
    "uw taalvoorkeur\n" +
    "verzoeken om mee te doen aan enquêtes of nieuwsbrieven\n" +
    "te voorkomen dat u een advertentie al te vaak te zien krijgt\n" +
    "U kunt deze cookies blokkeren via uw browser, maar dit kan het functioneren van onze website negatief aantasten.\n" +
    "Social media buttons\n" +
    "Op onze website zijn buttons opgenomen om webpagina’s te kunnen promoten en delen op sociale netwerken, namelijk Facebook, LinkedIn, Twitter, Google+, AddThis, en deze buttons plaatsen cookies.\n" +
    "Deze buttons werken door middel van stukjes code die van deze sociale netwerken zelf afkomstig zijn. Wij hebben daar geen invloed op. Leest u de privacyverklaring van deze netwerken (welke regelmatig kunnen wijzigen) om te lezen wat zij met de (persoons)gegevens doen die zij via deze cookies verkrijgen.</p>\n" +
    "\n" +
    "<h4>Tracking en profielen</h4>\n" +
    "<p>Wij gebruiken zogeheten tracking cookies om een profiel over u op te bouwen. Dit tracking cookie kunnen wij ook opvragen wanneer u een andere website uit ons netwerk bezoekt. Hierdoor kunnen wij te weten komen dat u naast deze website ook op deze andere website(s) bent geweest. Het over u opgebouwde profiel wordt niet gekoppeld aan uw naam, adres, e-mailadres en dergelijke zoals bij ons bekend, maar dient alleen om advertenties af te stemmen op uw profiel, zodat deze zo veel mogelijk relevant voor u zijn.\n" +
    "Met uw toestemming plaatsen onze adverteerders “tracking cookies”op uw computer. Deze cookies gebruiken zij om bij te houden welke pagina’s u bezoekt uit hun netwerk, om zo een profiel op te bouwen van uw online surfgedrag. Dit profiel wordt mede opgebouwd op basis van vergelijkbare informatie die zij van uw bezoek aan andere websites uit hun netwerk krijgen. Dit profiel wordt niet gekoppeld aan uw naam, adres, e-mailadres en dergelijke zoals bij ons bekend, maar dient alleen om advertenties af te stemmen op uw profiel zodat deze zo veel mogelijk relevant voor u zijn.</p>\n" +
    "\n" +
    "<h4>Recht op inzage en correctie of verwijdering van uw gegevens</h4>\n" +
    "<p>U heeft het recht om te vragen om inzage in en correctie of verwijdering van uw gegevens. Zie hiervoor onze contactpagina. Om misbruik te voorkomen kunnen wij u daarbij vragen om u adequaat te identificeren. Wanneer het gaat om inzage in persoonsgegevens gekoppeld aan een cookie, dient u een kopie van het cookie in kwestie mee te sturen. U kunt deze terug vinden in de instellingen van uw browser.\n" +
    "Meestal kunt u cookies wissen via de instellingen van uw browser. Meer informatie omtrent het in- en uitschakelen en het verwijderen van cookies is te vinden in de instructies en/of met behulp van de Help-functie van uw browser.\n" +
    "</p>\n" +
    "\n" +
    "<h4>Meer informatie over cookies</h4>\n" +
    "<p>\n" +
    "Op de volgende websites vindt u meer informatie over cookies:<br />\n" +
    "<ul>\n" +
    "	<li>Consumentenbond: <a href=\"http://www.consumentenbond.nl/veilig-online/extra/wat-zijn-cookies/\" target=\"_blank\">Wat zijn cookies</a></li>\n" +
    "	<li>Consumentenbond: <a href=\"http://www.consumentenbond.nl/internet-privacy/extra/cookies-verwijderen/\" target=\"_blank\">Cookies verwijderen</a></li>\n" +
    "	<li>ICTRecht: Cookierecht.nl <a href=\"http://www.cookierecht.nl/\" target=\"_blank\">alles over cookies en de cookiewet</a></li>\n" +
    "	<li>Your Online Choices: <a href=\"http://www.youronlinechoices.eu/\">A guide to online behavioural advertising</a></li>\n" +
    "</ul>\n" +
    "</p>\n" +
    "</div>"
  );


  $templateCache.put('/app/templates/copyright-policy.html',
    "<div class=\"container\">\n" +
    "<h1>Pagina niet beschikbaar</h1>\n" +
    "<p>Sorrie, deze pagina is niet beschikbaar.</p>\n" +
    "</div>"
  );


  $templateCache.put('/app/templates/privacy-policy.html',
    "<div class=\"container\">\n" +
    "<h1>Pagina niet beschikbaar</h1>\n" +
    "<p>Sorrie, deze pagina is niet beschikbaar.</p>\n" +
    "</div>"
  );


  $templateCache.put('/app/templates/terms-and-conditions.html',
    "<div class=\"container\">\n" +
    "<h1>Pagina niet beschikbaar</h1>\n" +
    "<p>Sorrie, deze pagina is niet beschikbaar.</p>\n" +
    "</div>"
  );
}]);