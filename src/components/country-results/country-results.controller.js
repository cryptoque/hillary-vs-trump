class CountryResultsController {
  // @ngInject
  constructor($filter) {
    this.$filter = $filter;
    this.thresholdReached = this.votingResults.total.D + this.votingResults.total.R > 1000;
  }

  candidate(winner) {
    const candidate = (winner === 'R' ? 'trump' : (winner === 'D' ? 'hillary' : 'split'));
    return this.$filter('translate')('shortname.' + candidate);
  }
}

export default CountryResultsController;
