import { module, test, skip } from 'qunit';
import { setupTest } from 'ember-qunit';
import * as serializer from 'more-ember-test-helpers/serializer';

module('Unit | serializer helper', function(hooks) {
  setupTest(hooks);

  // BEGIN-SNIPPET serializer.normalizeSingleResponse
  test('normalizeSingleResponse', function(assert) {
    let { jsonapi, raw } = serializer.normalizeSingleResponse('user', {
      id: 1,
      firstName: 'Ben',
      lastName: 'Jerry'
    });

    assert.deepEqual(raw, {
      id: 1,
      firstName: 'Ben',
      lastName: 'Jerry'
    });

    assert.deepEqual(jsonapi, {
      data: {
        id: '1',
        type: 'user',
        attributes: {
          firstName: 'Ben',
          lastName: 'Jerry'
        },
        relationships: {
        }
      },
      included: []
    });
  });
  // END-SNIPPET

  // BEGIN-SNIPPET serializer.normalizeArrayResponse
  test('normalizeArrayResponse', function(assert) {
    let { jsonapi, raw } = serializer.normalizeArrayResponse('user', [
      {
        id: 1,
        firstName: 'Ben',
        lastName: 'Jerry'
      }
    ]);

    assert.deepEqual(raw, [
      {
        id: 1,
        firstName: 'Ben',
        lastName: 'Jerry'
      }
    ]);

    assert.deepEqual(jsonapi, {
      data: [
        {
          id: '1',
          type: 'user',
          attributes: {
            firstName: 'Ben',
            lastName: 'Jerry'
          },
          relationships: {
          }
        }
      ],
      included: []
    });
  });
  // END-SNIPPET

  // BEGIN-SNIPPET serializer.normalizeCreateRecordResponse
  skip('normalizeCreateRecordResponse', function() {
  });
  // END-SNIPPET

  // BEGIN-SNIPPET serializer.normalizeDeleteRecordResponse
  skip('normalizeDeleteRecordResponse', function() {
  });
  // END-SNIPPET

  // BEGIN-SNIPPET serializer.normalizeUpdateRecordResponse
  skip('normalizeUpdateRecordResponse', function() {
  });
  // END-SNIPPET

  // BEGIN-SNIPPET serializer.normalizeFindAllResponse
  skip('normalizeFindAllResponse', function() {
  });
  // END-SNIPPET

  // BEGIN-SNIPPET serializer.normalizeFindBelongsToResponse
  skip('normalizeFindBelongsToResponse', function() {
  });
  // END-SNIPPET

  // BEGIN-SNIPPET serializer.normalizeFindHasManyResponse
  skip('normalizeFindHasManyResponse', function() {
  });
  // END-SNIPPET

  // BEGIN-SNIPPET serializer.normalizeFindManyResponse
  skip('normalizeFindManyResponse', function() {
  });
  // END-SNIPPET

  // BEGIN-SNIPPET serializer.normalizeFindRecordResponse
  skip('normalizeFindRecordResponse', function() {
  });
  // END-SNIPPET

  // BEGIN-SNIPPET serializer.normalizeQueryRecordResponse
  skip('normalizeQueryRecordResponse', function() {
  });
  // END-SNIPPET

  // BEGIN-SNIPPET serializer.normalizeQueryResponse
  skip('normalizeQueryResponse', function() {
  });
  // END-SNIPPET

  // BEGIN-SNIPPET serializer.normalizeSaveResponse
  skip('normalizeSaveResponse', function() {
  });
  // END-SNIPPET

  // BEGIN-SNIPPET serializer.serialize
  test('serialize', function(assert) {
    let document = serializer.serialize('user', {
      id: 1,
      firstName: 'Ben',
      lastName: 'Jerry'
    })

    assert.deepEqual(document, {
      id: '1',
      firstName: 'Ben',
      lastName: 'Jerry'
    });
  });
  // END-SNIPPET

  // BEGIN-SNIPPET serializer.serializeIntoHash
  test('serializeIntoHash', function(assert) {
    let document = serializer.serializeIntoHash('user', {
      id: 1,
      firstName: 'Ben',
      lastName: 'Jerry'
    })

    assert.deepEqual(document, {
      id: '1',
      firstName: 'Ben',
      lastName: 'Jerry'
    });
  });
  // END-SNIPPET

  // BEGIN-SNIPPET serializer.serializeAttribute
  test('serializeAttribute', function(assert) {
    let document = serializer.serializeAttribute('user', 'firstName', 'Ben');

    assert.deepEqual(document, {
      firstName: 'Ben'
    });
  });
  // END-SNIPPET

  // BEGIN-SNIPPET serializer.serializeBelongsTo
  test('serializeBelongsTo', function(assert) {
    let document = serializer.serializeBelongsTo('post', 'author', {
      id: 1,
      firstName: 'Ben',
      lastName: 'Jerry'
    });

    assert.deepEqual(document, {
      author: '1'
    });
  });
  // END-SNIPPET

  // BEGIN-SNIPPET serializer.serializeHasMany
  test('serializeHasMany', function(assert) {
    let document = serializer.serializeHasMany('user', 'posts', [
      {
        id: 1,
        title: 'Hello'
      }
    ]);

    assert.deepEqual(document, {
      posts: [ '1' ]
    });
  });
  // END-SNIPPET

  // BEGIN-SNIPPET serializer.serializePolymorphicType
  skip('serializePolymorphicType', function() {
  });
  // END-SNIPPET
});
