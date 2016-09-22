class TrumpHillaryContainerDirective {
  constructor() {
    this.restrict = 'E';
    this.scope = {};
    this.bindToController = {};
    this.controller = 'TrumpHillaryContainerController';
    this.controllerAs = '$ctrl';
    this.template = require('./trump-hillary-container.view.html');
  }
}

// @ngInject
export default () => new TrumpHillaryContainerDirective();
