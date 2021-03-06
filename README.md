# angular-pouchdb

[![Build Status][travis-image]][travis-url]

> AngularJS wrapper for PouchDB

A lightweight AngularJS service for PouchDB that;

* Wraps Pouch's methods with `$q`
* Makes Angular aware of asynchronous updates (via `$rootScope.$apply`)

[travis-image]: https://travis-ci.org/angular-pouchdb/angular-pouchdb.svg
[travis-url]: https://travis-ci.org/angular-pouchdb/angular-pouchdb

## Usage

1. Install `angular-pouchdb` via Bower:

    ```bash
    bower install --save angular-pouchdb/angular-pouchdb
    ```

2. Add `pouchdb` as a module dependency:

    ```js
    angular.module('app', ['pouchdb']);
    ```

3. Inject the `PouchDB` service in your app:

    ```js
    angular.service('service', function(PouchDB) {
      var db = new PouchDB('name');
    });
    ```

## Authors

* © 2013-2014 Wilfred Springer <http://nxt.flotsam.nl>
* © 2014 Tom Vincent <http://tlvince.com/contact>

## License

Released under the MIT License.
