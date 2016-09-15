import WorldMapController from './world-map.controller';
import WorldMapDirective from './world-map.directive';

angular.module('Vote')
  .controller('WorldMapController', WorldMapController)
  .directive('worldMap', WorldMapDirective);
