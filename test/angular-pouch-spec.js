'use strict';

describe('Angular PouchDB', function() {

  var pouchdb, db, doc;

  beforeEach(module('pouchdb'));
  beforeEach(inject(function(PouchDB) {
    pouchdb = PouchDB;
    db = new PouchDB('db');
    doc = {
      _id: 'foo',
      title: 'bar'
    };
  }));

  function recreate(name, callback) {
    var db = new PouchDB(name);
    db.destroy().then(function() {
      db = new PouchDB(name);
      callback(db);
    })
  }

  function allKeys(obj) {
    var keys = [];
    // Include everything in the prototype chain
    for (var key in obj) {
      keys.push(key);
    }
    return keys;
  }

  function destroyDone(db, done) {
    return db.destroy().then(function(result) {
      expect(result.ok).toBe(true);
      done();
    })
  }

  it('should support replication', function (done) {
    recreate('local2', function(local2) {
      db.replicate.to(local2, {
        onChange: function () {
          local2.get(doc._id).then(function (value) {
            expect(value, "replication NOT supported").not.toBeNull();
            destroyDone(local2, done);
          })
        },
        continous: true
      });
      db.put(doc);
    });
  });

  it('should allow you to store and retrieve documents', function (done) {
    db.put(doc).then(function () {
      db.get(doc._id).then(function (result) {
        var retrieved = result;
        expect(retrieved).not.toBeNull();
        expect(retrieved.title).toBe('bar');
        done();
      })
    }).catch(function (error) {
      dump(error);
    });
  });

  it('should not introduce new instance methods', inject(function($window) {
    var raw = new $window.PouchDB('raw');
    var rawKeys = allKeys(raw);

    var dbKeys = allKeys(db);

    var result = dbKeys.every(function(key) {
      return rawKeys.indexOf(key) !== -1;
    });

    expect(result).toBe(true);
  }));

  it('should include all known public methods', function() {
    var methods = [
      'destroy',
      'put',
      'post',
      'get',
      'remove',
      'bulkDocs',
      'allDocs',
      'changes',
      'replicate',
      'sync',
      'putAttachment',
      'getAttachment',
      'removeAttachment',
      'query',
      'viewCleanup',
      'info',
      'compact',
      'revsDiff'
    ];

    var dbKeys = allKeys(db);

    var result = methods.every(function(method) {
      return dbKeys.indexOf(method) !== -1;
    });

    expect(result).toBe(true);
    expect(db.replicate.to).toBeDefined();
    expect(db.replicate.from).toBeDefined();
  });

  it('should resolve a DB post', function(done) {
    return db.post({})
      .then(function(result) {
        expect(result.ok).toBe(true);
        done();
      });
  });

  afterEach(function(done) {
    return destroyDone(db, done);
  });
});
