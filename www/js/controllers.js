angular.module('app.controllers', [])

.controller('HomeCtrl', function($scope, $timeout, $ionicScrollDelegate, $ionicSlideBoxDelegate,
    Model, Util) {

    //active slideIndex
    $scope.slideIndex = 0;

    //constructor CategoryVM
    function CategoryVM() {
        this.hasMore = false;
        this.items = [];
        this.pageCount = 0;
    }

    //called when Articles have been loaded
    function onArticlesLoad() {
        $ionicScrollDelegate.resize();
        $ionicSlideBoxDelegate.update();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
    }
    //initialize every Category View Models
    function initCategoryVMs() {
        Util.getCategories(function(categories) {
            for (var i in categories) {
                var vm = new CategoryVM(categories[i].id);
                categories[i].vm = vm;
            }
            $scope.categories = categories;
        }, function(err) {
            $scope.error = err;
        });
    }

    //load Articles for the category specified by categoryIndex
    $scope.loadArticles = function(categoryIndex) {
        var categoryId = $scope.categories[categoryIndex].id;
        var pageCount = $scope.categories[categoryIndex].vm.pageCount;
        var param = { c: categoryId, p: pageCount };
        Model.list("article", param, function(items) {
            for (var i in items) {
                $scope.categories[categoryIndex].vm.items.push(items[i]);
            }
            $scope.categories[categoryIndex].vm.pageCount++;
            onArticlesLoad();
        }, function(err) {
            $scope.categories[categoryIndex].vm.hasMore = false;
        });
    };

    //refresh article list for current category
    $scope.doRefresh = function(categoryIndex) {
        $scope.categories[categoryIndex].vm.hasMore = true;
        $scope.categories[categoryIndex].vm.pageCount = 0;
        $scope.categories[categoryIndex].vm.items = [];
        $scope.loadArticles(categoryIndex);
    };

    $scope.$on('$stateChangeSuccess', function() {});

    $scope.$on('$ionicView.enter', function(e) {
        $timeout(function() {
            $scope.outerSlideChanged($scope.slideIndex);
        }, 500);
    });

    //active the outer slide by index when click top tab
    $scope.activeSlide = function(index) {
        $ionicSlideBoxDelegate.$getByHandle('outer-slider').slide(index);
    };

    //fired when outer slide Changed to index
    $scope.outerSlideChanged = function(index) {
        $ionicScrollDelegate.$getByHandle('tabs-scroll').scrollTo(index * 40);
        //$scope.slideIndex = index;    
        if ($scope.categories[index].vm.items.length < 1) {
            $scope.categories[index].vm.hasMore = true;
            $scope.loadArticles(index);
        }
    };

    //enable or disable the outer slide box when touch or release the inner slide box
    $scope.enableOuterSlider = function(enable) {
        $ionicSlideBoxDelegate.$getByHandle('outer-slider').enableSlide(enable);
    };

    initCategoryVMs();
    $ionicSlideBoxDelegate.enableSlide(true);
})

.controller('DetailCtrl', function($scope, $stateParams, $ionicHistory,
    $ionicActionSheet, $ionicPopup, $ionicPopover, $timeout, $sce,
    Storage, Model, Util) {

    $scope.template = 'default';
    $scope.slideIndex = 0;
    $scope.showSubTitle = true;
    $scope.showFooterBar = true;
    $scope.fullSubTitle = false;
    $scope.myComment = "";

    function createPopover() {
        var popover = $ionicPopover.fromTemplateUrl('templates/popover-comment.html', {
            scope: $scope
        });
        popover.then(function(po) {
            $scope.popover = po;
            //$scope.initialize({focusFirstInput: true});
        });
    }

    $scope.$on('$ionicView.enter', function() {
        Model.detail('article', { id: $stateParams.id }, function(detail) {
            //detail.content = $sce.trustAsHtml(detail.content);
            $scope.detail = detail;
            Util.getDetailTemplate(detail.categoryId, function(template) {
                $scope.template = template;
            });
        }, function(err) {
            $scope.error = err;
        });
        createPopover();
    });

    $scope.onSlideClick = function() {
        $scope.showFooterBar = !$scope.showFooterBar;
        $scope.showSubTitle = !$scope.showSubTitle;
    };

    $scope.slideChanged = function(index) {
        $scope.slideIndex = index;
    };

    $scope.swipeUp = function() {
        $scope.fullSubTitle = true;
    };

    $scope.swipeDown = function() {
        $scope.fullSubTitle = false;
    };

    $scope.goBack = function() {
        $ionicHistory.goBack();
    };

    $scope.closePopover = function() {
        $scope.popover.hide();
    };

    $scope.commit = function(myComment) {
        Storage.putItem('myComments', {
            id: $scope.detail.id,
            title: $scope.detail.title,
            text: myComment
        });

        $scope.detail.comments.unshift({
            user:'我[匿名]', 
            portrait_url: 'img/user.png',
            comment: myComment,
            commentTime: (new Date()).getTime()
        });

        $scope.closePopover();

    };

    $scope.comment = function(id, event) {
        $scope.popover.show(event);
    };

    $scope.collect = function(id, title) {
        Storage.putItem('favorites', {
            id: id,
            title: title
        });
    };

    $scope.isCollected = function(id) {
        var favorites = Storage.getItems('favorites');
        for (var i in favorites) {
            if (favorites[i].id === id) {
                return true;
            }
        }
        return false;
    };

    $scope.share = function(id, title) {
        var sheet = $ionicActionSheet.show({
            titleText: '分享',
            cancelText: '取消',
            buttons: [{
                text: '分享到微信朋友圈'
            }, {
                text: '发送给微信好友'
            }],
            buttonClicked: function(index) {
                var popup = $ionicPopup.show({
                    title: '分享',
                    template: '测试版尚未提供分享功能'
                });
                $timeout(function() {
                    popup.close();
                }, 4000);
            }
        });
    };
})

.controller('ServicesCtrl', function($scope, _, Util) {

    Util.getServices(function(items) {

        $scope.groups = _.groupBy(items, function(item){
            return item.serviceType.name;
        });
        console.log($scope.groups);
    });
})

.controller('ServiceCtrl', function($scope, $sce, $stateParams, Util) {
    Util.getServices(function(services) {
        for (var i = 0; i < services.length; i++) {
            if (services[i].id == $stateParams.id) {
                $scope.service = services[i];
                //console.log($scope.service.label);
                $scope.serviceUrl = $sce.trustAsResourceUrl($scope.service.serviceUrl);
                break;
            }
        }
    });    
})

.controller('LoginCtrl', function($scope, $stateParams) {
    //$scope.userId = $stateParams.userId;
})

.controller('AccountCtrl', function($scope) {
    //$scope.userId = 0;
    $scope.settings = {
        enableFriends: true
    };
});
