class VoteService {
  // @ngInject
  constructor($http) {
    this.$http = $http;
  }

  sendVote(payload) {
    return this.$http({
      method: 'POST',
      url: './vote.php',
      data: angular.toJson(payload)
    });
  }
}

export default VoteService;
