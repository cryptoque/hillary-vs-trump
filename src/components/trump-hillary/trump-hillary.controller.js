class TrumpHillaryController {
  // @ngInject
  constructor($rootScope) {
    this.$rootScope = $rootScope;
  }

  openModal(yourVote) {
    this.$rootScope.$broadcast('open-modal', yourVote);
  }
}

export default TrumpHillaryController;
