angular.module('app.controllers', [])

.controller('HomeCtrl', function($scope, $timeout, $ionicScrollDelegate, $ionicSlideBoxDelegate,
    Model) {
    
    $scope.slideIndex = 0;

    function loadCategories() {
        Model.list('category',{}, function(categories) {
            $scope.categories = categories;
        });
    }

    $scope.$on('$ionicView.enter', function(e) {
        $timeout(function() {
            $ionicSlideBoxDelegate.$getByHandle('outer-slider').slide(0);
        }, 500);
    });

    $scope.activeSlide = function(index) {
        $ionicSlideBoxDelegate.$getByHandle('outer-slider').slide(index);
    };

    $scope.outerSlideChanged = function(index) {
        $ionicScrollDelegate.$getByHandle('tabs-scroll').scrollTo(index * 40);
    };

    loadCategories();
    $ionicSlideBoxDelegate.enableSlide(true);
})

.controller('NewsCtrl', function($scope, $ionicLoading, $ionicScrollDelegate, $ionicSlideBoxDelegate, Model){

    var pageCount = 0;
    $scope.hasMore = true;

    function beSlide(artile) {
        return artile.large_image;
    }

    function notSlide(artile) {
        return !artile.large_image;
    }

    $scope.$on('$stateChangeSuccess', function() {
        //$scope.loadMore();
    });

    $scope.enableOuterSlider = function(enable) {
        $ionicSlideBoxDelegate.$getByHandle('outer-slider').enableSlide(enable);
    };

    $scope.doRefresh = function() {
        $scope.pageCount = 0;
        $scope.hasMore = true;
        var param = {c: 1, p: 0};
        Model.list("article", param, function(newsList) {
            $scope.slides = newsList.filter(beSlide);
            $scope.list = newsList.filter(notSlide);
            $ionicScrollDelegate.resize();
            $ionicSlideBoxDelegate.update();
            $scope.$broadcast('scroll.refreshComplete');
        }, function(err) {
            $scope.hasMore = false;
        });
    };

    $scope.loadMore = function() {
        var param = {c: 1, p: pageCount };
        Model.list("article", param, function(newsList) {
            if (pageCount === 0) {
                $scope.slides = newsList.filter(beSlide);
                $scope.list = newsList.filter(notSlide);
            }
            else {
                $scope.list = $scope.list.concat(newsList);
            }
            $ionicScrollDelegate.resize();
            $ionicSlideBoxDelegate.update();
            $scope.$broadcast('scroll.infiniteScrollComplete');
            pageCount++;
        }, function(err) {
            $scope.hasMore = false;
        });
    };
    $ionicSlideBoxDelegate.enableSlide(true);
})

.controller('PaperCtrl', function($scope, $ionicScrollDelegate, $ionicSlideBoxDelegate, Model) {
    var pageCount = 0;
    $scope.hasMore = true;
    $scope.pages = [];
    var pages = [];

    $scope.loadMore = function() {
        var param = {c: 2, p: pageCount };
        Model.list("article", param, function(page) {
            pages.push(page);
            $scope.pages = pages;
            $ionicScrollDelegate.resize();
            $scope.$broadcast('scroll.infiniteScrollComplete');
            pageCount++;
        }, function(err) {
            $scope.hasMore = false;
        });
    };
    //$scope.loadMore();
})

.controller('DetailCtrl', function($scope, $stateParams, $ionicHistory, $ionicActionSheet, Model) {
    Model.detail('article', $stateParams.id, function(detail) {
        $scope.detail = detail;
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
            }]
        });
    };
})

.controller('ServiceCtrl', function($scope) {})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
});
