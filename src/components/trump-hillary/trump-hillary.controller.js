class TrumpHillaryController {
  // @ngInject
  constructor($rootScope) {
    this.$rootScope = $rootScope;

    this.$rootScope.$on('close-modal', (event, yourVote) => {
      this.yourVote = false;
    });
  }

  openModal(yourVote) {
    this.yourVote = yourVote;
    this.$rootScope.$broadcast('open-modal');
  }
}

export default TrumpHillaryController;
