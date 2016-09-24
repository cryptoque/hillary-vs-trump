class SplashController {
  // @ngInject
  constructor($window, $rootScope, Languages, translateService) {
    this.$window = $window;
    this.$rootScope = $rootScope;
    this.Languages = Languages;
    this.translateService = translateService;

    this.countryCode = this.$rootScope.countryCode;
    this.language = translateService.getCurrentLanguage();
    this.countryFlag = '<span class="splash__flag flag-icon flag-icon-' + this.countryCode.toLowerCase() + '"></span>';
  }

  changeLanguage() {
    this.$window.location = '?lang=' + this.language;
    this.$window.ga('send', 'event', 'language-change', this.language);
  }

  hideSplash() {
    this.$rootScope.splashHidden = true;
  }
}

export default SplashController;
