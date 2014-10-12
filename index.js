'use strict';

var assert = require('assert'),
  crypto = require('crypto'),
  http = require('http');

var PROTOCOL_SCHEMA = 'http://',
  COMMON_PATH = '/rest/2.0/channel/';

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

function sortObject(origin) {
  var index = Object.keys(origin).sort();
  var temp = {};

  for (var i = 0; i < index.length; i++) {
    temp[index[i]] = origin[index[i]];
  }

  return temp;
}

function generateSign(method, url, params, secretKey) {
  var baseString = method + url;

  for (var i in params) {
    baseString += (i + '=' + params[i]);
  }

  baseString += secretKey;
  var encodeString = urlencode(baseString);
  var md5sum = crypto.createHash('md5');
  md5sum.update(encodeString);

  var sign = md5sum.digest('hex');

  return sign;
}

function request(bodyArgs, path, secretKey, host, callback) {
  bodyArgs.sign = generateSign('POST', PROTOCOL_SCHEMA + host + path, bodyArgs, secretKey);

  var bodyArgsArray = [];

  for (var i in bodyArgs) {
    if (bodyArgs.hasOwnProperty(i)) {
      bodyArgsArray.push(i + '=' + urlencode(bodyArgs[i]));
    }
  }

  var bodyString = bodyArgsArray.join('&');
  var options = {
    host: host,
    method: 'POST',
    path: path,
    headers: {
      'Content-Length': bodyString.length,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  var req = http.request(options, function(res) {
    var resBody = '';

    res.on('data', function(chunk) {
      resBody += chunk;
    });

    res.on('end', function() {
      var data;

      try {
        data = JSON.parse(resBody);
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

  req.on('error', function(e) {
    callback(e, null);
  });

  req.end(bodyString);
}

/**
 * Push
 */
function Push(options) {
  this.apiKey = options.apiKey;
  this.secretKey = options.secretKey;
  this.host = options.host || 'channel.api.duapp.com';
}

Push.prototype.queryBindList = function(options, callback) {
  options = options || {};
  callback = callback || noop;

  var path = COMMON_PATH + (options.channel_id || 'channel');
  var self = this;

  options.method = 'query_bindlist';
  options.apikey = self.apiKey;
  options.timestamp = getTimestamp();
  options = sortObject(options);

  request(options, path, self.secretKey, self.host, function(error, result) {
    callback(error, result);
  });
};

Push.prototype.pushMsg = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = COMMON_PATH + 'channel';
  var self = this;

  options.method = 'push_msg';
  options.apikey = self.apiKey;
  options.messages = JSON.stringify(options.messages);
  options.msg_keys = JSON.stringify(options.msg_keys);
  options.timestamp = getTimestamp();
  options = sortObject(options);

  request(options, path, self.secretKey, self.host, function(error, result) {
    callback(error, result);
  });
};

Push.prototype.verifyBind = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = COMMON_PATH + (options.channel_id || 'channel');
  var self = this;

  options.method = 'verify_bind';
  options.apikey = self.apiKey;
  options.timestamp = getTimestamp();
  options = sortObject(options);

  request(options, path, self.secretKey, self.host, function(error, result) {
    callback(error, result);
  });
};

Push.prototype.fetchMsg = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = COMMON_PATH + (options.channel_id || 'channel');
  var self = this;

  options.method = 'fetch_msg';
  options.apikey = self.apiKey;
  options.timestamp = getTimestamp();
  options = sortObject(options);

  request(options, path, self.secretKey, self.host, function(error, result) {
    callback(error, result);
  });
};

Push.prototype.fetchMsgCount = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = COMMON_PATH + (options.channel_id || 'channel');
  var self = this;

  options.method = 'fetch_msgcount';
  options.apikey = self.apiKey;
  options.timestamp = getTimestamp();
  options = sortObject(options);

  request(options, path, self.secretKey, self.host, function(error, result) {
    callback(error, result);
  });
};

Push.prototype.deleteMsg = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = COMMON_PATH + (options.channel_id || 'channel');
  var self = this;

  options.method = 'delete_msg';
  options.apikey = self.apiKey;
  options.msg_ids = JSON.stringify(options.msg_ids);
  options.timestamp = getTimestamp();
  options = sortObject(options);

  request(options, path, self.secretKey, self.host, function(error, result) {
    callback(error, result);
  });
};

Push.prototype.setTag = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = COMMON_PATH + 'channel';
  var self = this;

  options.method = 'set_tag';
  options.apikey = self.apiKey;
  options.timestamp = getTimestamp();
  options = sortObject(options);

  request(options, path, self.secretKey, self.host, function(error, result) {
    callback(error, result);
  });
};

Push.prototype.fetchTag = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = COMMON_PATH + 'channel';
  var self = this;

  options.method = 'fetch_tag';
  options.apikey = self.apiKey;
  options.timestamp = getTimestamp();
  options = sortObject(options);

  request(options, path, self.secretKey, self.host, function(error, result) {
    callback(error, result);
  });
};

Push.prototype.deleteTag = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = COMMON_PATH + 'channel';
  var self = this;

  options.method = 'delete_tag';
  options.apikey = self.apiKey;
  options.timestamp = getTimestamp();
  options = sortObject(options);

  request(options, path, self.secretKey, self.host, function(error, result) {
    callback(error, result);
  });
};

Push.prototype.queryUserTags = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = COMMON_PATH + 'channel';
  var self = this;

  options.method = 'query_user_tags';
  options.apikey = self.apiKey;
  options.timestamp = getTimestamp();
  options = sortObject(options);

  request(options, path, self.secretKey, self.host, function(error, result) {
    callback(error, result);
  });
};

Push.prototype.queryDeviceType = function(options, callback) {
  options = options || {};
  callback = callback || noop;
  var path = COMMON_PATH + (options.channel_id || 'channel');
  var self = this;

  options.method = 'query_device_type';
  options.apikey = self.apiKey;
  options.timestamp = getTimestamp();
  options = sortObject(options);

  request(options, path, self.secretKey, self.host, function(error, result) {
    callback(error, result);
  });
};

/**
 * exports
 */
exports.createClient = function(options) {
  assert(typeof options === 'object', 'invalid options');

  var client = new Push(options);

  var wrapper = options.wrapper;
  if (wrapper) {
    require('thunkify-or-promisify')(client, wrapper);
  }

  return client;
};
