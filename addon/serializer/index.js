 import { run } from '@ember/runloop';

import { RESTSerializer, JSONSerializer, JSONAPISerializer } from '../-internals';

import { store, createRecordRecursively } from '../store';
import { NormalizedResponse } from './normalized-response';

const own = Object.prototype.hasOwnProperty;

function typeClassFor(type) {
 return store().modelFor(type);
}

function serializerFor(type) {
  return store().serializerFor(type);
}

function requestTypeFrom(serializer, payload) {
  if (serializer instanceof RESTSerializer) {
    if (Array.isArray(payload)) {
      return 'findAll';
    } else {
      return 'findRecord';
    }
  }

  if (serializer instanceof JSONSerializer) {
    if (Array.isArray(payload)) {
      return 'findAll';
    } else {
      return 'findRecord';
    }
  }

  if (serializer instanceof JSONAPISerializer) {
    if (Array.isArray(payload.data)) {
      return 'findAll';
    } else {
      return 'findRecord';
    }
  }

  throw new TypeError('Unable to infer requestType from serializer');
}

function idFrom(type, serializer, payload) {
  const primaryKey = serializer.get('primaryKey');

  if (serializer instanceof RESTSerializer) {
    if (Array.isArray(payload)) {
      return null;
    } else {
      return payload[serializer.payloadKeyFromModelName(type)][primaryKey];
    }
  }

  if (serializer instanceof JSONSerializer) {
    if (Array.isArray(payload)) {
      return null;
    } else {
      return payload[primaryKey];
    }
  }

  if (serializer instanceof JSONAPISerializer) {
    if (Array.isArray(payload.data)) {
      return null;
    } else {
      return payload.data.id;
    }
  }

  throw new TypeError('Unable to infer id from serializer');
}

function lookupPrototype(object, property) {
  if (object) {
    if (own.call(object, property)) {
      return object;
    } else {
      return lookupPrototype(Object.getPrototypeOf(object), property);
    }
  }

  return null;
}

/**
 * {{docs-snippet name="serializer.normalize"}}
 *
 * @function normalize
 * @param {String} modelName
 *   The model name for the matching serializer that is under test.
 * @param {Object} payload
 *   The payload that is going to be normalized
 * @param {any} id
 *   The id for the model represented by payload. By default,
 *   the helper will try to infer from the model name and payload.
 * @param {String} requestType
 *   The request type used by the adapter invoking the normalizeResponse hook.
 *   By default, the helper will try to infer from the model name and payload.
 * @return {NormalizedResponse}
 */
export function normalize(modelName, payload) {
  return serializerFor(modelName).normalize(typeClassFor(modelName), payload);
}

/**
 * {{docs-snippet name="serializer.normalizeResponse"}}
 *
 * @function normalizeResponse
 * @param {String} modelName
 *   The model name for the matching serializer that is under test.
 * @param {Object} payload
 *   The payload that is going to be normalized
 * @param {any} id
 *   The id for the model represented by payload. By default,
 *   the helper will try to infer from the model name and payload.
 * @param {String} requestType
 *   The request type used by the adapter invoking the normalizeResponse hook.
 *   By default, the helper will try to infer from the model name and payload.
 * @return {NormalizedResponse}
 */
export function normalizeResponse(modelName, payload, id, requestType, method = 'normalizeResponse') {
  const serializer = serializerFor(modelName);

  // Tries to be smart and figure out what we intend to do.
  if (typeof requestType === 'undefined') {
    return normalizeResponse(modelName, payload, id, requestTypeFrom(serializer, payload));
  }

  if (serializer instanceof JSONSerializer) {
    let proto = lookupPrototype(serializer, method);
    let original = proto[method];

    proto[method] = function(...argv) {
      return argv;
    };

    let [ storeParam, primaryModelClassParam, rawParam, idParam, requestTypeParam ] = serializer.normalizeResponse(store(), typeClassFor(modelName), payload, id || idFrom(modelName, serializer, payload), requestType);

    proto[method] = original;

    return new NormalizedResponse({
      get raw() {
        return rawParam;
      },

      get jsonapi() {
        return original.call(serializer, storeParam, primaryModelClassParam, rawParam, idParam, requestTypeParam);
      }
    });
  }

  return new NormalizedResponse({
    get jsonapi() {
      return serializer.normalizeResponse(store(), typeClassFor(modelName), payload, id || idFrom(modelName, serializer, payload), requestType);
    }
  });
}

/**
 * {{docs-snippet name="serializer.normalizeSingleResponse"}}
 *
 * @function normalizeSingleResponse
 * @param {String} modelName
 *   The model name for the matching serializer that is under test.
 * @param {Object} payload
 *   The payload that is going to be normalized
 * @param {any} id
 *   The id for the model represented by payload. By default,
 *   the helper will try to infer from the model name and payload.
 * @param {String} requestType
 *   The request type used by the adapter invoking the normalizeResponse hook.
 *   By default, the helper will try to infer from the model name and payload.
 * @return {NormalizedResponse}
 */
export function normalizeSingleResponse(modelName, payload, id = null, requestType = 'findRecord') {
  return normalizeResponse(modelName, payload, id, requestType, 'normalizeSingleResponse');
}

/**
 * {{docs-snippet name="serializer.normalizeArrayResponse"}}
 *
 * @function normalizeArrayResponse
 * @param {String} modelName
 *   The model name for the matching serializer that is under test.
 * @param {Object} payload
 *   The payload that is going to be normalized
 * @param {any} id
 *   The id for the model represented by payload. By default,
 *   the helper will try to infer from the model name and payload.
 * @param {String} requestType
 *   The request type used by the adapter invoking the normalizeResponse hook.
 *   By default, the helper will try to infer from the model name and payload.
 * @return {NormalizedResponse}
 */
export function normalizeArrayResponse(modelName, payload, id = null, requestType = 'findAll') {
  return normalizeResponse(modelName, payload, id, requestType, 'normalizeArrayResponse');
}

/**
 * {{docs-snippet name="serializer.normalizeCreateRecordResponse"}}
 *
 * @function normalizeCreateRecordResponse
 * @param {String} modelName
 *   The model name for the matching serializer that is under test.
 * @param {Object} payload
 *   The payload that is going to be normalized
 * @param {any} id
 *   The id for the model represented by payload. By default,
 *   the helper will try to infer from the model name and payload.
 * @param {String} requestType
 *   The request type used by the adapter invoking the normalizeResponse hook.
 *   By default, the helper will try to infer from the model name and payload.
 * @return {NormalizedResponse}
 */
export function normalizeCreateRecordResponse(modelName, payload, id = null, requestType = 'createRecord') {
  return normalizeResponse(modelName, payload, id, requestType, 'normalizeCreateRecordResponse');
}

/**
 * {{docs-snippet name="serializer.normalizeDeleteRecordResponse"}}
 *
 * @function normalizeDeleteRecordResponse
 * @param {String} modelName
 *   The model name for the matching serializer that is under test.
 * @param {Object} payload
 *   The payload that is going to be normalized
 * @param {any} id
 *   The id for the model represented by payload. By default,
 *   the helper will try to infer from the model name and payload.
 * @param {String} requestType
 *   The request type used by the adapter invoking the normalizeResponse hook.
 *   By default, the helper will try to infer from the model name and payload.
 * @return {NormalizedResponse}
 */
export function normalizeDeleteRecordResponse(modelName, payload, id = null, requestType = 'deleteRecord') {
  return normalizeResponse(modelName, payload, id, requestType, 'normalizeDeleteRecordResponse');
}

/**
 * {{docs-snippet name="serializer.normalizeUpdateRecordResponse"}}
 *
 * @function normalizeUpdateRecordResponse
 * @param {String} modelName
 *   The model name for the matching serializer that is under test.
 * @param {Object} payload
 *   The payload that is going to be normalized
 * @param {any} id
 *   The id for the model represented by payload. By default,
 *   the helper will try to infer from the model name and payload.
 * @param {String} requestType
 *   The request type used by the adapter invoking the normalizeResponse hook.
 *   By default, the helper will try to infer from the model name and payload.
 * @return {NormalizedResponse}
 */
export function normalizeUpdateRecordResponse(modelName, payload, id = null, requestType = 'updateRecord') {
  return normalizeResponse(modelName, payload, id, requestType, 'normalizeUpdateRecordResponse');
}

/**
 * {{docs-snippet name="serializer.normalizeFindAllResponse"}}
 *
 * @function normalizeFindAllResponse
 * @param {String} modelName
 *   The model name for the matching serializer that is under test.
 * @param {Object} payload
 *   The payload that is going to be normalized
 * @param {any} id
 *   The id for the model represented by payload. By default,
 *   the helper will try to infer from the model name and payload.
 * @param {String} requestType
 *   The request type used by the adapter invoking the normalizeResponse hook.
 *   By default, the helper will try to infer from the model name and payload.
 * @return {NormalizedResponse}
 */
export function normalizeFindAllResponse(modelName, payload, id = null, requestType = 'findAll') {
  return normalizeResponse(modelName, payload, id, requestType, 'normalizeFindAllResponse');
}

/**
 * {{docs-snippet name="serializer.normalizeFindBelongsToResponse"}}
 *
 * @function normalizeFindBelongsToResponse
 * @param {String} modelName
 *   The model name for the matching serializer that is under test.
 * @param {Object} payload
 *   The payload that is going to be normalized
 * @param {any} id
 *   The id for the model represented by payload. By default,
 *   the helper will try to infer from the model name and payload.
 * @param {String} requestType
 *   The request type used by the adapter invoking the normalizeResponse hook.
 *   By default, the helper will try to infer from the model name and payload.
 * @return {NormalizedResponse}
 */
export function normalizeFindBelongsToResponse(modelName, payload, id = null, requestType = 'findBelongsTo') {
  return normalizeResponse(modelName, payload, id, requestType, 'normalizeFindBelongsToResponse');
}

/**
 * {{docs-snippet name="serializer.normalizeFindHasManyResponse"}}
 *
 * @function normalizeFindHasManyResponse
 * @param {String} modelName
 *   The model name for the matching serializer that is under test.
 * @param {Object} payload
 *   The payload that is going to be normalized
 * @param {any} id
 *   The id for the model represented by payload. By default,
 *   the helper will try to infer from the model name and payload.
 * @param {String} requestType
 *   The request type used by the adapter invoking the normalizeResponse hook.
 *   By default, the helper will try to infer from the model name and payload.
 * @return {NormalizedResponse}
 */
export function normalizeFindHasManyResponse(modelName, payload, id = null, requestType = 'findHasMany') {
  return normalizeResponse(modelName, payload, id, requestType, 'normalizeFindHasManyResponse');
}

/**
 * {{docs-snippet name="serializer.normalizeFindManyResponse"}}
 *
 * @function normalizeFindManyResponse
 * @param {String} modelName
 *   The model name for the matching serializer that is under test.
 * @param {Object} payload
 *   The payload that is going to be normalized
 * @param {any} id
 *   The id for the model represented by payload. By default,
 *   the helper will try to infer from the model name and payload.
 * @param {String} requestType
 *   The request type used by the adapter invoking the normalizeResponse hook.
 *   By default, the helper will try to infer from the model name and payload.
 * @return {NormalizedResponse}
 */
export function normalizeFindManyResponse(modelName, payload, id = null, requestType = 'findMany') {
  return normalizeResponse(modelName, payload, id, requestType, 'normalizeFindManyResponse');
}

/**
 * {{docs-snippet name="serializer.normalizeFindRecordResponse"}}
 *
 * @function normalizeFindRecordResponse
 * @param {String} modelName
 *   The model name for the matching serializer that is under test.
 * @param {Object} payload
 *   The payload that is going to be normalized
 * @param {any} id
 *   The id for the model represented by payload. By default,
 *   the helper will try to infer from the model name and payload.
 * @param {String} requestType
 *   The request type used by the adapter invoking the normalizeResponse hook.
 *   By default, the helper will try to infer from the model name and payload.
 * @return {NormalizedResponse}
 */
export function normalizeFindRecordResponse(modelName, payload, id = null, requestType = 'findRecord') {
  return normalizeResponse(modelName, payload, id, requestType, 'normalizeFindRecordResponse');
}

/**
 * {{docs-snippet name="serializer.normalizeQueryRecordResponse"}}
 *
 * @function normalizeQueryRecordResponse
 * @param {String} modelName
 *   The model name for the matching serializer that is under test.
 * @param {Object} payload
 *   The payload that is going to be normalized
 * @param {any} id
 *   The id for the model represented by payload. By default,
 *   the helper will try to infer from the model name and payload.
 * @param {String} requestType
 *   The request type used by the adapter invoking the normalizeResponse hook.
 *   By default, the helper will try to infer from the model name and payload.
 * @return {NormalizedResponse}
 */
export function normalizeQueryRecordResponse(modelName, payload, id = null, requestType = 'queryRecord') {
  return normalizeResponse(modelName, payload, id, requestType, 'normalizeQueryRecordResponse');
}

/**
 * {{docs-snippet name="serializer.normalizeQueryResponse"}}
 *
 * @function normalizeQueryResponse
 * @param {String} modelName
 *   The model name for the matching serializer that is under test.
 * @param {Object} payload
 *   The payload that is going to be normalized
 * @param {any} id
 *   The id for the model represented by payload. By default,
 *   the helper will try to infer from the model name and payload.
 * @param {String} requestType
 *   The request type used by the adapter invoking the normalizeResponse hook.
 *   By default, the helper will try to infer from the model name and payload.
 * @return {NormalizedResponse}
 */
export function normalizeQueryResponse(modelName, payload, id = null, requestType = 'query') {
  return normalizeResponse(modelName, payload, id, requestType, 'normalizeQueryResponse');
}

/**
 * {{docs-snippet name="serializer.normalizeSaveResponse"}}
 *
 * @function normalizeSaveResponse
 * @param {String} modelName
 *   The model name for the matching serializer that is under test.
 * @param {Object} payload
 *   The payload that is going to be normalized
 * @param {any} id
 *   The id for the model represented by payload. By default,
 *   the helper will try to infer from the model name and payload.
 * @param {String} requestType
 *   The request type used by the adapter invoking the normalizeResponse hook.
 *   By default, the helper will try to infer from the model name and payload.
 * @return {NormalizedResponse}
 */
export function normalizeSaveResponse(modelName, payload, id = null, requestType = 'updateRecord') {
  return normalizeResponse(modelName, payload, id, requestType, 'normalizeSaveResponse');
}

/**
 * {{docs-snippet name="serializer.serialize"}}
 *
 * @function serialize
 * @param {String} modelName
 *   The model name for the matching serializer that is under test.
 * @param {Object} properties
 *   The properties of the model to be set to. Any relationships
 *   are recursively constructed.
 * @param {Object} options
 *   The options hash to be passed to the serialize call. Default to
 *   `{ includeId: true }`.
 */
export function serialize(modelName, properties, options = { includeId: true }) {
  let record = run(function() {
    return createRecordRecursively(modelName, properties);
  });

  return record.serialize(options);
}

/**
 * {{docs-snippet name="serializer.serializeIntoHash"}}
 *
 * @function serializeIntoHash
 * @param {String} modelName
 *   The model name for the matching serializer that is under test.
 * @param {Object} properties
 *   The properties of the model to be set to. Any relationships
 *   are recursively constructed.
 * @param {Object} options
 *   The options hash to be passed to the serialize call. Default to
 *   `{ includeId: true }`.
 */
export function serializeIntoHash(modelName, properties, options = { includeId: true }) {
  let record = run(function() {
    return createRecordRecursively(modelName, properties);
  });

  let serializer = serializerFor(modelName);
  let typeClass = typeClassFor(modelName);

  serializer.serialize = function(snapshot) {
    return snapshot;
  };

  let snapshot = record.serialize(options);
  let result = {};

  delete serializer.serialize;

  serializer.serializeIntoHash(result, typeClass, snapshot, options)

  return result;
}

/**
 * {{docs-snippet name="serializer.serializeAttribute"}}
 *
 * @function serializeAttribute
 * @param {String} modelName
 *   The model name for the matching serializer that is under test.
 * @param {String} key
 *   The key of the model attribute to be serialized.
 * @param {any} value
 *   The value of the model attribute to be serialized.
 */
export function serializeAttribute(modelName, key, value) {
  let record = run(function() {
    return createRecordRecursively(modelName, {
      [ key ]: value
    });
  });
  let serializer = serializerFor(modelName);
  let original = serializer.serializeAttribute;
  let result = null;

  serializer.serializeAttribute = function(snapshot, json, targetKey, attribute) {
    if (key === targetKey) {
      result = {};
      return original.call(this, snapshot, result, targetKey, attribute);
    }

    return original.call(this, snapshot, {}, targetKey, attribute);
  };

  record.serialize();

  delete serializer.serializeAttribute;

  return result;
}

/**
 * {{docs-snippet name="serializer.serializeBelongsTo"}}
 *
 * @function serializeBelongsTo
 * @param {String} modelName
 *   The model name for the matching serializer that is under test.
 * @param {String} key
 *   The key of the model relationship to be serialized.
 * @param {any} value
 *   The value of the model relationship to be serialized.
 */
export function serializeBelongsTo(modelName, key, value) {
  let record = run(function() {
    return createRecordRecursively(modelName, {
      [ key ]: value
    });
  });
  let serializer = serializerFor(modelName);
  let original = serializer.serializeBelongsTo;
  let result = null;

  serializer.serializeBelongsTo = function(snapshot, json, relationship) {
    let { key: targetKey } = relationship;

    if (key === targetKey) {
      result = {};
      return original.call(this, snapshot, result, relationship);
    }

    return original.call(this, snapshot, {}, relationship);
  };

  record.serialize();

  delete serializer.serializeBelongsTo;

  return result;
}

/**
 * {{docs-snippet name="serializer.serializeHasMany"}}
 *
 * @function serializeHasMany
 * @param {String} modelName
 *   The model name for the matching serializer that is under test.
 * @param {String} key
 *   The key of the model relationship to be serialized.
 * @param {any} value
 *   The value of the model relationship to be serialized.
 */
export function serializeHasMany(modelName, key, value) {
  let record = run(function() {
    return createRecordRecursively(modelName, {
      [ key ]: value
    });
  });
  let serializer = serializerFor(modelName);
  let original = serializer.serializeHasMany;
  let result = null;

  serializer._shouldSerializeHasMany = serializer.shouldSerializeHasMany = function() {
    return true;
  };

  serializer.serializeHasMany = function(snapshot, json, relationship) {
    let { key: targetKey } = relationship;

    if (key === targetKey) {
      result = {};
      return original.call(this, snapshot, result, relationship);
    }
  };

  record.serialize();

  delete serializer._shouldSerializeHasMany;
  delete serializer.shouldSerializeHasMany;
  delete serializer.serializeHasMany;

  return result;
}

//TODO
//export function serializePolymorphicType(modelName, key, value) {
//}
