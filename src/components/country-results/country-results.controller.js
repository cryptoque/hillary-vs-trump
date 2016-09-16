class CountryResultsController {
  // @ngInject
  constructor($filter) {
    this.$filter = $filter;
    console.log(this.votingResults);
  }

  candidate(winner) {
    return this.$filter('translate')('shortname.' + (winner === 'R' ? 'trump' : (winner === 'D' ? 'hillary' : '')));
  }
}

export default CountryResultsController;
