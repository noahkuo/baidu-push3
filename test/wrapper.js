'use strict';

var should = require('should'),
  config = require('./config'),
  userId = config.userId,
  Push = require('..'),
  co = require('co');

describe('# thunkify', function() {
  config.wrapper = 'thunk';
  var client = Push.createClient(config);

  it('should query bind list', function(done) {
    co(function * () {
      var option = {
        user_id: userId
      };

      var res = yield client.queryBindList(option);

      res.request_id.should.above(0);
      res.response_params.should.have.keys('total_num', 'amount', 'binds');
      res.response_params.amount.should.equal(1);
    })(done);
  });

  it('should push message', function(done) {
    co(function * () {
      var option = {
        push_type: 1,
        user_id: userId,
        messages: ['hello'],
        msg_keys: ['title']
      };

      var res = yield client.pushMsg(option);

      res.response_params.success_amount.should.equal(1);
      res.response_params.msgids.length.should.equal(1);
    })(done);
  });
});

describe('# promisify', function() {
  config.wrapper = 'promise';
  var client = Push.createClient(config);

  it('should query bind list', function(done) {
    co(function * () {
      var option = {
        user_id: userId
      };

      var res = yield client.queryBindList(option);

      res.request_id.should.above(0);
      res.response_params.should.have.keys('total_num', 'amount', 'binds');
      res.response_params.amount.should.equal(1);
    })(done);
  });

  it('should push message', function(done) {
    co(function * () {
      var option = {
        push_type: 1,
        user_id: userId,
        messages: ['hello'],
        msg_keys: ['title']
      };

      var res = yield client.pushMsg(option);

      res.response_params.success_amount.should.equal(1);
      res.response_params.msgids.length.should.equal(1);
    })(done);
  });
});
