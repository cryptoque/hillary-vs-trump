import VoteAppDirective from './vote-app.directive';
import VoteAppController from './vote-app.controller';

angular.module('Vote')
  .directive('voteApp', VoteAppDirective)
  .controller('VoteAppController', VoteAppController);
