class SplashDirective {
  constructor() {
    this.restrict = 'E';
    this.scope = {};
    this.bindToController = {
      countryCode: '='
    };
    this.controller = 'SplashController';
    this.controllerAs = '$ctrl';
    this.template = require('./splash.view.html');
  }
}

// @ngInject
export default () => new SplashDirective();
