# rap-mock
基于前后端数据接口定制平台rap开放API的本地参数校验及数据mock服务

## 最初的思路
起初的思路是：当前端发起Ajax请求的时候，进行HTTP拦截，然后指定项目的projectId，使用爬虫程序直接去爬取rap对应url页面的数据，对请求参数进行校验后，使用[Mockjs](http://mockjs.com/)自己进行数据mock后返回给前端的请求。
但是在使用request模块对相应的url进行请求后发现，页面的数据都是在页面load之后使用js进行Ajax请求动态渲染到页面的，也就说爬虫根本没法爬取到页面的数据。
于是，以上的思路放弃掉。
后来，我去查了下rap的API开放文档，发现rap自己提供了对参数的校验以及对数据进行mock并对外提供mock数据的接口，于是，理所当然的我们就可以直接去调他们这些接口即可，无需再自己去折腾。

## 相关参考文档
[rap用户手册](https://github.com/thx/RAP/wiki/user_manual_cn#%E5%89%8D%E7%AB%AFmock%E6%95%B0%E6%8D%AE%E7%94%9F%E6%88%90)
[rap官网地址](http://thx.github.io/RAP/index_zh.html)
[koa教程](http://javascript.ruanyifeng.com/nodejs/koa.html)
[koa跨域支持模块：koa-cors](https://wohugb.gitbooks.io/koajs/content/misc/koa-cors.html)
[request同步写法：co-request](https://www.npmjs.com/package/co-request)
[koa 利用 node-fetch 写个自己的代理](https://segmentfault.com/a/1190000003994518)
