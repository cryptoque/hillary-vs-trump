class BallotDirective {
  constructor() {
    this.restrict = 'E';
    this.scope = {};
    this.bindToController = {
      isVisible: '='
    };
    this.controller = 'BallotController';
    this.controllerAs = '$ctrl';
    this.template = require('./ballot.view.html');
  }
}

// @ngInject
export default () => new BallotDirective();
