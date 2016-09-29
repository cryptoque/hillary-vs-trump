class TopNavController {
  // @ngInject
  constructor($window, $rootScope, EndDate) {
    this.$window = $window;
    this.$rootScope = $rootScope;

    const now = new Date() / 1000;
    this.daysLeft = Math.floor((EndDate - now) / (3600 * 24));
  }

  sendGAEvent(label, value) {
    this.$window.ga('send', 'event', label, value);
  }
}

export default TopNavController;
