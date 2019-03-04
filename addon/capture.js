import { getContext } from '@ember/test-helpers/setup-context';
import { Transition } from './-internals';

const { prototype } = Transition;

Object.defineProperties(prototype, {
  // The data property is common among
  // all Ember version
  data: {
    get() {
      return this.data;
    },

    set(value) {
      this.__capture__();

      Object.defineProperties(this, {
        data: {
          value
        }
      });
    }
  },

  __capture__: {
    value() {
      this.__captured__.push(this);
    }
  }
});

/**
 * Captures all Transition objects created from callback
 *
 * @function captureRouteTransitionsFrom
 * @param {Function} callback
 */
export function captureRouteTransitionsFrom(callback) {
  let { owner } = getContext();
  let captureId = Date.now();
  let opCount = 0;
  let router = owner.lookup('router:main').reopen({
    _setOutlets() {
    }
  });

  prototype.__captured__ = [];

  function captureTransition(callback) {
    return function(...argv) {
      let opId = (captureId + opCount++).toString(16);
      let captured = prototype.__captured__;

      captured.push(opId);

      return callback(...argv).then(() => {
        return captured
          .slice(captured.indexOf(opId))
          .filter(transition => typeof transition === 'object');
      });
    };
  }

  let possiblePromise = callback({
    visit: captureTransition(url => {
      router.initialURL = url;
      router.startRouting();

      return router.handleURL(url);
    }),
    linkTo: captureTransition((/*routeName, models*/) => {
    }),
    back: captureTransition(() => {
    }),
    forward: captureTransition(() => {
    }),
    links() {
      return [];
    }
  });

  function teardown() {
    let captured = prototype.__captured__;

    prototype.__captured__= null;

    return captured.filter(transition => typeof transition === 'object');
  }

  if (possiblePromise && typeof possiblePromise.then === 'function') {
    return possiblePromise.then(teardown, teardown);
  } else {
    return teardown();
  }
}

// TODO Use sinon?
//export async function captureRequestsFrom(callback) { }

//// modify behavior of
//createSeamAround(object, '#@propertyOrMethod', function(stub) {
//  stub('method').returns();
//
//  expect('method')
//});

//export async function captureMicroDocumentChangeFrom(callback) { }
