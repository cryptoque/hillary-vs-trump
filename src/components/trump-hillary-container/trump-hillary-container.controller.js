class TrumpHillaryContainerController {
  // @ngInject
  constructor($window, $timeout, $rootScope) {
    this.$window = $window;
    this.$timeout = $timeout;
    this.$rootScope = $rootScope;
  }

  openModal(yourVote) {
    this.yourVote = yourVote;
    this.$timeout(() => {
      this.$rootScope.$broadcast('open-modal');
    }, 500);
  }

}

export default TrumpHillaryContainerController;
