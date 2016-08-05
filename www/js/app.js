angular.module('app', ['ionic', 'app.controllers', 'app.services', 'app.directives'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:
    .state('tab.news', {
        url: '/news',
        views: {
            'tab-news': {
                templateUrl: 'templates/tab-news.html',
                controller: 'NewsCtrl'
            }
        }
    })

    .state('tab.news-detail', {
        url: '/news/:newsId',
        views: {
            'tab-news': {
                templateUrl: 'templates/news-detail.html',
                controller: 'NewsDetailCtrl'
            }
        }
    })

    .state('tab.service', {
        url: '/service',
        views: {
            'tab-service': {
                templateUrl: 'templates/tab-service.html',
                controller: 'ServiceCtrl'
            }
        }
    })

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/news');

    $ionicConfigProvider.platform.android.tabs.position('bottom');
});
