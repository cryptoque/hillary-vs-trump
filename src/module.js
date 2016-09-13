
angular.module('Vote', [ 'ngSanitize', 'ui.router' ])
  .config(($stateProvider, $urlRouterProvider, translateServiceProvider) => {

    // Detect language
    const language = translateServiceProvider.detectLanguage();
    translateServiceProvider.setTranslation(`translations/${language}/labels.json`);

    // States
    let translationsPromise;
    $stateProvider
      .state('root', {
        abstract: true,
        url: '',
        template: require('./views/root.html'),
        resolve: {
          translationsLoaded: ($rootScope, $q) => {
            // Listen for translationsLoaded event and resolve state
            function createTranslationsPromise() {
              var deferred = $q.defer();
              $rootScope.$on('translationsLoaded', deferred.resolve);
              translationsPromise = deferred.promise;
              return translationsPromise;
            }
            return translationsPromise || createTranslationsPromise();
          }
        }
      })
      .state('root.index', {
        url: '/',
        template: require('./views/root.index.html')
      })
      .state('root.results', {
        url: '/results',
        template: require('./views/root.results.html')
      });

    // Redirect unknown states to the root state
    $urlRouterProvider
      .otherwise('/');
  })
  .run((translateService) => {

    // Load translations
    translateService.loadTranslations();

  });
