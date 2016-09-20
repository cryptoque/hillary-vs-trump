class TrumpHillaryDirective {
  constructor() {
    this.restrict = 'E';
    this.scope = {};
    this.bindToController = {
      countryCode: '='
    };
    this.controller = 'TrumpHillaryController';
    this.controllerAs = '$ctrl';
    this.template = require('./trump-hillary.view.html');
  }
}

// @ngInject
export default () => new TrumpHillaryDirective();
