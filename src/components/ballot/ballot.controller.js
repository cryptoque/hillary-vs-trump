class BallotController {
  // @ngInject
  constructor($scope, apiService) {
    this.$scope = $scope;
    this.apiService = apiService;

    this.$scope.$on('open-modal', (event, yourVote) => {
      this.yourVote = yourVote;
      this.votingEnabled = false;
      this.isVisible = true;
      this.lookupCountry();
    });

    this.votingSuccess = this.votingSuccess.bind(this);
    this.votingError = this.votingError.bind(this);
  }

  lookupCountry() {
    this.apiService.lookupCountry()
      .then((response) => {
        this.countryCode = response.data.country;
      })
      .catch((response) => {
        this.countryCode = 'UNKNOWN';
      });
  }

  submitVote() {
    this.apiError = false;
    this.votingInProgress = true;
    this.apiService.sendVote({ voted: this.yourVote })
      .then(this.votingSuccess)
      .catch(this.votingError)
      .finally(() => {
        this.votingInProgress = false;
      });
  }

  votingSuccess(response) {
    console.log('succes', response);
    // TODO
    //  - localStorage, voting success
  }

  votingError(response) {
    console.log('error', response);
    this.apiError = response.data.error;
  }
}

export default BallotController;
