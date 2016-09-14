class BallotController {
  // @ngInject
  constructor($window, $scope, apiService) {
    this.$window = $window;
    this.$scope = $scope;
    this.apiService = apiService;

    this.$scope.$on('open-modal', (event, yourVote) => {
      this.isVisible = true;
      this.votingEnabled = false;
      // this.hasVoted = this.$window.localStorage.getItem('hasVoted');
      this.hasVoted = false;

      if (!this.hasVoted) {
        this.yourVote = yourVote;
        this.lookupCountry();
      }
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
    if (!this.hasVoted) {
      this.apiError = false;
      this.votingInProgress = true;
      this.apiService.sendVote({ voted: this.yourVote })
        .then(this.votingSuccess)
        .catch(this.votingError)
        .finally(() => {
          this.votingInProgress = false;
        });
    }
  }

  votingSuccess(response) {
    this.hasVoted = true;
    this.$window.localStorage.setItem('hasVoted', this.hasVoted);
  }

  votingError(response) {
    console.log('error', response);
    this.apiError = response.data.error;
  }
}

export default BallotController;
