angular.module('app.services', ['ngResource'])

.factory('News', ['$resource', function($resource) {

    var resConfig = {
        categoryUrl: 'json/news/categories',
        listUrl: 'json/news/news_list',
        detailUrl: 'json/news/news_detail'
    };

    var loadResource = function(url, onOK, onErr) {
        if (typeof(onErr) != 'function') {
            onErr = function(err){
                console.log(err);
            };
        }
        $resource(url).get(function(res) {
            if (res.result == 'OK') {
                onOK(res.data);
            }
            else {
                onErr(res.data);
            }
        }, onErr);
    };
    
    return {
        getPage: function(pageIndex, onOK, onErr) {           
            loadResource(resConfig.listUrl + pageIndex + '.json', onOK, onErr);
        },

        get: function(newsId, onOK, onErr) {
            loadResource(resConfig.detailUrl + newsId + '.json', onOK, onErr);
        },

        getCategories: function(onOK, onErr) {
            loadResource(resConfig.categoryUrl + '.json', onOK, onErr);
        }
  };
}]);