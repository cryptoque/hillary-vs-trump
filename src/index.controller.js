class IndexController {
  // @ngInject
  constructor($scope) {
    this.$scope = $scope;
    this.modalVisible = false;
  }

  openModal(yourVote) {
    this.$scope.$broadcast('open-modal', yourVote);
  }
}

export default IndexController;
