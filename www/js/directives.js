angular.module('app.directives', [])
.directive('hideTabs', function($rootScope){
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            console.log('hide-tabs');
            scope.$on('$ionicView.beforeEnter', function() {               
                scope.$watch(attributes.hideTabs, function(value){
                    $rootScope.hideTabs = value;
                });
            });

            scope.$on('$ionicView.beforeLeave', function(){
                $rootScope.hideTabs = false;
            });
        }
    };
});