var co = require('co');
var path = require('path');

var request = require("co-request");

var mockDataUrl = 'rap.alibaba-inc.com/mockjsdata/';
var checkUrl = 'rap.alibaba-inc.com/validate/';
var protocol = 'http://';

module.exports = {
    getMockData: function(projectId, reqPath) {
        // 请求路径
        reqPath = reqPath;

        var mockDataReqUrl = protocol + path.join(mockDataUrl, String(projectId), reqPath);

        // console.log('mockDataReqUrl:', mockDataReqUrl);

        return co(function*() {
            var result = yield request(mockDataReqUrl);

            return result.body;
        });
    },

    // 校验真实数据的正确性
    // http://{domaiName}/validate/{projectId}/{relativePath}?json={jsonToCompare}
    checkParamsValid: function(projectId, reqPath, params) {
        if (typeof params !== 'string') {
            params = JSON.stringify(params);
        }

        var validCheckUrl = protocol + path.join(checkUrl, String(projectId), reqPath) + '?json=' + params;

        return co(function*() {
            var result = yield request(validCheckUrl);

            return result.body;
        });
    }
};
