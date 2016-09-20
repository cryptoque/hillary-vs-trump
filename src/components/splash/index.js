import SplashController from './splash.controller';
import SplashDirective from './splash.directive';

angular.module('Vote')
  .controller('SplashController', SplashController)
  .directive('splash', SplashDirective);
