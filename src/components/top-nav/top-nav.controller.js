class TopNavController {
  // @ngInject
  constructor($rootScope) {
    this.$rootScope = $rootScope;

    const now = new Date() / 1000;
    const eventDate = 1478563200;
    this.daysLeft = Math.floor((eventDate - now) / (3600 * 24));

  }
}

export default TopNavController;
