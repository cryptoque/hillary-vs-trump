import IndexController from './index.controller.js';

angular.module('Vote', [
    'ngSanitize',
    'ui.router',
    'vcRecaptcha'
  ])

  .controller('IndexController', IndexController)

  // @ngInject
  .config(($stateProvider, $urlRouterProvider, translateServiceProvider, vcRecaptchaServiceProvider) => {

    // Detect language
    const language = translateServiceProvider.detectLanguage([ 'en', 'nl' ]);
    // const language = 'nl';
    translateServiceProvider.setTranslation(`translations/${language}/labels.json`);
    translateServiceProvider.setFallbackTranslation(`translations/en/labels.json`);

    // States
    let translationsPromise;
    $stateProvider
      .state('root', {
        abstract: true,
        url: '',
        template: require('./views/root.html'),
        resolve: {
          translationsLoaded: (translateService) => {
            return translateService.isLoaded();
          }
        }
      })
      .state('root.index', {
        url: '/',
        controllerAs: '$ctrl',
        controller: 'IndexController',
        template: require('./views/root.index.html')
      })
      .state('root.results', {
        url: '/results',
        template: require('./views/root.results.html')
      })
      .state('root.faq', {
        url: '/faq',
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
