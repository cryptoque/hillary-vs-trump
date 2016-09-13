/**
 * @ngdoc service
 * @name Translate
 * @description
 *
 * Service to load translations
 * Used as a provider in config phase to define primary/fallback as follows:
 *
 *     tntTranslateServiceProvider.setTranslation(url_to_translation);
 *     tntTranslateServiceProvider.setFallbackTranslation(url_to_fallback_translation);
 *
 * Next you can use the translate service to load the translations in run phase or main controller:
 *
 *     tntTranslateService.loadTranslations();
 *
 * The translation keys returned by these requests are merged into one translation table, where any missing primary keys
 * will be amended with fallback keys. Undefined keys in both translations will fall back to the fallback string.
 *
 * While the translations are loading a .tnt-translate-cloaked class is applied to the html-tag
 * you can use the .tnt-translate-cloak class in common to color:transparent a translation string
 *
 * See the translate-filter for more information about usage.
 */
class TranslateProvider {
  constructor() {
    this.translation = '';
    this.fallbackTranslation = '';
    this.translationTable = '';
    this.translationsLoaded = false;
    this.fallbackString = ' '; // by default a space to satisfy one-time binded translations
    this.availableLanguages = [ 'en', 'nl' ];
  }

  setTranslation (url) {
    this.translation = url;
  }

  setFallbackTranslation (url) {
    this.fallbackTranslation = url;
  }

  setFallbackString (string) {
    this.fallbackString = string;
  }

  detectLanguage() {
    let preferredLanguage;

    if (navigator.languages) {

      let filtered = navigator.languages.filter((value) => this.availableLanguages.includes(value.substr(0, 2)));
      preferredLanguage = filtered[0];

    } else {

      preferredLanguage = (navigator.language || navigator.userLanguage);

    }

    return (preferredLanguage ? preferredLanguage.substr(0, 2) : this.availableLanguages[0]);
  }

  $get ($rootScope, $log, $http, $q) {
    return {
      getTranslation: (key) => {
        let translation;
        if (this.translationsLoaded) {
          if (angular.isObject(this.translationTable) && angular.isDefined(this.translationTable[key])) {
            translation = this.translationTable[key];
          } else {
            // Fall back to 'XXX' if no translation can be found
            translation = this.fallbackString;
          }
        }
        return translation;
      },

      isLoaded: () => {
        return !!this.translationsLoaded;
      },

      loadTranslations: () => {
        if (this.translation) {
          // Add a cloak class to html-tag
          angular.element('html').addClass('translate-cloaked');

          let translationCall = $http({
            method: 'GET',
            url: this.translation
          }).catch((error) => {
            $log.warn('Failed to load translation ' + error);
          });

          let fallbackCall;
          if (this.fallbackTranslation !== this.translation) {
            fallbackCall = $http({
              method: 'GET',
              url: this.fallbackTranslation
            }).catch((error) => {
              $log.warn('Failed to load fallback translation ' + error);
            });
          } else {
            fallbackCall = $q.when({});
          }

          $q.all({
            fallbackCall: fallbackCall,
            translationCall: translationCall
          }).then((translationResponse) => {
            this.translationTable = _.merge({},
              _.get(translationResponse, 'fallbackCall.data'),
              _.get(translationResponse, 'translationCall.data'));

            this.translationsLoaded = true;
            this.broadcastEvent($rootScope);

            // Remove cloak class from html-tag
            angular.element('html').removeClass('translate-cloaked');
          });
        } else {
          this.translationsLoaded = true;
          this.broadcastEvent($rootScope);
        }
      }
    };
  }

  broadcastEvent($rootScope) {
    $rootScope.$broadcast('translationsLoaded');
  }
}

export default TranslateProvider;
