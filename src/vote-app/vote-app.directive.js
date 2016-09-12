class VoteAppDirective {
  constructor(/* dependency injection */) {
    this.restrict = 'E';
    this.scope = {};
    this.bindToController = {
    };
    this.controller = 'VoteAppController';
    this.controllerAs = 'ctrl';
    this.template = require('./vote-app.view.html');
  }
}

// @ngInject
export default (/* dependency injection */) => {
  return new VoteAppDirective(/* dependency injection */);
};
