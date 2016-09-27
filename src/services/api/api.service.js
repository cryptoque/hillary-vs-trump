class ApiService {
  // @ngInject
  constructor($http) {
    this.$http = $http;
  }

  sendVote(payload) {
    return this.$http({
      method: 'POST',
      url: './api/submitVote.php',
      data: angular.toJson(payload)
    });
  }

  lookupCountry() {
    return this.$http({
      method: 'GET',
      url: './api/getCountryCode.php'
    });
  }

  votingResults(scale = 'day') {
    scale = scale === 'day' ? 'day' : 'total';
    return this.$http({
      method: 'GET',
      url: `json/results.${scale}.json`
    });
  }

  topoData() {
    return this.$http({
      method: 'GET',
      url: 'json/countries-iso2.topo.json',
      cache: true
    });
  }
}

export default ApiService;
