class CountryResultsController {
  // @ngInject
  constructor($filter) {
    this.$filter = $filter;
    this.thresholdReached = this.votingResults.total.D + this.votingResults.total.R > 1000;
    this.countries = this.sortedResults(this.votingResults.countries);
  }

  candidate(winner) {
    const candidate = (winner === 'R' ? 'trump' : (winner === 'D' ? 'hillary' : 'split'));
    return this.$filter('translate')('shortname.' + candidate);
  }

  sortedResults(countriesAsObject) {
    let arrayOfCountries = [];
    angular.forEach(countriesAsObject, (v, k) => {
      arrayOfCountries.push([this.$filter('translate')('country.' + k).toLowerCase(), k, v]);
    });
    return arrayOfCountries.sort(this.compare);
  }

  compare(a, b) {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
  }
}

export default CountryResultsController;
