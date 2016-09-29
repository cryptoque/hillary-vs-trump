class BallotController {
  // @ngInject
  constructor($window, $rootScope, $scope, $timeout, $filter, $base64, apiService, Ts) {
    this.$window = $window;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$filter = $filter;
    this.$base64 = $base64;
    this.apiService = apiService;
    this.Ts = Ts;

    this.countryCode = this.$rootScope.countryCode;
    this.isVisible = false;

    this.$scope.$on('open-modal', (event) => {
      this.isVisible = true;
      this.now =  Math.round(new Date().getTime() / 1000);
      this.lastVote =  Math.round(this.$window.localStorage.getItem('hasVoted') / 1000) || 0;
      this.timePast = this.now - this.lastVote;
      this.hasVoted = this.timePast <= (24*60*60);

      if(this.detectHeadlessBrowser()) {
        this.hasVoted = true;
      }
    });

    this.$scope.$on('close-modal', (event) => {
      this.isVisible = false;

      this.$timeout(() => {
        this.yourVote = false;
        this.votedFor = false;
      }, 2500);
    });

    this.votingSuccess = this.votingSuccess.bind(this);
    this.votingError = this.votingError.bind(this);
  }

  submitVote() {
    if (this.ballotForm.$valid) {
      this.apiError = false;
      this.votingInProgress = true;
      this.apiService.sendVote({
        voted: this.yourVote,
        t: this.$base64.encode(this.$rootScope.token + ':' + this.Ts),
        n: this.apiService.nonce(this.yourVote + ':' + this.$rootScope.token),
        p: this.apiService.nonce(window.navigator.userAgent) * 4
      })
      .then(this.votingSuccess)
      .catch(this.votingError)
      .finally(() => {
        this.votingInProgress = false;
      });
    }
  }

  votingSuccess(response) {
    this.hasVoted = new Date().getTime();
    this.votedFor = this.yourVote;
    this.$window.localStorage.setItem('hasVoted', this.hasVoted);
  }

  votingError(response) {
    this.apiError = response.data.error;
  }

  candidate(c) {
    return this.$filter('translate')('fullname.' + (c === 'R' ? 'trump' : (c === 'D' ? 'hillary' : '')));
  }

  closeModal() {
    this.$timeout(() => {
      this.$rootScope.$broadcast('close-modal');
    }, 0);
  }

  sendGAEvent(label, value) {
    this.$window.ga('send', 'event', label, value);
  }

  detectHeadlessBrowser() {
    return typeof window._phantom !== 'undefined' ||
      typeof window.callPhantom !== 'undefined' ||
      typeof window.__phantomas !== 'undefined' ||
      typeof window.Buffer !== 'undefined' ||
      typeof window.emit !== 'undefined' ||
      typeof window.spawn !== 'undefined' ||
      typeof window.webdriver !== 'undefined' ||
      typeof window.domAutomation !== 'undefined' ||
      typeof window.domAutomationController !== 'undefined' ||
      (window.outerWidth === 0 && window.outerHeight === 0);
  }
}

export default BallotController;
