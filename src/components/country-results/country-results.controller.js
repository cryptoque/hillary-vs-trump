class CountryResultsController {
  // @ngInject
  constructor($filter) {
    this.$filter = $filter;
    console.log(this.votingResults);
  }

  candidate(winner) {
    const candidate = (winner === 'R' ? 'trump' : (winner === 'D' ? 'hillary' : 'split'));
    return this.$filter('translate')('shortname.' + candidate);
  }
}

export default CountryResultsController;
