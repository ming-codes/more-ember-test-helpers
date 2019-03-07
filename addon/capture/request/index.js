import { createXMLHttpRequestFactory } from './xhr';
import { createFetchFactory } from './fetch';
import { CapturedConnectionCollection } from './connection';
import { createCaptureContext } from '..';

// NOTE, I'm not trying to mock it. I'm trying intercept and spy on it.
export function captureNetworkConnectionFrom(callback) {
  let connections = [];

  return createCaptureContext({
    capture() {
      return callback();
    },

    setup() {
      let xhr = Object.getOwnPropertyDescriptor(window, 'XMLHttpRequest');
      let xhrFactory = createXMLHttpRequestFactory(xhr.value, connections);
      let fetch = Object.getOwnPropertyDescriptor(window, 'fetch');
      let fetchFactory = createFetchFactory(fetch.value, connections);

      Object.defineProperty(window, 'XMLHttpRequest', {
        get() {
          return xhrFactory;
        },

        set(value) {
          xhrFactory = createXMLHttpRequestFactory(value);
        }
      });

      Object.defineProperty(window, 'fetch', {
        get() {
          return fetchFactory;
        },

        set(value) {
          fetchFactory = createFetchFactory(value);
        }
      });

      return {
        xhr, fetch
      };
    },

    teardown({ xhr, fetch }) {
      Object.defineProperty(window, 'XMLHttpRequest', xhr);
      Object.defineProperty(window, 'fetch', fetch);
    },

    returns() {
      return new CapturedConnectionCollection(connections);
    }
  });
}
