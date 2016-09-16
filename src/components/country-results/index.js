import CountryResultsController from './country-results.controller';
import CountryResultsDirective from './country-results.directive';

angular.module('Vote')
  .controller('CountryResultsController', CountryResultsController)
  .directive('countryResults', CountryResultsDirective);
