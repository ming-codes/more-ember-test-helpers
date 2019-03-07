import { get } from '@ember/object';

import { lookup } from './owner';

const guidMap = new WeakMap();

function guidFor(typeClass) {
  if (!guidMap.has(typeClass)) {
    guidMap.set(typeClass, 0);
  }

  let counter = guidMap.get(typeClass) + 1;

  guidMap.set(typeClass, counter + 1);

  return counter;
}

export function store() {
  return lookup('service:store', 'store:main');
}

export function modelFor(name) {
  return store().modelFor(name);
}

export function createRecordRecursively(modelName, properties, instance = store()) {
  let primaryTypeClass = instance.modelFor(modelName);
  let relationships = get(primaryTypeClass, 'relationshipsByName');

  let record = instance.createRecord(modelName, Object.keys(properties).reduce((accum, key) => {
    let value = properties[key];

    if (typeof value === 'object') {
      let relationship = relationships.get(key);
      // TODO handle fragment

      if (Array.isArray(value)) {
        accum[key] = value.map(item => {
          return createRecordRecursively(relationship.type, item, instance);
        });
      } else {
        accum[key] = createRecordRecursively(relationship.type, value, instance);
      }
    } else {
      accum[key] = value;
    }

    return accum;
  }, { id: guidFor(primaryTypeClass) }));

  if (properties.hasOwnProperty('id')) {
    instance.push({
      data: {
        id: properties.id,
        type: modelName
      }
    });
  }

  return record;
}
