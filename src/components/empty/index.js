import TopNavController from './top-nav.controller';
import TopNavDirective from './top-nav.directive';

angular.module('Vote')
  .controller('TopNavController', TopNavController)
  .directive('topNav', BallotDirective);
