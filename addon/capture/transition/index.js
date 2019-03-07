import { Transition } from 'more-ember-test-helpers/-internals';
import { lookup } from 'more-ember-test-helpers/owner';
import { run } from '@ember/runloop';
import RSVP from 'rsvp';

import { createCaptureContext } from '..';

const { prototype } = Transition;

export function captureRouteTransitionsFrom(callback) {
  let captured = [];
  let captureId = Date.now();
  let opCount = 0;
  let router = lookup('router:main').reopen({
    _setOutlets() {
    }
  });

  // TODO router:main instrument
  // need to reopen nonelocation to track url for forward / back feature

  function captureTransition(callback) {
    return function(...argv) {
      let opId = (captureId + opCount++).toString(16);

      captured.push(opId);

      return callback(...argv).then(() => {
        return captured
          .slice(captured.indexOf(opId))
          .filter(transition => typeof transition === 'object');
      });
    };
  }

  function resolveAfterRender() {
    return new RSVP.Promise(resolve => {
      run.schedule('afterRender', resolve);
    });
  }

  return createCaptureContext({
    capture() {
      return callback({
        visit: captureTransition(url => {
          router.initialURL = url;
          router.startRouting();

          router.handleURL(url);

          return resolveAfterRender();
        }),
        linkTo: captureTransition((routeName, models, queryParams) => {
          router.transitionTo(routeName, models, queryParams);

          return resolveAfterRender();
        }),
        back: captureTransition(() => {
        }),
        forward: captureTransition(() => {
        }),
        links() {
          return [];
        }
      });
    },

    setup() {
      Object.defineProperties(prototype, {
        // The data property is common among
        // all Ember version
        data: {
          configurable: true,

          get() {
            return this.data;
          },

          set(value) {
            captured.push(this);

            Object.defineProperties(this, {
              data: {
                value
              }
            });
          }
        }
      });
    },

    teardown() {
      delete prototype.data;
    },

    returns() {
      return captured.filter(transition => typeof transition === 'object');
    }
  });
}
