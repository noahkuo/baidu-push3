'use strict';

var assert = require('assert'),
  crypto = require('crypto'),
  http = require('http'),
  os = require('os'),
  url = require('url');

/**
 * Push
 */
function Push(options) {
  this.apiKey = options.apiKey;
  this.secretKey = options.secretKey;
  this.host = options.host || 'api.tuisong.baidu.com';
  this.path = options.path || '/rest/3.0/';
  this.timeout = options.timeout || 5000; // 5s

  if (options.hasOwnProperty('agent')) {
    this.agent = options.agent;
  } else {
    var agent = "BCCS_SDK/3.0 ("+os.platform()+","+os.release()+") nodeJS/"+Number(process.version.match(/^v(\d+\.\d+)/)[1]);
	console.log(agent);
    //agent.maxSockets = 20;
    this.agent = agent;
  }
}

Push.prototype.request = function(path, bodyParams, callback) {
  var secretKey = this.secretKey,
        timeout = this.timeout,
           host = this.host;

  bodyParams.apikey = this.apiKey;
  bodyParams.sign = signKey(url.parse("http://"+host+path), bodyParams, secretKey);
  var bodyArgsArray = [];

  for (var i in bodyParams) {
    bodyArgsArray.push(i + '=' + urlencode(bodyParams[i]));
  }

  var bodyString = bodyArgsArray.join('&');
  var options = {
    host: host,
    path: path,
    method: 'POST',
    headers: {
      'Content-Length': bodyString.length,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  };

  var req = http.request(options, function(res) {
    var chunks = [],
      size = 0;

    res.on('data', function(chunk) {
      chunks.push(chunk);
      size += chunk.length;
    });

    res.on('end', function() {
      var data;

      try {
        data = JSON.parse(Buffer.concat(chunks, size));
      } catch (e) {
        e.status = res.statusCode;
        e.code = 'JSON Parse Error';

        return callback(e);
      }

      if (res.statusCode !== 200) {
        var err = new Error();

        err.code = data.error_code;
        err.status = res.statusCode;
        err.message = data.error_msg;
        err.request_id = data.request_id;

        return callback(err);
      }

      callback(null, data);
    });
  });

  req.on('socket', function(socket) {
    socket.setTimeout(timeout);
    socket.on('timeout', function() {
      req.abort();
    });
  });

  req.on('error', function(e) {
    callback(e);
  });

  req.end(bodyString);
};

Push.prototype.pushSingleDevice = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = this.path + 'push/single_device';

  options.msg = JSON.stringify(options.msg);
  options.timestamp = getTimestamp();

  this.request(path, options, callback);
};


Push.prototype.pushAll = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = this.path + 'push/all';

  options.msg = JSON.stringify(options.msg);
  options.timestamp = getTimestamp();

  this.request(path, options, callback);
};

Push.prototype.pushTags = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = this.path + 'push/tags';

  options.msg = JSON.stringify(options.msg);
  options.timestamp = getTimestamp();

  this.request(path, options, callback);
};

Push.prototype.pushBatchDevice = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = this.path + 'push/tags';

  options.msg = JSON.stringify(options.msg);
  options.timestamp = getTimestamp();

  this.request(path, options, callback);
};

Push.prototype.reportQueryMsgStatus = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = this.path + 'report/query_msg_status';

  options.msg = JSON.stringify(options.msg);
  options.timestamp = getTimestamp();

  this.request(path, options, callback);
};


Push.prototype.reportQueryTimerRecords = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = this.path + 'report/query_timer_records';

  options.msg = JSON.stringify(options.msg);
  options.timestamp = getTimestamp();

  this.request(path, options, callback);
};

Push.prototype.reportQueryTopicRecords = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = this.path + 'report/query_topic_records';

  options.msg = JSON.stringify(options.msg);
  options.timestamp = getTimestamp();

  this.request(path, options, callback);
};

Push.prototype.appQueryTags = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = this.path + 'app/query_tags';

  options.msg = JSON.stringify(options.msg);
  options.timestamp = getTimestamp();

  this.request(path, options, callback);
};

Push.prototype.appCreateTag = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = this.path + 'app/create_tag';

  options.msg = JSON.stringify(options.msg);
  options.timestamp = getTimestamp();

  this.request(path, options, callback);
};

Push.prototype.appDelTag = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = this.path + 'app/del_tag';

  options.msg = JSON.stringify(options.msg);
  options.timestamp = getTimestamp();

  this.request(path, options, callback);
};

Push.prototype.tagAddDevices = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = this.path + 'tag/add_devices';

  options.msg = JSON.stringify(options.msg);
  options.timestamp = getTimestamp();

  this.request(path, options, callback);
};

Push.prototype.tagDelDevices = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = this.path + 'tag/del_devices';

  options.msg = JSON.stringify(options.msg);
  options.timestamp = getTimestamp();

  this.request(path, options, callback);
};

Push.prototype.tagDeviceNum = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = this.path + 'tag/device_num';

  options.msg = JSON.stringify(options.msg);
  options.timestamp = getTimestamp();

  this.request(path, options, callback);
};

Push.prototype.timerQueryList = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = this.path + 'timer/query_list';

  options.msg = JSON.stringify(options.msg);
  options.timestamp = getTimestamp();

  this.request(path, options, callback);
};

Push.prototype.timerCancel = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = this.path + 'timer/cancel';

  options.msg = JSON.stringify(options.msg);
  options.timestamp = getTimestamp();

  this.request(path, options, callback);
};

Push.prototype.topicQueryList = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = this.path + 'topic/query_list';

  options.msg = JSON.stringify(options.msg);
  options.timestamp = getTimestamp();

  this.request(path, options, callback);
};

Push.prototype.reportStatisticDevice = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = this.path + 'report/statistic_device';

  options.msg = JSON.stringify(options.msg);
  options.timestamp = getTimestamp();

  this.request(path, options, callback);
};

Push.prototype.reportStatisticTopic = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = this.path + 'report/statistic_topic';

  options.msg = JSON.stringify(options.msg);
  options.timestamp = getTimestamp();

  this.request(path, options, callback);
};

/**
 * exports
 */
exports.createClient = function(options) {
  assert(typeof options === 'object', 'invalid options');

  var client = new Push(options);

  var wrapper = options.wrapper;
  if (wrapper) {
    require('thunkify-or-promisify')(client, wrapper, ['request']);
  }

  return client;
};

/**
 * utils
 */
function noop() {}

function urlencode(string) {
  string += '';
  return encodeURIComponent(string)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/%20/g, '+');
}

function getTimestamp() {
  return Math.floor(new Date().getTime() / 1000);
}

function generateSign(method, url, params, secretKey) {
  var baseString = method + url;

  var keys = Object.keys(params).sort();
  for (var i = 0; i < keys.length; i++) {
    baseString += (keys[i] + '=' + params[keys[i]]);
  }

  baseString += secretKey;
  var encodeString = urlencode(baseString);
  var md5sum = crypto.createHash('md5');
  md5sum.update(encodeString);

  var sign = md5sum.digest('hex');

  return sign;
}

// 兼容php的urlencode
function fullEncodeURIComponent (str) {
    var rv = encodeURIComponent(str).replace(/[!'()*~]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
    return rv.replace(/\%20/g,'+');
}

/**
 * 生成请求签名
 * 
 * @param {object} reqParams, 由url.parse解析出来的对象内容,描述请求的位置和url及参数等信息的对象
 * @param {object} postParams post表单内容
 * @param {string} secretKey 开发者中心的SK
 * @return {string} 签名值
 */
var signKey = function (reqParam, postParmas, secretKey) {

    var basekey = "";

    var method = "POST"; //reqParam.method.toUpperCase();
    var baseurl = reqParam.href;
    var query = reqParam.query || false;
    var param = {};
    var paramStr = '';

    if (query) {
        query = querystring.parse(query);
        for ( var key in query) {
            param[key] = query[key];
        }
    }

    if (postParmas) {
        for ( var key in postParmas) {
            param[key] = postParmas[key];
        }
    }

    var keys = Object.keys(param).sort();

    keys.forEach(function (key) {
        paramStr += key + "=" + param[key];
    })

    basekey = method + baseurl + paramStr + secretKey;

    //console.log("basekey : ", basekey);

    var md5 = crypto.createHash('md5');

    basekey = fullEncodeURIComponent(basekey);
    md5.update(basekey);

    return md5.digest('hex');
}
