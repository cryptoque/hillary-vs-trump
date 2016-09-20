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

    this.isVisible =  false;

    this.$scope.$on('open-modal', (event) => {
      this.isVisible = true;
      this.hasVoted = this.$window.localStorage.getItem('hasVoted');
    });

    this.$scope.$on('close-modal', (event) => {
      this.isVisible = false;
      this.yourVote = false;
    });

    this.votingSuccess = this.votingSuccess.bind(this);
    this.votingError = this.votingError.bind(this);
  }

  submitVote() {
    if (this.ballotForm.$valid) {
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
    this.$timeout(() => {
      this.vcRecaptchaService.reload();
    }, 500);
  }

  candidate() {
    return this.$filter('translate')('fullname.' + (this.yourVote === 'R' ? 'trump' : (this.yourVote === 'D' ? 'hillary' : '')));
  }

  closeModal() {
    this.$timeout(() => {
      this.$rootScope.$broadcast('close-modal');
    }, 0);
  }
}

export default BallotController;
