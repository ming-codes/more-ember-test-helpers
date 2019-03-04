import { module, test, skip } from 'qunit';
import { setupTest } from 'ember-qunit';
import * as serializer from 'more-ember-test-helpers/serializer';

module('Unit | serializer helper', function(hooks) {
  setupTest(hooks);

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

  skip('normalizeCreateRecordResponse', function() {
  });

  skip('normalizeDeleteRecordResponse', function() {
  });

  skip('normalizeUpdateRecordResponse', function() {
  });

  skip('normalizeFindAllResponse', function() {
  });

  skip('normalizeFindBelongsToResponse', function() {
  });

  skip('normalizeFindHasManyResponse', function() {
  });

  skip('normalizeFindManyResponse', function() {
  });

  skip('normalizeFindRecordResponse', function() {
  });

  skip('normalizeQueryRecordResponse', function() {
  });

  skip('normalizeQueryResponse', function() {
  });

  skip('normalizeSaveResponse', function() {
  });

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

  test('serializeAttribute', function(assert) {
    let document = serializer.serializeAttribute('user', 'firstName', 'Ben');

    assert.deepEqual(document, {
      firstName: 'Ben'
    });
  });

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

  skip('serializePolymorphicType', function() {
  });
});
