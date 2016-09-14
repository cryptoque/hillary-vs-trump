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
}

export default ApiService;
