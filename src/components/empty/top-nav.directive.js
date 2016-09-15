class TopNavDirective {
  constructor() {
    this.restrict = 'E';
    this.scope = {};
    this.bindToController = {};
    this.controller = 'TopNavController';
    this.controllerAs = '$ctrl';
    this.template = require('./top-nav.view.html');
  }
}

// @ngInject
export default () => new TopNavDirective();
