angular.module('app.controllers', [])

.controller('ServiceCtrl', function($scope) {})

.controller('NewsCtrl', function($scope, $ionicLoading, $ionicSlideBoxDelegate, News) {

    var pageCount = 0;
    var newsList = [];

    $scope.hasMore = true;
    $scope.slides = [];
    $scope.newsList = [];
    $scope.categories = [];

    $scope.$on('$ionicView.enter', function(e) {
        //$scope.doRefresh();
    });

    function isSlide(news) {
        return news.large_image;
    }

    function notSlide(news) {
        return !news.large_image;
    }

    function loadCategories() {
        News.getCategories(function(categories){
            $scope.categories = categories;
        });
    }

    $scope.doRefresh = function() {
        pageCount = 0;
        $scope.hasMore = true;
        News.getPage(pageCount++, function(newsList) {            
            $scope.slides = newsList.filter(isSlide);
            $scope.newsList = newsList.filter(notSlide);
            $ionicSlideBoxDelegate.update();
            $scope.$broadcast('scroll.refreshComplete');
        }, function(err) {
            $scope.hasMore = false;
        });     
    };

    $scope.loadMore = function() {
        News.getPage(pageCount, function(newsList) {
            if (pageCount == 0) {
                $scope.slides = newsList.filter(isSlide);
                $scope.newsList = $scope.newsList.concat(newsList.filter(notSlide));
            }
            else {
                $scope.newsList = $scope.newsList.concat(newsList);
            }
            $ionicSlideBoxDelegate.update();
            $scope.$broadcast('scroll.infiniteScrollComplete');
            pageCount ++;
        }, function(err) {
            $scope.hasMore = false;
        });
    };

    loadCategories();
    $ionicSlideBoxDelegate.enableSlide(true);
})

.controller('NewsDetailCtrl', function($scope, $stateParams, $ionicHistory, $ionicActionSheet, News) {
    News.get($stateParams.newsId, function(newsDetail){
        $scope.newsDetail = newsDetail;
    });

    $scope.goBack = function() {
        $ionicHistory.goBack();
    };

    $scope.addToFavorite = function() {

    };

    $scope.showShareActionSheet = function() {
        var sheet = $ionicActionSheet.show({
            buttons:[{
                text: 'share1'
            },{
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