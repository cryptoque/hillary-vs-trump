class TopNavController {
  // @ngInject
  constructor($window, $rootScope) {
    this.$window = $window;
    this.$rootScope = $rootScope;

    const now = new Date() / 1000;
    const eventDate = 1478563200;
    this.daysLeft = Math.floor((eventDate - now) / (3600 * 24));
  }

  sendGAEvent(label, value) {
    this.$window.ga('send', 'event', label, value);
  }
}

export default TopNavController;
