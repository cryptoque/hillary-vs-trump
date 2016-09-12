class VoteAppController {
  // @ngInject
  constructor($scope, $log) {
    this.$scope = $scope;
    this.$log = $log;

    this.$log.info('controller');
  }
}

export default VoteAppController;
