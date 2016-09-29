class TrumpHillaryContainerController {
  // @ngInject
  constructor($window, $timeout, $rootScope) {
    this.$window = $window;
    this.$timeout = $timeout;
    this.$rootScope = $rootScope;

    // Switch the position of hillary and trump at random to make automated voting more difficult
    this.switcheroo = !!Math.round(Math.random(0,1));
  }

  openModal(yourVote) {
    this.yourVote = yourVote;
    this.$timeout(() => {
      this.$rootScope.$broadcast('open-modal');
    }, 500);
  }
}

export default TrumpHillaryContainerController;
