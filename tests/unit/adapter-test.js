import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import * as adapter from 'more-ember-test-helpers/adapter';

module('Unit | adapter helper', function(hooks) {
  setupTest(hooks);

  // BEGIN-SNIPPET adapter.createRecord
  test('createRecord', function(assert) {
    let request = adapter.createRecord('user', {
    });

    assert.equal(request.url.pathname, '/users', 'url.pathname');
    assert.equal(request.method, 'POST', 'method');
  });
  // END-SNIPPET

  // BEGIN-SNIPPET adapter.updateRecord
  test('updateRecord', function(assert) {
    let request = adapter.updateRecord('user', {
      id: 1
    });

    assert.equal(request.url.pathname, '/users/1', 'url.pathname');
    assert.equal(request.method, 'PUT', 'method');
  });
  // END-SNIPPET

  // BEGIN-SNIPPET adapter.deleteRecord
  test('deleteRecord', function(assert) {
    let request = adapter.deleteRecord('user', {
      id: 1
    });

    assert.equal(request.url.pathname, '/users/1', 'url.pathname');
    assert.equal(request.method, 'DELETE', 'method');
  });
  // END-SNIPPET

  // BEGIN-SNIPPET adapter.findRecord
  test('findRecord', function(assert) {
    let request = adapter.findRecord('user', 1);

    assert.equal(request.url.pathname, '/users/1', 'url.pathname');
    assert.equal(request.method, 'GET', 'method');
  });
  // END-SNIPPET

  // BEGIN-SNIPPET adapter.findAll
  test('findAll', function(assert) {
    let request = adapter.findAll('user');

    assert.equal(request.url.pathname, '/users', 'url.pathname');
    assert.equal(request.method, 'GET', 'method');
  });
  // END-SNIPPET

  // BEGIN-SNIPPET adapter.findHasMany
  test('findHasMany', function(assert) {
    let link = '/users/1/posts';
    let request = adapter.findHasMany('user', 'posts', link);

    assert.equal(request.url.pathname, link, 'url.pathname');
    assert.equal(request.method, 'GET', 'method');
  });
  // END-SNIPPET

  // BEGIN-SNIPPET adapter.findBelongsTo
  test('findBelongsTo', function(assert) {
    let link = '/post/1/author';
    let request = adapter.findBelongsTo('post', 'author', link);

    assert.equal(request.url.pathname, link, 'url.pathname');
    assert.equal(request.method, 'GET', 'method');
  });
  // END-SNIPPET

  // BEGIN-SNIPPET adapter.findMany
  test('findMany', function(assert) {
    let request = adapter.findMany('user', [ 1, 2, 3 ]);

    assert.equal(request.method, 'GET', 'method');
    assert.equal(decodeURIComponent(request.url.search), '?ids[]=1&ids[]=2&ids[]=3');
  });
  // END-SNIPPET

  // BEGIN-SNIPPET adapter.queryRecord
  test('queryRecord', function(assert) {
    let request = adapter.queryRecord('user', {
      id: 1
    });

    assert.equal(request.url.pathname, '/users', 'url.pathname');
    assert.equal(request.method, 'GET', 'method');
  });
  // END-SNIPPET

  // BEGIN-SNIPPET adapter.query
  test('query', function(assert) {
    let request = adapter.query('user', {
      ids: [ 1, 2 ]
    });

    assert.equal(request.url.pathname, '/users', 'url.pathname');
    assert.equal(decodeURIComponent(request.url.search), '?ids[]=1&ids[]=2', 'url.search');
    assert.equal(request.method, 'GET', 'method');
  });
  // END-SNIPPET
});
