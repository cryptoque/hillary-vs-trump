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
