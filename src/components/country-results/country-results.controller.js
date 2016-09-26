class CountryResultsController {
  // @ngInject
  constructor($filter, CountryThreshold) {
    this.$filter = $filter;
    this.CountryThreshold = CountryThreshold;
  }

  candidate(winner) {
    const candidate = (winner === 'R' ? 'trump' : (winner === 'D' ? 'hillary' : 'split'));
    return this.$filter('translate')('shortname.' + candidate);
  }
}

export default CountryResultsController;
