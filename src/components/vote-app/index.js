import VoteAppController from './vote-app.controller';
import VoteAppDirective from './vote-app.directive';

angular.module('Vote')
  .controller('VoteAppController', VoteAppController)
  .directive('voteApp', VoteAppDirective);
