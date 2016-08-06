angular.module('app.controllers', [])

.controller('ServiceCtrl', function($scope) {})

.controller('NewsCtrl', function($scope, $timeout, $ionicLoading,
    $ionicScrollDelegate,
    $ionicSlideBoxDelegate,
    $ionicScrollDelegate,
    News) {

    var pageCount = 0;
    var newsList = [];

    $scope.hasMore = true;
    $scope.slides = [];
    $scope.newsList = [];
    $scope.categories = [];
    $scope.slideIndex = 0;

    function isSlide(news) {
        return news.large_image;
    }

    function notSlide(news) {
        return !news.large_image;
    }

    function loadCategories() {
        News.getCategories(function(categories) {
            $scope.categories = categories;
        });
    }

    $scope.$on('$ionicView.enter', function(e) {
        $timeout(function() {
            $ionicSlideBoxDelegate.$getByHandle('outer-slider').slide(0);
        }, 500);
    });

    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });

    $scope.enableOuterSlider = function(enable) {
        $ionicSlideBoxDelegate.$getByHandle('outer-slider').enableSlide(enable);
    };

    $scope.activeSlide = function(index) {
        $ionicSlideBoxDelegate.$getByHandle('outer-slider').slide(index);
    };

    $scope.outerSlideChanged = function(index) {
        $ionicScrollDelegate.$getByHandle('tabs-scroll').scrollTo(index * 40);
    };

    $scope.doRefresh = function() {
        pageCount = 0;
        $scope.hasMore = true;
        News.getPage(pageCount++, function(newsList) {
            $scope.slides = newsList.filter(isSlide);
            $scope.newsList = newsList.filter(notSlide);
            $ionicSlideBoxDelegate.update();
            $ionicScrollDelegate.resize();
            $scope.$broadcast('scroll.refreshComplete');
        }, function(err) {
            $scope.hasMore = false;
        });
    };

    $scope.loadMore = function() {
        News.getPage(pageCount, function(newsList) {
            if (pageCount === 0) {
                $scope.slides = newsList.filter(isSlide);
                $scope.newsList = $scope.newsList.concat(newsList.filter(notSlide));
            } else {
                $scope.newsList = $scope.newsList.concat(newsList);
            }
            $ionicScrollDelegate.resize();
            $ionicSlideBoxDelegate.update();
            $scope.$broadcast('scroll.infiniteScrollComplete');
            pageCount++;
        }, function(err) {
            $scope.hasMore = false;
        });
    };

    loadCategories();
    $ionicSlideBoxDelegate.enableSlide(true);
})

.controller('NewsDetailCtrl', function($scope, $stateParams, $ionicHistory, $ionicActionSheet, News) {
    News.get($stateParams.newsId, function(newsDetail) {
        $scope.newsDetail = newsDetail;
    });

    $scope.goBack = function() {
        $ionicHistory.goBack();
    };

    $scope.addToFavorite = function() {

    };

    $scope.showShareActionSheet = function() {
        var sheet = $ionicActionSheet.show({
            buttons: [{
                text: 'share1'
            }, {
                text: 'share2'
            }],
            cancel: function() {
                sheet.hide();
            }
        });
    };
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
});
