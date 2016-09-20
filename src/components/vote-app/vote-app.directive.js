class VoteAppDirective {
  constructor() {
    this.restrict = 'E';
    this.scope = {};
    this.bindToController = {};
    this.controller = 'VoteAppController';
    this.controllerAs = '$ctrl';
    this.replace = true;
    this.template = require('./vote-app.view.html');
  }
}

// @ngInject
export default () => new VoteAppDirective();
