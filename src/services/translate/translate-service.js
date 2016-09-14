class TranslateProvider {
  constructor() {
    this.translation = '';
    this.fallbackTranslation = '';
    this.translationTable = '';
    this.fallbackString = ' '; // by default a space to satisfy one-time binded translations
    this.translationsLoaded = false;
    this.translationsLoadedPromise = false;
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

  detectLanguage(availableLanguages) {
    let preferredLanguage;
    if (navigator.languages) {
      let filtered = navigator.languages.filter((value) => availableLanguages.includes(value.substr(0, 2)));
      preferredLanguage = filtered[0];
    } else {
      preferredLanguage = (navigator.language || navigator.userLanguage);
    }
    return (preferredLanguage ? preferredLanguage.substr(0, 2) : availableLanguages[0]);
  }

  // @ngInject
  $get ($rootScope, $log, $http, $q) {
    return {
      getTranslation: (key) => {
        let translation;
        if (this.translationsLoadedPromise) {
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
        return this.translationsLoadedPromise;
      },

      loadTranslations: () => {
        this.translationsLoaded = $q.defer();
        this.translationsLoadedPromise = this.translationsLoaded.promise;

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
            this.translationTable = angular.extend({},
              translationResponse.fallbackCall && translationResponse.fallbackCall.data,
              translationResponse.translationCall && translationResponse.translationCall.data);

            this.translationsLoaded.resolve();

            // Remove cloak class from html-tag
            angular.element('html').removeClass('translate-cloaked');
          });
        } else {

          this.translationsLoaded.resolve();
        }
      }
    };
  }
}

export default TranslateProvider;
