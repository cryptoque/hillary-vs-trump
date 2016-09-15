class TopNavController {
  // @ngInject
  constructor() {
    const now = new Date() / 1000;
    const eventDate = 1478563200;
    this.daysLeft = Math.round((eventDate - now) / (3600 * 24));
  }
}

export default TopNavController;
