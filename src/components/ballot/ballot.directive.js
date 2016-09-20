class BallotDirective {
  constructor() {
    this.restrict = 'E';
    this.scope = {};
    this.bindToController = {
      yourVote: '=',
      countryCode: '='
    };
    this.controller = 'BallotController';
    this.controllerAs = '$ctrl';
    this.template = require('./ballot.view.html');
    this.link = this.link.bind(this);
  }

  link(scope, element, attrs, ctrl) {
    // Close the search on ESC
    angular.element(document).keydown((event) => {
      if (event.keyCode === 27) {
        event.preventDefault();
        ctrl.closeModal();
      }
    });
  }
}

// @ngInject
export default () => new BallotDirective();
