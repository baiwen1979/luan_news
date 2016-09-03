angular.module('app.services', ['ngResource'])

.factory('Storage', function() {

    var storeCache = {};

    return {
        getItems: function(storeName) {
            if (storeCache[storeName]) {
                return storeCache[storeName];
            }
            storeCache[storeName] = localStorage.getItem(storeName);
            if (storeCache[storeName]) {
                storeCache[storeName] = angular.fromJson(storeCache[storeName]);
            }
            else {
                storeCache[storeName] = [];
            }
            return storeCache[storeName];
        },

        putItem: function(storeName, item) {
            var items = this.getItems(storeName);
            items.push(item);
            localStorage.setItem(storeName, angular.toJson(items));
        }
        
    };
})

.factory('Model', ['$resource', function($resource) {

    
    var resoureUrls = {
        apiBaseUrl: 'data',
        category: {
            listAction: 'categories'
        },
        article: {
            listAction: 'article_list',
            detailAction: 'article_detail'
        },
        service: {
            listAction: 'services'
        }
    };

    
    var paramConfig = {
        reqChar: '',
        operator: '',
        separator: '',
        suffix: '.json'
    };
    
   
    /*
    var resoureUrls = {
        apiBaseUrl: 'http://60.220.238.2:8080/media/api',
        category: {
            listAction: 'categories.do'
        },
        article: {
            listAction: 'newsJsonList.do',
            detailAction: 'newsJsonDetailView.do'
        },
        service: {
            listAction: 'services.do'
        }
    };

    var paramConfig = {
        reqChar: '?',
        operator: '=',
        separator: '&',
        suffix: ''
    };

    */
    function loadResource(url, onOK, onErr) {
        if (typeof(onErr) != 'function') {
            onErr = function(err) {};
        }
        $resource(url).get(function(res) {
            if (res.result == 'OK') {
                onOK(res.data);
            } else {
                onErr(res.data);
            }
        }, function(err){
            onErr(err.data);
        });
    }

    function paramsToQueryStr(params) {
        var qs = paramConfig.reqChar;
        for (var p in params) {
            qs += p + paramConfig.operator + params[p] + paramConfig.separator;
        }
        return qs;
    }

    return {
        list: function(clazz, params, onOK, onErr) {
            var qs = paramsToQueryStr(params);
            var listUrl = resoureUrls.apiBaseUrl + '/' + resoureUrls[clazz].listAction;
            loadResource(listUrl + qs + paramConfig.suffix, onOK, onErr);
        },

        detail: function(clazz, params, onOK, onErr) {
            var qs = paramsToQueryStr(params);
            var detailUrl = resoureUrls.apiBaseUrl + '/' + resoureUrls[clazz].detailAction;
            loadResource(detailUrl + qs + paramConfig.suffix, onOK, onErr);
        }
    };
}])

.factory('Util', function(Model) {

    var categories;
    var templates;

    return {
        getCategories: function(onLoad, onErr) {
            if (categories) {
                onLoad(categories);
            } else {
                Model.list('category', {}, function(list) {
                    categories = list;
                    onLoad(categories);
                }, onErr);
            }
        },
        getDetailTemplate: function(categoryId, callback) {
            if (templates) {
                callback(templates[categoryId]);
            } 
            else {
                this.getCategories(function(list) {
                    templates = {};
                    for (var i in list) {
                        templates[list[i].id] = list[i].detailTemplate;
                    }
                    callback(templates[categoryId]);
                }, function() {
                    callback('default');
                });
            }
        }
    };
});
