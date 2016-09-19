angular.module('Vote', [
    'ngSanitize',
    'ui.router',
    'vcRecaptcha',
    '720kb.socialshare',
    'duScroll'
  ])

  .constant('Languages', [ 'en', 'nl', 'fr', 'de', 'es', 'ar', 'ru', 'ja', 'zh-CN'  ])

  // @ngInject
  .config(($stateProvider, $urlRouterProvider, translateServiceProvider, vcRecaptchaServiceProvider, Languages) => {

    // Detect language
    const language = translateServiceProvider.detectLanguage(Languages);
    translateServiceProvider.setTranslation(`translations/${language}/labels.json`);
    translateServiceProvider.setFallbackTranslation(`translations/en/labels.json`);

    // States
    $stateProvider
      .state('root', {
        abstract: true,
        url: '?lang',
        template: '<ui-view></ui-view>',
        resolve: {
          translationsLoaded: (translateService) => {
            return translateService.isLoaded();
          }
        }
      })
      .state('root.index', {
        url: '/',
        controllerAs: '$ctrl',
        //@ngInject
        controller: function() {},
        template: require('./views/root.index.html')
      })
      .state('root.results', {
        url: '/results',
        controllerAs: '$ctrl',
        //@ngInject
        controller: function(votingResults, topoData) {
          this.votingResults = votingResults.data;
          this.topoData = topoData.data;
        },
        template: require('./views/root.results.html'),
        resolve: {
          votingResults: ($http) => {
            return $http.get('json/results.json');
          },
          topoData: ($http) => {
            return $http.get('json/countries-iso2.topo.json');
          }
        }
      })
      .state('root.faq', {
        url: '/faq',
        controllerAs: '$ctrl',
        //@ngInject
        controller: function(Languages) {
          this.Languages = Languages;
        },
        template: require('./views/root.faq.html')
      });

    // Redirect unknown states to the root state
    $urlRouterProvider
      .otherwise('/');

    // Initialize reCaptcha
    vcRecaptchaServiceProvider.setSiteKey('6LewDCoTAAAAAMpHUX9TQWjTPoCQ08SNBbdUk926')
  })

  // @ngInject
  .run((translateService) => {

    // Load translations
    translateService.loadTranslations();

  });
