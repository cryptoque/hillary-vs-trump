angular.module('Vote', [
    'ngAnimate',
    'ngSanitize',
    'ui.router',
    '720kb.socialshare',
    'duScroll'
  ])

  .constant('Languages', [ 'en', 'fr', 'de', 'es', 'pt', 'ar', 'ru', 'ja', 'zh-CN'  ])

  // @ngInject
  .config(($stateProvider, $urlRouterProvider, translateServiceProvider, Languages) => {

    // Detect language
    const language = translateServiceProvider.detectLanguage(Languages);
    translateServiceProvider.setTranslation(`translations/labels.${language}.json`);
    translateServiceProvider.setFallbackTranslation(`translations/labels.en.json`);

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
