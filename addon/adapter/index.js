import { assert } from '@ember/debug';
import { get } from '@ember/object';
import RSVP from 'rsvp';

import { instrument } from './instrument';
import { createRecordRecursively, modelFor } from '../store';

/**
 * @function findRecord
 * @param {String} modelName
 *   The model name for the matching serializer that is under test.
 * @param {any} id
 *   The id for the model that the adapter is looking up
 * @return {AdapterRequest}
 */
export function findRecord(...argv) {
  return instrument.call(this, argv, 'findRecord');
}

/**
 * @function findAll
 * @param {String} modelName
 * @return {AdapterRequest}
 */
export function findAll(...argv) {
  return instrument.call(this, argv, 'findAll');
}

function findRelationship(modelName, relationship, link) {
  return instrument.call(this, [ modelName ], store => {
    let record = store.createRecord(modelName, {
      id: 1
    });

    store.push({
      data: {
        id: record.id,
        type: modelName,
        relationships: {
          [ relationship ]: {
            links: {
              related: link
            }
          }
        }
      }
    });

    return record.get(relationship);
  });
}

/**
 * Invokes the findBelongsTo hook on the target adapter
 * under test and returns an object that represents
 * the sent request.
 *
 * @function findBelongsTo
 * @param {String} modelName
 *   The model name for the matching adapter that is
 *   under test.
 * @param {String} relationshipKey
 *   The key of the relationship on the model.
 * @param {any} link
 *   The link references the relationship.
 * @return {AdapterRequest}
 */
export function findBelongsTo(modelName, relationshipKey, link) {
  let relationshipsByName = get(modelFor(modelName), 'relationshipsByName');
  let { options } = relationshipsByName.get(relationshipKey);

  assert('findBelongsTo hook requires the relationship to be async', options.async);

  return findRelationship(modelName, relationshipKey, link);
}

/**
 * Invokes the findHasMany hook on the target adapter
 * under test and returns an object that represents
 * the sent request.
 *
 * @function findHasMany
 * @param {String} modelName
 *   The model name for the matching adapter that is
 *   under test.
 * @param {String} relationshipKey
 *   The key of the relationship on the model.
 * @param {any} link
 *   The link references the relationship.
 * @return {AdapterRequest}
*/
export function findHasMany(modelName, relationshipKey, link) {
  let relationshipsByName = get(modelFor(modelName), 'relationshipsByName');
  let { options } = relationshipsByName.get(relationshipKey);

  assert('findHasMany hook requires the relationship to be async', options.async);

  return findRelationship(modelName, relationshipKey, link);
}

/**
 * Invokes the findMany hook on the target adapter
 * under test and returns an object that represents
 * the sent request.
 *
 * @function findMany
 * @param {String} modelName
 *   The model name for the matching adapter that is
 *   under test.
 * @param {any[]} ids
 *   The ids of the model objects to lookup.
 * @return {AdapterRequest}
 */
export function findMany(modelName, ids) {
  return instrument.call(this, [ modelName ], store => {
    const adapter = store.adapterFor(modelName);
    const coalesceFindRequests = adapter.get('coalesceFindRequests');

    assert('findMany operation requires coalesceFindRequests to be true', coalesceFindRequests);

    return RSVP.all(ids.map(id => {
      return store.findRecord(modelName, id)
    }));
  });
}

/**
 * Invokes the query hook on the target adapter
 * under test and returns an object that represents
 * the sent request.
 *
 * @function query
 * @param {String} modelName
 *   The model name for the matching adapter that is
 *   under test.
 * @param {Object} query
 *   The query object to be passed to the query hook
 * @return {AdapterRequest}
 */
export function query(...argv) {
  return instrument.call(this, argv, 'query');
}

/**
 * Invokes the queryRecord hook on the target adapter
 * under test and returns an object that represents
 * the sent request.
 *
 * @function queryRecord
 * @param {String} modelName
 *   The model name for the matching adapter that is
 *   under test.
 * @param {Object} query
 *   The query object to be passed to the queryRecord hook
 * @return {AdapterRequest}
 */
export function queryRecord(...argv) {
  return instrument.call(this, argv, 'queryRecord');
}

/**
 * Invokes the createRecord hook on the target adapter
 * under test and returns an object that represents
 * the sent request.
 *
 * @function createRecord
 * @param {String} modelName
 *   The model name for the matching adapter that is
 *   under test.
 * @param {Object} properties
 *   The model properties that is going to be converted
 *   into snapshot
 * @return {AdapterRequest}
 */
export function createRecord(modelName, properties) {
  return instrument.call(this, [modelName], store => {
    return createRecordRecursively(modelName, properties, store).save();
  });
}

/**
 * Invokes the updateRecord hook on the target adapter
 * under test and returns an object that represents
 * the sent request.
 *
 * @function updateRecord
 * @param {String} modelName
 *   The model name for the matching adapter that is
 *   under test.
 * @param {Object} properties
 *   The model properties that is going to be converted
 *   into snapshot
 * @return {AdapterRequest}
 */
export function updateRecord(modelName, properties) {
  return instrument.call(this, [modelName], (store) => {
    const record = createRecordRecursively(modelName, properties);

    store.push({
      data: {
        id: record.id,
        type: modelName
      }
    });

    return record.save();
  });
}

/**
 * Invokes the deleteRecord hook on the target adapter
 * under test and returns an object that represents
 * the sent request.
 *
 * @function deleteRecord
 * @param {String} modelName
 *   The model name for the matching adapter that is
 *   under test.
 * @param {Object} properties
 *   The model properties that is going to be converted
 *   into snapshot
 * @return {AdapterRequest}
 */
export function deleteRecord(modelName, properties) {
  return instrument.call(this, [modelName], (store) => {
    const record = createRecordRecursively(modelName, properties, store);

    store.push({
      data: {
        id: record.id,
        type: modelName
      }
    });

    record.deleteRecord();

    return record.save();
  });
}
