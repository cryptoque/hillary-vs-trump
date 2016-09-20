class SplashController {
  // @ngInject
  constructor($window, $rootScope, Languages, translateService) {
    this.$window = $window;
    this.$rootScope = $rootScope;
    this.Languages = Languages;
    this.translateService = translateService;

    this.language = translateService.getCurrentLanguage();
  }

  changeLanguage() {
    this.$window.location = '/?lang=' + this.language;
  }

  hideSplash() {
    this.$rootScope.splashHidden = true;
  }
}

export default SplashController;
