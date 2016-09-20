class WorldMapDirective {
  constructor() {
    this.restrict = 'E';
    this.scope = {};
    this.bindToController = {
      votingResults: '=',
      topoData: '='
    };
    this.controller = 'WorldMapController';
    this.controllerAs = '$ctrl';
    this.template = require('./world-map.view.html');
  }

  link(scope, element, attrs, ctrl) {
    ctrl.initMap();
  }
}

// @ngInject
export default () => new WorldMapDirective();
