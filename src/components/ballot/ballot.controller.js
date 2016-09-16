class BallotController {
  // @ngInject
  constructor($window, $rootScope, $scope, $timeout, $filter, vcRecaptchaService, apiService) {
    this.$window = $window;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$filter = $filter;
    this.vcRecaptchaService = vcRecaptchaService;
    this.apiService = apiService;
    this.isVisible = false;

    this.$scope.$on('open-modal', (event, yourVote) => {
      this.isVisible = true;
      this.votingEnabled = false;
      this.hasVoted = this.$window.localStorage.getItem('hasVoted');
      // this.hasVoted = false;

      if (!this.hasVoted) {
        this.yourVote = yourVote;
        this.lookupCountry();
      }
    });

    this.$scope.$on('close-modal', (event, yourVote) => {
      this.isVisible = false;
    });

    //Temp
    // this.yourVote = 'D';
    // this.countryCode = 'AZ';
    // this.hasVoted = true;
    // this.isVisible = true;

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
    this.apiError = response.data.error;
    this.vcRecaptchaService.reload();
  }

  candidate() {
    return this.$filter('translate')('fullname.' + (this.yourVote === 'R' ? 'trump' : 'hillary'));
  }

  closeModal() {
    this.$timeout(() => {
      this.$rootScope.$broadcast('close-modal');
    }, 10);
  }
}

export default BallotController;
