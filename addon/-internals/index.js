import Ember from 'ember';

const { registry, require } = Ember.__loader;

/* global requirejs */
function requireWithFallback(series) {
  for (let [ module, property ] of series) {
    if (requirejs._eak_seen[module]) {
      let object = requirejs(module);

      if (object) {
        return object[property];
      }
    }

    if (window[module]) {
      let object = window[module];

      if (object) {
        return object[property];
      }
    }

    if (registry[module]) {
      let object = require(module);

      if (object) {
        return object[property];
      }
    }
  }

  return null;
}

export const Transition = requireWithFallback([
  [ 'router_js', 'InternalTransition' ],
  [ 'router/transition', 'Transition' ],
  [ 'router', 'Transition' ]
]);

export const RESTSerializer = requireWithFallback([
  [ 'ember-data/serializers/rest', 'default' ],
  [ 'DS', 'RESTSerializer' ]
]);

export const JSONSerializer = requireWithFallback([
  [ 'ember-data/serializers/json', 'default' ],
  [ 'DS', 'JSONSerializer' ]
]);

export const JSONAPISerializer = requireWithFallback([
  [ 'ember-data/serializers/json-api', 'default' ],
  [ 'DS', 'JSONAPISerializer' ]
]);
