var DbStore = require("..");

var dbstore = new DbStore();

var async = require('async');
var assert = require('assert');

var rand = (Math.random() * 1e6).toFixed(0);

var openRes = dbstore.open(`foo-${rand}.db`);
console.log("opened", " ret=", openRes);
  
function test_put_get(done) {
  console.log("-- test_put_get");

  for (var i = 0; i < 5000; ++i) {
    var key = i.toFixed(0);
    var val = (Math.random() * 1e6).toFixed(0);

    dbstore.put(key, val)
    console.log("put", key);
    var str = dbstore.get(key)
    console.log("get", key, "=>", str.toString());
    assert(str.toString() === val);
    console.log("del", key);
    dbstore.del(key);
    dbstore.get(key);
  }
  done();
}

function test_json(done) {
  console.log("-- test_json");
  var opts = { json: true };
  var put_data = { test: "json1", n: 1 };
  dbstore.put("json1", put_data, opts)
  console.log("put json1", put_data);
  var data = dbstore.get("json1", opts);
  console.log("get json1", data);
  assert(typeof data == 'object');
  assert(data.test == put_data.test);
  assert(data.n == put_data.n);
  console.log("del json1");
  dbstore.del("json1");
  done();
}

async.series([test_put_get, test_json], function (err) {
  assert.ifError(err);
  var closeRes = dbstore.close();
  console.log("closed", "ret=", closeRes);
});

