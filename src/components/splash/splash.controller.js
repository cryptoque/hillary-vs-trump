class SplashController {
  // @ngInject
  constructor($window, Languages, translateService) {
    this.$window = $window;
    this.Languages = Languages;
    this.translateService = translateService;

    this.language = translateService.getCurrentLanguage();
  }

  changeLanguage() {
    this.$window.location = '/?lang=' + this.language;
  }

}

export default SplashController;
