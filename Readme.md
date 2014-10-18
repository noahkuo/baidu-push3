[![NPM version][npm-img]][npm-url]
[![License][license-img]][license-url]
[![Dependency status][david-img]][david-url]

### baidu-push

node.js sdk for baidu push service, friendly with **co**, **koa** ...

```bash
npm install baidu-push
```

### 百度云推送
* [官方文档](http://developer.baidu.com/wiki/index.php?title=docs/cplat/push/api/list)
* api参数与官网文档一致, 必需的 `method`, `apikey`, `timestamp`, `sign` 等参数已内部处理, 无需在每次调用时输入

### api列表
* queryBindList
* pushMsg
* verifyBind
* fetchMsg
* fetchMsgCount
* deleteMsg
* setTag
* fetchTag
* deleteTag
* queryUserTags
* queryDeviceType

### 使用
* [参考代码](test/index.js)

```js
var Push   = require('baidu-push');
var userId = 'a userId';

var pushOption = {
  apiKey: 'api key',
  secretKey: 'secret key',
  // timeout: 2000, // optional - default is: 5000
  // agent: false   // optional - default is: maxSockets = 20
};

var client = Push.createClient(pushOption);
```

根据 userId 向某一 user 推送消息
```js
var option = {
  push_type: 1,
  user_id: userId,
  messages: ["hello"],
  msg_keys: ["title"]
};

client.pushMsg(option, function(error, result) {});
```

根据 tag 向一群 users 推送消息
```js
var option = {
  push_type: 2,
  tag: testTag.name,
  messages: ["push by tag"],
  msg_keys: ["title"]
}
client.pushMsg(option, function(error, result) {})
```

添加user的tag
```js
var option = {
  tag: testTag.name,
  user_id: userId
}
client.setTag(option, function(error, result) {})
```

获取user的tag
```js
var option = {
  user_id: userId
}
client.queryUserTags(option, function (error, result) {})
```

删除user的tag
```js
var option = {
  tag: testTag.name,
  user_id: userId
}
client.deleteTag(option, function(error, result) {})
```

获取app的tag
```js
client.fetchTag({}, function (error, result) {})
```

query bind list
```js
var option = {
  user_id: userId
}
client.queryBindList(option, function(error, result) {})
```

### use with `co` or `koa`

```js
var pushOption = {
  wrapper: 'thunk', // or: promise
  apiKey: 'your api key',
  secretKey: 'your secret key'
}

var client = Push.createClient(pushOption)

// in co or koa
yield client.fetchTag()
```

### Coverage
98%

### License
MIT

[npm-img]: https://img.shields.io/npm/v/baidu-push.svg?style=flat-square
[npm-url]: https://npmjs.org/package/baidu-push
[license-img]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
[david-img]: https://img.shields.io/david/coderhaoxin/baidu-push.svg?style=flat-square
[david-url]: https://david-dm.org/coderhaoxin/baidu-push
