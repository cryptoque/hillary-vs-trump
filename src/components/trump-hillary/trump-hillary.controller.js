class TrumpHillaryController {
  // @ngInject
  constructor($window, $rootScope) {
    this.$window = $window;
    this.$rootScope = $rootScope;
  }

  openModal(yourVote) {
    if (!this.$window.localStorage.getItem('hasVoted')) {
      this.yourVote = yourVote;
    }
    this.$rootScope.$broadcast('open-modal');
  }
}

export default TrumpHillaryController;
