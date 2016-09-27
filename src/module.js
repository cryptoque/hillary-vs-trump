angular.module('Vote', [
    'ngAnimate',
    'ngSanitize',
    'ui.router',
    '720kb.socialshare',
    'duScroll',
    'ng.deviceDetector'
  ])

  .constant('Languages', [ 'en', 'fr', 'de', 'es', 'pt', 'ar', 'ru', 'ja', 'zh-CN'  ])
  .constant('CountryThreshold', 20)

  // @ngInject
  .config(($stateProvider, $urlRouterProvider, translateServiceProvider, Languages) => {

    // Detect language
    const language = translateServiceProvider.detectLanguage(Languages);
    translateServiceProvider.setTranslation(`json/translations/labels.${language}.json`);
    translateServiceProvider.setFallbackTranslation(`json/translations/labels.en.json`);

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
        controller: function($rootScope, countryLookup) {
          $rootScope.countryCode = countryLookup.data.country;
          $rootScope.token = countryLookup.data.token;
        },
        template: require('./views/root.index.html'),
        resolve: {
          countryLookup: (apiService) => {
            return apiService.lookupCountry();
          }
        }
      })
      .state('root.results', {
        url: '/results?filter-anon',
        controllerAs: '$ctrl',
        //@ngInject
        controller: function($timeout, $state, votingResults, topoData) {
          this.votingResults = votingResults.data;
          this.topoData = topoData.data;

          // Reload page every 61 seconds
          let once = $timeout(() => {
            $timeout.cancel(once);
            $state.reload();
          }, 60001);
        },
        template: require('./views/root.results.html'),
        resolve: {
          votingResults: ($stateParams, apiService) => {
            return apiService.votingResults($stateParams['filter-anon'] === 'true');
          },
          topoData: (apiService) => {
            return apiService.topoData();
          }
        }
      })
      .state('root.info', {
        url: '/info',
        controllerAs: '$ctrl',
        //@ngInject
        controller: function() {},
        template: require('./views/root.info.html')
      });

    // Redirect unknown states to the root state
    $urlRouterProvider
      .otherwise('/');
  })

  // @ngInject
  .run(($rootScope, $window, $location, translateService) => {

    // Load translations
    translateService.loadTranslations();

    // Google Analytics
    $window.ga('create', 'UA-83949074-2', 'auto');

    $rootScope.$on('$stateChangeSuccess', function (event) {
      $window.ga('send', 'pageview', $location.path());
    });
  });
