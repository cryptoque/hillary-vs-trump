import TranslateProvider from './translate-service';
import translateFilter from './translate-filter';

angular.module('Vote')
  .provider('translateService', TranslateProvider)
  .filter('translate', translateFilter);
