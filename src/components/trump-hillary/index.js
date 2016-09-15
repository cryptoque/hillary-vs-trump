import TrumpHillaryController from './trump-hillary.controller';
import TrumpHillaryDirective from './trump-hillary.directive';

angular.module('Vote')
  .controller('TrumpHillaryController', TrumpHillaryController)
  .directive('trumpHillary', TrumpHillaryDirective);
