'use strict';

describe('Angular PouchDb/CouchDb Replication Tests', function() {

  var pouchdb, doc;

  beforeEach(module('pouchdb'));
  beforeEach(inject(function(PouchDB) {
    pouchdb = PouchDB;
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

  it('should support local to remote replication', function (done) {
    recreate('local2', function(local) {
      recreate('http://localhost:5984/remote2', function(remote2) {
        local.replicate.to(remote2, {
          onChange: function () {
            remote2.get(doc._id).then(function (value) {
              expect(value, "local NOT replicated to remote").not.toBeNull();
              console.log("local replicated to remote");
              done();
            });
          },
          continous: true
        });
        local.put(doc);
      });
    });
  });

  it('should support replication from remote', function (done) {
    recreate('local3', function(local) {
      recreate('http://localhost:5984/remote3', function(remote3) {
        remote3.replicate.to(local, {
          onChange: function () {
            local.get(doc._id).then(function (value) {
              expect(value, "remote DID NOT replicate from remote").not.toBeNull();
              console.log("local replicated FROM remote");
              done();
            });
          }, continous: true
        });
        remote3.put(doc);
      });
    });
  });
});
