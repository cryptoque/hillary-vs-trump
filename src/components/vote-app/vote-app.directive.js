class VoteAppDirective {
  constructor() {
    this.restrict = 'E';
    this.scope = {};
    this.replace = true;
    this.template = require('./vote-app.view.html');
  }
}

// @ngInject
export default () => new VoteAppDirective();
