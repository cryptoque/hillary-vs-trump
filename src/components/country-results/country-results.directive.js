class CountryResultsDirective {
  constructor() {
    this.restrict = 'E';
    this.scope = {};
    this.bindToController = {
      votingResults: '='
    };
    this.controller = 'CountryResultsController';
    this.controllerAs = '$ctrl';
    this.template = require('./country-results.view.html');
  }
}

// @ngInject
export default () => new CountryResultsDirective();
