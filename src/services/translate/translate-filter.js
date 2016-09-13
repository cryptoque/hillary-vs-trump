/**
 * @ngdoc filter
 * @name translate
 * @description
 *
 * Filter to translate/interpolate translation keys
 *
 * Extra functionality:
 * - Undefined keys will fall back to fallback string
 * - Expands {variables} in translation key
 * - Adds an anchor tag when a linkStart/linkEnd is found in the translation
 *   and a matching 'the.same.translation.key.href' key is present in translations
 * - When bdoStart/bdoEnd is used, that part is set with a bi-directional tag
 * - When a reference is set after the linkStart, it will find the link in the translation file,
 *   for example: {{linkStart=general-link}}here{{linkEnd}}
 *
 * Examples:
 *
 * {{::'translate-key' | translate}}
 * {{'translate-key-with-values' | translate:'{value: "5", otherValue: "hello"}'}}
 * {{'translate-key-with-values' | translate:'{value: variableFromScope}':this}}
 * <div ng-bind-html="'translate-key-with-html'|translate"></div>
 *
 */

// @ngInject
function translateFilter(translateService, $parse, $interpolate) {
  let translateFilter = function (key, interpolateParams, scope) {

    function createHref (link) {
      return '<a href=\'' + link + '\'' + (link.match(/^(ftp|http|https):\/\//) ? ' target=\'_blank\'>' : '>');
    }

    if (typeof key === 'string') {
      var translation;

      // Find translation
      translation = translateService.getTranslation(key);

      // Interpolate variables
      if (translation) {
        if (!angular.isObject(interpolateParams)) {
          interpolateParams = $parse(interpolateParams)(scope) || {};
        }

        if (translation.match(/\{\{boldStart\}\}/) && translation.match(/\{\{boldEnd\}\}/)) {
          interpolateParams.boldStart = '<b>';
          interpolateParams.boldEnd = '</b>';
        }

        translation = $interpolate(translation)(interpolateParams);
      }

      return translation;
    }
  };

  translateFilter.$stateful = true;

  return translateFilter;
}

// @ngInject
export default (translateService, $parse, $interpolate) => translateFilter(translateService, $parse, $interpolate);
