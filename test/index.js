'use strict';

var should = require('should'),
  config = require('./config'),
  userId = config.userId;

var Push = require('..'),
  client = Push.createClient(config);

var channelId, testTag = {
  name: 'test-tag'
};

describe('# base api', function() {
  it('should query bind list', function(done) {
    var option = {
      user_id: userId
    };

    client.queryBindList(option, function(err, res) {
      assertError(err);

      channelId = res.response_params.binds[0].channel_id;

      res.request_id.should.above(0);
      res.response_params.should.have.keys('total_num', 'amount', 'binds');
      res.response_params.amount.should.equal(1);
      done();
    });
  });

  it('should push message', function(done) {
    var option = {
      push_type: 1,
      user_id: userId,
      messages: ['hello'],
      msg_keys: ['title']
    };

    client.pushMsg(option, function(err, res) {
      assertError(err);

      res.response_params.success_amount.should.equal(1);
      res.response_params.msgids.length.should.equal(1);
      done();
    });
  });
});

describe('# advanced api', function() {
  it('should verify bind', function(done) {
    client.verifyBind({
      user_id: userId
    }, function(err, res) {
      assertError(err);

      res.request_id.should.above(0);
      done();
    });
  });

  it('should fetch messages', function(done) {
    client.fetchMsg({
      user_id: userId
    }, function(err, res) {
      assertError(err);

      res.request_id.should.above(0);
      res.response_params.total_num.should.above(0);
      res.response_params.messages.length.should.above(0);
      done();
    });
  });

  it('should fetch message count', function(done) {
    client.fetchMsgCount({
      user_id: userId
    }, function(err, res) {
      assertError(err);

      res.request_id.should.above(0);
      res.response_params.total_num.should.above(0);
      done();
    });
  });

  it('should delete messages', function(done) {
    client.deleteMsg({
      user_id: userId,
      msg_id: ['5677767751112984971']
    }, function() {
      // 这里是百度云的问题, 返回的 msg_id 为 string, 却要求请求 msg_id 为 number (超出 js 最大值)
      done();
    });
  });
});

describe('# advanced api', function() {
  it('should fetch all tags', function(done) {
    client.fetchTag({}, function(err, res) {
      assertError(err);

      res.response_params.total_num.should.above(-1);
      res.response_params.should.have.keys('total_num', 'amount', 'tags');
      done();
    });
  });

  it('should set tag for user', function(done) {
    var option = {
      tag: testTag.name,
      user_id: userId
    };

    client.setTag(option, function(err, res) {
      assertError(err);

      res.request_id.should.above(0);
      done();
    });
  });

  it('should query user tag', function(done) {
    var option = {
      user_id: userId
    };

    client.queryUserTags(option, function(err, res) {
      assertError(err);

      res.response_params.tag_num.should.above(0);

      var tags = res.response_params.tags;
      var flag = 0;
      tags.forEach(function(tag) {
        if (tag.name === testTag.name) {
          flag++;
        }
      });
      flag.should.equal(1);
      done();
    });
  });

  it('should fetch all tags', function(done) {
    client.fetchTag({}, function(err, res) {
      assertError(err);

      res.response_params.should.have.keys('total_num', 'amount', 'tags');
      res.response_params.total_num.should.above(0);

      var tags = res.response_params.tags;
      tags.forEach(function(tag) {
        if (tag.name === testTag.name) {
          testTag.tid = tag.tid;
        }
      });
      testTag.should.have.property('tid');
      done();
    });
  });

  it('should push message by tag', function(done) {
    client.pushMsg({
      push_type: 2,
      tag: testTag.name,
      messages: ['push by tag'],
      msg_keys: ['title']
    }, function(err, res) {
      assertError(err);

      res.response_params.success_amount.should.equal(1);
      done();
    });
  });

  it('should delete user tag', function(done) {
    client.deleteTag({
      tag: testTag.name,
      user_id: userId
    }, function(err, res) {
      assertError(err);

      res.request_id.should.above(0);
      done();
    });
  });

  it('should query user tag', function(done) {
    client.queryUserTags({
      user_id: userId
    }, function(err, res) {
      assertError(err);

      res.response_params.tag_num.should.above(-1);
      var tags = res.response_params.tags;
      var flag = 0;
      tags.forEach(function(tag) {
        if (tag.name === testTag.name) {
          flag++;
        }
      });
      flag.should.equal(0);
      done();
    });
  });

  it('should delete app tag', function(done) {
    client.deleteTag({
      tag: testTag.name
    }, function(err, res) {
      assertError(err);

      res.request_id.should.above(0);
      done();
    });
  });

  it('should fetch app tag', function(done) {
    client.fetchTag({}, function(err, res) {
      assertError(err);

      res.response_params.should.have.keys('total_num', 'amount', 'tags');
      res.response_params.total_num.should.above(-1);

      var tags = res.response_params.tags;
      var flag = 0;
      tags.forEach(function(tag) {
        if (tag.name === testTag.name) {
          flag++;
        }
      });
      flag.should.equal(0);
      done();
    });
  });

  it('should query device type', function(done) {
    client.queryDeviceType({
      channel_id: channelId
    }, function(err, res) {
      assertError(err);

      should.exist(res.response_params.device_type);
      res.should.have.keys('request_id', 'response_params');
      done();
    });
  });
});

describe('edge case', function() {
  it('invalid params', function(done) {
    var client = Push.createClient({
      apiKey: 'xx',
      secretKey: 'oo'
    });

    client.verifyBind({
      user_id: userId
    }, function(err, res) {
      should.exist(err);
      should.not.exist(res);
      err.status.should.equal(400);
      err.code.should.equal(30602);
      (err instanceof Error).should.equal(true);
      done();
    });
  });

  it('invalid host', function(done) {
    var client = Push.createClient({
      host: 'localhost',
      apiKey: 'xx',
      secretKey: 'oo',
      agent: false
    });

    client.verifyBind({
      user_id: userId
    }, function(err, res) {
      should.exist(err);
      should.not.exist(res);
      (err instanceof Error).should.equal(true);
      done();
    });
  });
});

function assertError(error) {
  if (error) {
    console.error(error);
  }
  should.not.exist(error);
}
