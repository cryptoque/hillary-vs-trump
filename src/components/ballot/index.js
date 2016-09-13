import BallotController from './ballot.controller';
import BallotDirective from './ballot.directive';

angular.module('Vote')
  .controller('BallotController', BallotController)
  .directive('ballot', BallotDirective);
