angular.module('app.services', ['ngResource'])

.factory('Model', ['$resource', function($resource) {

    var resoureUrls = {
        category: {
            listUrl: 'data/categories'
        },
        article: {
            listUrl: 'data/article_list',
            detailUrl: 'data/article_detail'
        }
    };

    function loadResource(url, onOK, onErr) {
        if (typeof(onErr) != 'function') {
            onErr = function(err) {
                console.log(err);
            };
        }
        $resource(url).get(function(res) {
            if (res.result == 'OK') {
                onOK(res.data);
            } else {
                onErr(res.data);
            }
        }, onErr);
    }

    function paramsToQueryStr(params) {
        var qs = "";
        for(var p in params) {
            qs += p + params[p];
        }
        return qs;
    }

    return {
        list: function(clazz, params, onOK, onErr) {
            var qs = paramsToQueryStr(params);
            loadResource(resoureUrls[clazz].listUrl + qs + '.json', onOK, onErr);
        },

        detail: function(clazz, id, onOK, onErr) {
            loadResource(resoureUrls[clazz].detailUrl + id + '.json', onOK, onErr);
        }
    };
}]);
