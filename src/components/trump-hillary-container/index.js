import TrumpHillaryContainerController from './trump-hillary-container.controller';
import TrumpHillaryContainerDirective from './trump-hillary-container.directive';

angular.module('Vote')
  .controller('TrumpHillaryContainerController', TrumpHillaryContainerController)
  .directive('trumpHillaryContainer', TrumpHillaryContainerDirective);
