angular.module('Vote', [
    'ngAnimate',
    'ngSanitize',
    'ui.router',
    'base64',
    '720kb.socialshare',
    'duScroll',
    'ng.deviceDetector'
  ])

  .constant('Languages', [ 'en', 'fr', 'de', 'es', 'pt', 'ar', 'ru', 'ja', 'zh-CN'  ])
  .constant('CountryThreshold', 20)
  .constant('EndDate', 1478563200)
  .constant('Ns', 'OCqSjB45mTglboj6Y5lxAXF0zDB7TkNPShN2h3vkSqpDqE1oTsoUzSSDV7oxdssiOglgASaY6p7YKJMrXIcBlti1QgBDWfnosGG1')
  .constant('Ts', '1JZDf51XSFzswQ1xoTqNjGGQyPswcfZlO5bmokOjAO4uRDdkGfTQivejlnZHYwrknjcX5MzhR5ElUOaEu0y5Tk9kLFyj2c74khWO')

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
        url: '/results/:scale',
        params: {
          scale: 'day'
        },
        resolve: {
          votingResults: ($stateParams, apiService) => {
            return apiService.votingResults($stateParams['scale']);
          },
          topoData: (apiService) => {
            return apiService.topoData();
          }
        },
        controllerAs: '$ctrl',
        //@ngInject
        controller: function($timeout, $state, $stateParams, votingResults, topoData, EndDate) {
          this.votingResults = votingResults.data;
          this.topoData = topoData.data;
          this.timeScale = $stateParams.scale;
          this.endDateReached = (new Date().getTime() / 1000) > EndDate;

          // Reload page every 61 seconds
          let once = $timeout(() => {
            $timeout.cancel(once);
            $state.reload();
          }, 60001);

          this.switchTimeScale = function() {
            $state.go($state.current, { scale: this.timeScale });
          }
        },
        template: require('./views/root.results.html')
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
