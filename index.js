/**
* 基于rap的数据mock服务。使用示例：
    this.send({
        url: 'http://localhost:8080/dashboard/ajax/product/exhibit/exhibitions.do',
        data: {
            test: 1
        }
    }).then(function(returnData) {
        console.log('rap returnData:', returnData);
    }, function(a, b, c) {
        console.log('a:', a);
    });
*/

var koa = require('koa');
var path = require('path');
var logSymbols = require('log-symbols');
var colors = require('colors');

var proxy = require('./proxy');
var rap = require('./rap');

// 加载各种中间件
var koaBody = require('koa-bodyparser');
var logger = require('koa-logger');
var errorhandler = require('koa-errorhandler');
var cors = require('koa-cors');

// 配置变量
var requestUrl = 'http://localhost:8080';
var proxyUrl = 'localhost:8081';

// 命令行中比如执行`：npm run mock 1072`时最后的参数是项目的projectId
// 如果没有传入做报错处理，退出执行
var projectId = process.argv[2];

if(!projectId) {
    console.log(logSymbols.error + ' 请传入项目的projectId!'.red);

    process.exit(1);
}

// 前端页面里请求的接口地址
var app = koa();

app.use(errorhandler());
app.use(cors());
app.use(koaBody());

// 日志打印中间件
app.use(logger());


app.use(function*(next) {
    // 请求的相对路径
    var requestPath = this.path || '';
    var requestMethod = (this.method || 'POST').toLowerCase();
    var proxyPath = 'http://' + path.join(proxyUrl, requestPath);

    if (requestMethod === 'get') {
        this.body = yield proxy(proxyPath);
    } else {
        var requestData = this.request.body;

        this.body = yield proxy(proxyPath, {
            method: requestMethod.toUpperCase(),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.request.body)
        });
    }

    yield next;
});

app.listen(8080);
console.log(logSymbols.info + ' 服务器正在监听：http://localhost:8080，前端可往此地址发送Ajax请求。');

var proxyServer = koa();

// 使用中间件
proxyServer.use(errorhandler());
app.use(cors());
proxyServer.use(koaBody());
proxyServer.use(logger());

proxyServer.use(function*(next) {
    var requestPath = this.path || '';
    var requestMethod = (this.method || 'POST').toLowerCase();

    // console.log('request params:', this.request.body);
    // console.log('requestPath:', requestPath);

    var validCheckResult = yield rap.checkParamsValid(projectId, requestPath, this.request.body);
    // console.log('validCheckResult:', validCheckResult);
    if (typeof validCheckResult === 'string') {
        validCheckResult = JSON.parse(validCheckResult);
    }

    console.log();
    console.log(logSymbols.warning + ' 请求参数校验结果如下：'.gray + '(“缺失”代表返回数据缺失，“未在文档中定义”表示传的参数没有写在rap里)'.blue);
    console.log(('\n  -- ' + validCheckResult.resultStr.replace(/\n|\r|\r\n/g, '\n  --')).red);
    console.log();

    var returnData = yield rap.getMockData(projectId, requestPath);

    this.body = returnData;

    yield next;
});

console.log(logSymbols.info + ' 代理服务器正在监听：http://localhost:8081。');
proxyServer.listen(8081);
